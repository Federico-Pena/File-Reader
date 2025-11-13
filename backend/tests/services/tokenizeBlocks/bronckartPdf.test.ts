import { describe, it, expect } from 'vitest'
import { repairBreakLines } from '../../../src/service/repairBreakLines'
import { tokenizeBlocks } from '../../../src/service/tokenizeBlocks'
import { bronckartPdf } from '../fixtures'

describe('OCR → tokenizeBlocks (bronckartPdf)', () => {
  bronckartPdf.forEach((raw, idx) => {
    it(`fragment ${idx + 1}`, () => {
      if (idx === 1) {
        const output = repairBreakLines(raw)
        const blocks = tokenizeBlocks(output)
        expect(blocks.blocks.length).toBeGreaterThan(0)
        console.log(JSON.stringify(blocks.blocks, null, 2))
        expect(blocks.blocks).toMatchSnapshot()
      }
    })
  })
})
