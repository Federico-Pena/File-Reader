import { describe, it, expect } from 'vitest'
import { repairBreakLines } from '../../../src/service/repairBreakLines'
import { bronckartPdf } from '../fixtures'

describe('OCR bronckartPdf', () => {
  bronckartPdf.forEach((raw, idx) => {
    it(`bronckartPdf fragment ${idx + 1}`, () => {
      const output = repairBreakLines(raw)
      console.log(output)
      expect(output).toMatchSnapshot()
    })
  })
})
