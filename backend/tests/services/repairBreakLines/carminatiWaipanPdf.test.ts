import { describe, it, expect } from 'vitest'
import { repairBreakLines } from '../../../src/service/repairBreakLines'
import { carminatiWaipanPdf } from '../fixtures'

describe('OCR carminatiWaipanPdf', () => {
  carminatiWaipanPdf.forEach((raw, idx) => {
    it(`carminatiWaipan fragment ${idx + 1}`, () => {
      const output = repairBreakLines(raw)
      console.log(output)
      expect(output).toMatchSnapshot()
    })
  })
})
