import type { NextFunction, Request, Response } from 'express'
import { join } from 'path'
import { existsSync, unlinkSync } from 'fs'
import { apiConfig } from '../config/apiConfig.js'
import { readdir } from 'fs/promises'
import { sendEventStream } from '../utils/sendEventStream.js'

const MAX_FILES = 1
const SLEEP_MS = 1000
const sleep = () => new Promise((resolve) => setTimeout(resolve, SLEEP_MS))

export async function queueMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileId, ext, lang, initPage, endPage, fileName: originalFileName } = req.query
    const fileName = `${fileId}.${ext}`
    const dirPath = apiConfig.PATH_DIR_TEMP_FILES
    const filePath = join(dirPath, fileName)

    if (!fileId) throw new Error('Missing fileId')
    if (!existsSync(dirPath)) throw new Error("Tem directory doesn't exist")
    if (!existsSync(filePath)) throw new Error("File doesn't exist")

    req.body = {
      filePath,
      lang,
      initPage,
      endPage,
      fileName: originalFileName
    } as any

    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    })
    res.on('close', () => {
      if (existsSync(filePath)) {
        unlinkSync(filePath)
      }
      return
    })
    const files = await readdir(dirPath)
    if (files.length > 5) {
      sendEventStream(res, {
        eventName: 'errorReached',
        data: null
      })
      res.end()
      if (existsSync(filePath)) {
        unlinkSync(filePath)
      }
      return
    }
    let isFull = false
    while (!isFull) {
      const files = await readdir(dirPath)
      const activeIds = files
        .filter((f) => /^\d+\..+$/.test(f))
        .sort((a, b) => {
          const numA = parseInt(a.split('.')[0]!, 10)
          const numB = parseInt(b.split('.')[0]!, 10)
          return numA - numB
        })
      const position = activeIds.indexOf(fileName) + 1 - MAX_FILES
      if (position < MAX_FILES) {
        isFull = true
      } else {
        sendEventStream(res, {
          eventName: 'queued',
          data: { position: position }
        })
        await sleep()
      }
    }

    next()
  } catch (error: any) {
    sendEventStream(res, {
      eventName: 'errorEvent',
      data: { message: error.message }
    })
  }
}
