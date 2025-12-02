import { spawn, type ChildProcess } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path, { join } from 'node:path'
import fs from 'node:fs'

export class PdfService {
  filePath: string
  tempDir: string
  processes: Set<ChildProcess>

  constructor(filePath: string) {
    this.filePath = filePath
    this.tempDir = join(tmpdir(), `pdf_job_${randomUUID()}`)
    if (!existsSync(this.tempDir)) {
      mkdirSync(this.tempDir, { recursive: true })
    }
    this.processes = new Set()
  }

  private runCommand(cmd: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn(cmd, args)
      this.processes.add(child)

      let stdout = ''
      let stderr = ''

      child.stdout.on('data', (chunk) => (stdout += chunk))
      child.stderr.on('data', (chunk) => (stderr += chunk))

      child.on('close', (code, signal) => {
        this.processes.delete(child)
        if (signal) return reject(new Error(`Process killed with signal ${signal}`))
        if (code === 0) resolve(stdout.trim())
        else reject(new Error(stderr || `Process exited with code ${code}`))
      })
    })
  }

  cancelAll() {
    for (const proc of this.processes) {
      if (!proc.killed) proc.kill('SIGKILL')
    }
    this.processes.clear()
  }

  private async isPdfScanned(): Promise<boolean> {
    try {
      const stdout = await this.runCommand('pdftotext', ['-f', '1', '-l', '1', this.filePath, '-'])
      return stdout.length < 50
    } catch {
      return true
    }
  }

  private async extractTextFromPdfPage(pageNumber: number): Promise<string> {
    return this.runCommand('pdftotext', [
      '-f',
      String(pageNumber),
      '-l',
      String(pageNumber),
      '-raw',
      this.filePath,
      '-'
    ])
  }

  private async extractTextFromScannedPdfPage(pageNumber: number): Promise<string> {
    const imagePath = path.join(this.tempDir, `page_${pageNumber}.tiff`)
    try {
      await this.runCommand('pdftocairo', [
        '-tiff',
        '-f',
        String(pageNumber),
        '-l',
        String(pageNumber),
        this.filePath,
        `${this.tempDir}/page`
      ])
      const generatedFiles = fs.readdirSync(this.tempDir).filter((f) => f.startsWith('page-') && f.endsWith('.tif'))
      if (generatedFiles.length > 0) {
        const generatedPath = path.join(this.tempDir, generatedFiles[0] ?? '')
        fs.renameSync(generatedPath, imagePath)
      }

      const stdout = await this.runCommand('tesseract', [imagePath, 'stdout', '-l', 'spa+eng'])
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
      return stdout.trim()
    } catch (err) {
      console.error(err)
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
      throw err
    }
  }

  async getTotalPages(): Promise<number> {
    const stdout = await this.runCommand('pdfinfo', [this.filePath])
    const match = stdout.match(/Pages:\s+(\d+)/)
    return match ? parseInt(match[1] ?? '1') : 1
  }

  private async extractImageText(): Promise<string> {
    const imagePath = this.filePath
    try {
      const stdout = await this.runCommand('tesseract', [imagePath, 'stdout', '-l', 'spa+eng'])
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
      return stdout
    } catch (err) {
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
      throw err
    }
  }

  async extractPageText(pageNumber: number): Promise<string> {
    if (isImage(this.filePath)) {
      return await this.extractImageText()
    }
    if (await this.isPdfScanned()) {
      return await this.extractTextFromScannedPdfPage(pageNumber)
    } else {
      return await this.extractTextFromPdfPage(pageNumber)
    }
  }
}

const isImage = (filePath: string) => {
  return (
    filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.tiff')
  )
}
