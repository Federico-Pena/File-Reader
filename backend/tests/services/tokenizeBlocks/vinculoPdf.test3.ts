import { describe, it, expect } from 'vitest'
import { repairBreakLines } from '../../../src/service/repairBreakLines'
import { vinculoPdf } from '../fixtures'
import { tokenizeBlocks } from '../../../src/service/tokenizeBlocks'

describe('OCR vinculoPdf', () => {
  vinculoPdf.forEach((raw, idx) => {
    it(`vinculoPdf fragment ${idx + 1}`, () => {
      const output = repairBreakLines(raw)
      const blocks = tokenizeBlocks(output)
      expect(blocks).toMatchSnapshot()
    })
  })
})
