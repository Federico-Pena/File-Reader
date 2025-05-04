import type { Request, Response } from 'express'
import { apiConfig } from '../config/apiConfig.js'
import { readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'

const fileUploadController = async (req: Request, res: Response) => {
  try {
    if (!req.file || !req.file.buffer) {
      res.status(400).json({ error: "Can't find file" })
      return
    }
    const { lang, initPage, endPage } = req.body
    const { buffer, originalname } = req.file
    const fileExt = originalname.split('.').pop()?.toLowerCase() || ''
    const mimeTypes = apiConfig.ACCEPTED_MIME_TYPES

    if (!mimeTypes.includes(fileExt)) {
      const clientMimeTypes = mimeTypes.map((type) => `"${type}"`).join(', ')
      res.status(400).json({ error: `Formats allowed are: ${clientMimeTypes}.` })
      return
    }

    const dirPath = apiConfig.PATH_DIR_TEMP_FILES
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true })
    }
    const files = await readdir(dirPath)
    const ids = files
      .map((f) => f.split('.')[0])
      .filter((s): s is string => !!s)
      .map((s) => parseInt(s, 10))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b)

    const fileId = (ids.pop() ?? 0) + 1

    const fileName = `${fileId}.${fileExt}`
    const tempPath = join(dirPath, fileName)

    await writeFile(tempPath, buffer)
    const baseUrl = `${req.get('host')}${apiConfig.API_ROUTES.streamingFile}`
    const url = `https://${baseUrl}?fileId=${fileId}&ext=${fileExt}&lang=${lang}&initPage=${initPage}&endPage=${endPage}`

    res.status(200).json({ url })
  } catch (error: any) {
    console.error('fileUploadController error', error)
    res.status(500).json({ error: "Can't upload file" })
  }
}

export default fileUploadController
