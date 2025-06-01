import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

export function saveOCRPageFixture(fileName: string, text: string, page: number): void {
  const fixturesRoot = join(process.cwd(), '../shared', 'ocr-fixtures')
  const fileFolder = join(fixturesRoot, fileName)
  const fixtureFile = join(fileFolder, `${fileName}_pag_${page}.json`)

  try {
    if (process.env.NODE_ENV === 'production') {
      console.log(`🟢 Skipping fixture creation in production mode`)
      return
    }
    if (!existsSync(fileFolder)) {
      mkdirSync(fileFolder, { recursive: true })
    }

    if (existsSync(fixtureFile)) {
      console.log(`🟡 Fixture already exists: ${fixtureFile}`)
      return
    }

    const fixtureContent = `{
    "input": ${JSON.stringify(text)},
    "expected": {
      "withLineBreaks": [],
      "cleaned": ""
    }
  }
`

    writeFileSync(fixtureFile, fixtureContent, 'utf-8')
    console.log(`✅ Fixture saved: ${fixtureFile}`)
  } catch (err) {
    console.error('❌ Error saving fixture:', err)
  }
}
