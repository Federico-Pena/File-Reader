import { OcrTextStorage } from '@shared/OCRStreamTypes'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

export function readOCRFixtures(): OcrTextStorage {
  const rootDir = join(process.cwd(), '../shared', 'ocr-fixtures')
  const result: OcrTextStorage = {}

  const folders = readdirSync(rootDir).filter((name) => statSync(join(rootDir, name)).isDirectory())

  for (const folder of folders) {
    const folderPath = join(rootDir, folder)
    const files = readdirSync(folderPath).filter((f) => f.endsWith('.json'))

    result[folder] = {}

    for (const file of files) {
      const match = file.match(/_pag_(\d+)\.json$/)
      if (!match) continue

      const pageNumber = parseInt(match[1], 10)
      const fullPath = join(folderPath, file)
      const content = readFileSync(fullPath, 'utf-8')

      result[folder][pageNumber] = JSON.parse(content)
    }
  }

  return result
}
