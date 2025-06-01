import type { Request, Response } from 'express'
import { join } from 'path'
import os from 'node:os'
import { spawn } from 'child_process'
import readline from 'readline'
import { existsSync, unlinkSync } from 'node:fs'
import { sendEventStream } from '../utils/sendEventStream.js'
import { saveOCRPageFixture } from '../utils/saveOCRPageFixture.js'

const scriptPath = join(process.cwd(), 'python', 'main.py')
const isWindows = os.platform() === 'win32'
const pythonPath = isWindows
  ? join(process.cwd(), 'venv', 'Scripts', 'python.exe')
  : '/opt/venv/bin/python'

export const streamController = (req: Request, res: Response) => {
  const { fileName, filePath, lang, initPage, endPage } = req.body
  const payload = { filePath, lang, initPage, endPage }
  try {
    const pythonProcess = spawn(pythonPath, [scriptPath, JSON.stringify(payload)], {})
    const rl = readline.createInterface({ input: pythonProcess.stdout })
    const cleanup = () => {
      rl.close()
      pythonProcess.kill()
      res.end()
      if (existsSync(filePath)) {
        unlinkSync(filePath)
      }
    }

    res.on('close', () => {
      cleanup()
    })

    rl.on('line', (line) => {
      const payload = JSON.parse(line)
      const {
        error,
        text,
        page,
        total_pages
      }: {
        error: string | undefined
        text: string | undefined
        page: number
        total_pages: number
      } = payload
      if (total_pages) {
        sendEventStream(res, {
          eventName: 'total_pages',
          data: { total_pages }
        })
      }
      if (error) {
        sendEventStream(res, {
          eventName: 'errorEvent',
          data: { message: error }
        })
        cleanup()
        return
      }
      if (text) {
        saveOCRPageFixture(fileName, text, page)

        sendEventStream(res, {
          eventName: 'data',
          data: {
            text,
            page
          }
        })
      }
      if (!text) console.log("rl.on('line'", payload)
    })

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        sendEventStream(res, {
          eventName: 'done',
          data: { message: 'Tarea finalizada.' }
        })
        cleanup()
      } else {
        sendEventStream(res, {
          eventName: 'errorEvent',
          data: { message: `Ocurrió un error al procesar el archivo. Código: ${code ?? '?'}` }
        })

        cleanup()
      }
    })
  } catch (error: any) {
    sendEventStream(res, {
      eventName: 'errorEvent',
      data: { message: error.message }
    })
    res.end()
    if (existsSync(filePath)) {
      unlinkSync(filePath)
    }
  }
}
