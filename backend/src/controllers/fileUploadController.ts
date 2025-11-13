import { existsSync, unlinkSync, promises as fsPromises } from 'node:fs'
import { apiConfig } from '../config/apiConfig.js'
import { randomUUID } from 'node:crypto'
import { getProcessor } from '../service/getProcessor.js'
import type { Request, Response } from 'express'
import { repairBreakLines } from '../service/repairBreakLines.js'
import { tokenizeBlocks } from '../service/tokenizeBlocks.js'
import { tokenizeInline } from '../service/tokenizeInline.js'
import { SseEmitter } from '../service/SseEmitter.js'

const fileUploadController = async (req: Request, res: Response) => {
  const clientId = randomUUID()
  const emitter = new SseEmitter(res)
  if (!res.getHeaders()) {
    // Inicializar SSE
    emitter.init()
  }
  const { file } = req
  if (!file) {
    emitter.send({ type: 'error', error: 'No file uploaded' })
    emitter.end()
    return
  }

  const { originalname, path: filePath, mimetype } = file
  const fileExt = (originalname.split('.').pop() ?? '').toLowerCase()
  const normalizedMime = (mimetype ?? '').toLowerCase()
  const accepted = apiConfig.ACCEPTED_MIME_TYPES.map((x: string) => x.toLowerCase())

  // Validación de tipo de archivo
  const isExtAccepted = accepted.includes(fileExt)
  const isMimeAccepted = accepted.includes(normalizedMime)
  if (!isExtAccepted && !isMimeAccepted) {
    try {
      if (existsSync(filePath)) await fsPromises.unlink(filePath)
    } catch (err) {
      console.warn('Failed to unlink invalid file:', err)
    }

    emitter.send({
      type: 'error',
      error: `Los formatos permitidos son: ${apiConfig.ACCEPTED_MIME_TYPES.join(', ')}.`
    })
    emitter.end()
    return
  }

  let clientDisconnected = false

  res.on('close', () => {
    console.log(`CLIENT - ${clientId} - DISCONNECTED`)
    clientDisconnected = true
    emitter.closed = true
  })

  res.on('finish', () => {
    emitter.closed = true
  })

  const processor = getProcessor(filePath, fileExt, normalizedMime)

  try {
    const totalPages = await processor.getTotalPages()
    const initPage = Math.max(1, Number(req.body.initPage ?? 1))
    let endPage = Number(req.body.endPage ?? totalPages)
    if (!Number.isFinite(endPage) || endPage <= 0) endPage = totalPages
    if (endPage > totalPages) endPage = totalPages

    if (initPage > endPage) {
      emitter.send({
        type: 'error',
        error: `Rango inválido de páginas. Primera página: ${initPage}, Total de páginas: ${totalPages}`
      })
      emitter.end()
      return
    }

    emitter.send({
      type: 'info',
      totalPages,
      filename: originalname,
      initPage,
      endPage
    })

    // 🔹 Procesar página a página (sin workers, secuencial)
    for (let pageNumber = initPage; pageNumber <= endPage; pageNumber++) {
      if (clientDisconnected) break

      try {
        const pageText = await processor.extractPageText(pageNumber)
        if (!pageText?.trim()) continue

        const rawTextCleaned = repairBreakLines(pageText)
        const { blocks, textCleaned } = tokenizeBlocks(rawTextCleaned)

        emitter.send({
          type: 'page',
          pageNumber,
          rawText: pageText,
          blocks,
          textCleaned,
          progress: Math.round((pageNumber / endPage) * 100),
          extension: fileExt
        })
      } catch (err) {
        emitter.send({
          type: 'error',
          pageNumber,
          error: `Error al procesar la página N°${pageNumber}: ${(err as Error).message}`
        })
      }
    }

    if (!clientDisconnected) {
      emitter.send({
        type: 'complete',
        message: 'Extracción y procesamiento completados.'
      })
    }

    emitter.end()
  } catch (error: any) {
    console.error('❌ Error global en controlador:', error)
    if (!emitter.closed) {
      emitter.send({ type: 'error', error: error.message })
      emitter.end()
    }
  } finally {
    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath)
      } catch (e) {
        console.warn('⚠️ No se pudo eliminar archivo temporal:', e)
      }
    }
  }
}

export default fileUploadController
