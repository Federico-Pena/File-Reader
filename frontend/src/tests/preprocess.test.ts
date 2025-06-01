import { preprocessOCRText } from '@/textParser/tokenizeBlocks'
import { describe, it, expect } from 'vitest'
import { getFixtures } from './fixtures/fixtures'

describe('OCR preprocessOCRText', () => {
  const fixtures = getFixtures()
  for (const { id, input } of fixtures) {
    const content = preprocessOCRText(input)
    describe(`${id}`, () => {
      it('should normalize all quotes to double quotes (")', () => {
        expect(content).not.toMatch(/[‘’“”'«»]/)
      })

      it('should not contain zero-width characters', () => {
        expect(content).not.toMatch(/[\u200B-\u200D\uFEFF]/)
      })

      it('should not contain more than two newlines in a row', () => {
        expect(content).not.toMatch(/\n{3,}/)
      })

      it('should not contain broken hyphenated words from line breaks', () => {
        expect(content).not.toMatch(/-\n\s*/)
      })

      it('should replace page breaks like dashes before numbers', () => {
        expect(content).not.toMatch(/[-_o.]{5,}\s+[0-9]+/)
      })
    })
  }
})
