import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { consoleStyler } from 'logpainter'

export const extractTextWithPython = (
  fileBuffer: Buffer,
  fileExt: string,
  sendPage: (data: Data[]) => void
): Promise<void> => {
  const scriptPath = join(process.cwd(), 'backend', 'src', 'scripts', 'main.py')
  const venvPath = join(process.cwd(), 'venv', 'Scripts', 'python.exe')

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(venvPath, [scriptPath, `.${fileExt}`])

    let extractedOutput = ''
    let errorOutput = ''

    pythonProcess.stdin.write(fileBuffer, 'utf-8')
    pythonProcess.stdin.end()

    pythonProcess.stdout.on('data', (data) => {
      extractedOutput += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${errorOutput}`))
      } else {
        try {
          if (extractedOutput.startsWith('{"error":') || extractedOutput.startsWith('{"pages":')) {
            const { pages, error }: { pages: Data[]; error: string } = JSON.parse(extractedOutput)
            if (error) {
              reject(new Error(error))
            }

            sendPage(pages)
          }
        } catch (error: any) {
          reject(new Error(`Failed to parse output: ${error.message}`))
        }
      }
    })
  })
}
