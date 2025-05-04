import { readdir, rm, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import { existsSync } from 'node:fs'

export const cleanTempDirFIles = async (tempDir: string) => {
  try {
    if (!existsSync(tempDir)) {
      console.log('Temp dir does not exist')
      return
    }
    const files = await readdir(tempDir, {
      encoding: 'utf8',
      withFileTypes: true,
      recursive: true
    })
    for (const file of files) {
      const filePath = path.join(tempDir, file.name)
      try {
        const fsstat = await stat(filePath)
        if (fsstat.isDirectory()) {
          await rm(filePath, { recursive: true, force: true })
        } else {
          await unlink(filePath)
        }
      } catch (err) {
        console.warn(`Cannot delete file ${filePath}: ${err}`)
      }
    }
    console.log('Temp dir cleaned')
  } catch (err) {
    console.error('Error cleaning temp dir:', err)
  }
}
