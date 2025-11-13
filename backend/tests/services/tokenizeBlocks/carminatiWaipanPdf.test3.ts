import { describe, it, expect } from 'vitest'
import { repairBreakLines } from '../../../src/service/repairBreakLines'
import { carminatiWaipanPdf } from '../fixtures'
import { tokenizeBlocks } from '../../../src/service/tokenizeBlocks'

describe('OCR carminatiWaipanPdf', () => {
  carminatiWaipanPdf.forEach((raw, idx) => {
    it(`carminatiWaipan fragment ${idx + 1}`, () => {
      const output = repairBreakLines(raw)
      const blocks = tokenizeBlocks(output)
      expect(blocks).toMatchSnapshot()
    })
  })
})
