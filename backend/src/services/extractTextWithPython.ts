import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { consoleStyler } from 'logpainter'

export const extractTextWithPython = (fileBuffer: Buffer, fileExt: string): Promise<Data[]> => {
  const scriptPath = join(process.cwd(), 'backend', 'src', 'scripts', 'main.py')
  const venvPath = join(process.cwd(), 'venv', 'Scripts', 'python.exe')
  const isRender = process.env.RENDER === 'true' // Render inyecta esta variable automáticamente
  const pythonPath = isRender
    ? 'python3'
    : process.platform === 'win32'
    ? join(process.cwd(), 'venv', 'Scripts', 'python.exe')
    : join(process.cwd(), 'venv', 'bin', 'python')

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(pythonPath, [scriptPath, `.${fileExt}`])

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
          consoleStyler(extractedOutput)
          if (extractedOutput.startsWith('{"error":') || extractedOutput.startsWith('{"pages":')) {
            const { pages, error }: { pages: Data[]; error: string } = JSON.parse(extractedOutput)
            if (error) {
              reject(new Error(error))
            }
            resolve(pages)
          }
        } catch (error: any) {
          reject(new Error(`Failed to parse output: ${error.message}`))
        }
      }
    })
  })
}
