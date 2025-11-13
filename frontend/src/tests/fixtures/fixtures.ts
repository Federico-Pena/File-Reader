import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

export type Fixture = {
  id: string
  input: string
}

export function getFixtures(): Fixture[] {
  const rootDir = join(process.cwd(), 'src/textParser/files')
  const fixtures: Fixture[] = []

  const files = readdirSync(rootDir)

  for (const file of files) {
    const filePath = join(rootDir, file)
    const content = readFileSync(filePath, 'utf-8')
    fixtures.push({ id: file.split('.txt')[0], input: content })
  }

  return fixtures
}
