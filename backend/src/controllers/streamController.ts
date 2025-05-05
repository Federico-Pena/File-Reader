import type { Request, Response } from 'express'
import { join } from 'path'
import os from 'node:os'
import { spawn } from 'child_process'
import readline from 'readline'
import { existsSync, readdirSync, unlinkSync } from 'node:fs'
import { parseTextToRichBlocks } from '../utils/normalizeText.js'
import { sendEventStream } from '../utils/sendEventStream.js'

const scriptPath = join(process.cwd(), 'python', 'main.py')
console.log('scriptPath', scriptPath)

const isWindows = os.platform() === 'win32'
const pythonPath = isWindows
  ? join(process.cwd(), 'venv', 'Scripts', 'python.exe')
  : '/opt/venv/bin/python'

export const streamController = (req: Request, res: Response) => {
  const { filePath, lang, initPage, endPage } = req.body
  const payload = { filePath, lang, initPage, endPage }
  try {
    const pythonProcess = spawn(pythonPath, [scriptPath, JSON.stringify(payload)], {})
    const rl = readline.createInterface({ input: pythonProcess.stdout })
    const cleanup = (source: string) => {
      console.log(`🛑 Killing process from ${source}.`)
      rl.close()
      pythonProcess.kill()
      res.end()
      if (existsSync(filePath)) {
        unlinkSync(filePath)
      }
    }

    res.on('close', () => {
      sendEventStream(res, {
        eventName: 'error',
        data: { message: 'Server closed the connection.' }
      })
      cleanup("res.on('close')")
    })

    rl.on('line', (line) => {
      const payload = JSON.parse(line)
      typeof payload === 'string' && console.log('👉 Log line', payload)
      if (!payload.text) return
      console.log('👉 line', { ...payload, text: payload.text?.slice(0, 10) })
      const { error, text, page } = payload
      if (error) {
        res.status(500)
        sendEventStream(res, {
          eventName: 'errorEvent',
          data: { message: error }
        })
        cleanup("rl.on('line')")
        return
      }
      if (text) {
        res.status(200)
        const parsed = { ...parseTextToRichBlocks(text), page }
        sendEventStream(res, {
          eventName: 'data',
          data: parsed
        })
      }
    })

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.status(200)
        sendEventStream(res, {
          eventName: 'done',
          data: { message: 'Finished processing.' }
        })
        cleanup("pythonProcess.on('close') - code === 0")
      } else {
        res.status(500)
        sendEventStream(res, {
          eventName: 'errorEvent',
          data: { message: `Error processing file. Code: ${code}` }
        })
        sendEventStream(res, {
          eventName: 'error',
          data: { message: `Error processing file. Code: ${code}` }
        })
        cleanup(`pythonProcess.on('close'). Code: ${code}`)
      }
    })
  } catch (error: any) {
    console.log('📛 Error', error)
    res.status(500)
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
