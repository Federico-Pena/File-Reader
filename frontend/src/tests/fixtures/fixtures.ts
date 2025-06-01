import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

export type Fixture = {
  id: string
  input: string
  expected: {
    withLineBreaks: RichBlock[]
    cleaned: string
  }
}

export function getFixtures(): Fixture[] {
  const rootDir = join(process.cwd(), '../shared', 'ocr-fixtures')
  const fixtures: Fixture[] = []

  const folders = readdirSync(rootDir).filter((name) => statSync(join(rootDir, name)).isDirectory())

  for (const folder of folders) {
    const folderPath = join(rootDir, folder)
    const files = readdirSync(folderPath).filter((f) => f.endsWith('.json'))

    for (const file of files) {
      const match = file.match(/_pag_(\d+)\.json$/)
      if (!match) continue

      const fullPath = join(folderPath, file)
      const content = readFileSync(fullPath, 'utf-8')
      const parsed = JSON.parse(content) as Fixture
      fixtures.push({
        id: file.split('.json')[0],
        input: parsed.input,
        expected: parsed.expected
      })
    }
  }

  return fixtures
}
