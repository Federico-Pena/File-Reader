import { describe, it, expect } from 'vitest'
import { repairBreakLines } from '../../../src/service/repairBreakLines'
import { chalmers2000Pdf } from '../fixtures'
import { tokenizeBlocks } from '../../../src/service/tokenizeBlocks'

describe('OCR chalmers2000Pdf', () => {
  chalmers2000Pdf.forEach((raw, idx) => {
    it(`chalmers2000Pdf fragment ${idx + 1}`, () => {
      const output = repairBreakLines(raw)
      const blocks = tokenizeBlocks(output)
      for (const block of blocks.blocks) {
        console.log(block)
      }
      expect(blocks).toMatchSnapshot()
    })
  })
})
