import { describe, it, expect } from 'vitest'
import { repairBreakLines } from '../../../src/service/repairBreakLines'
import { chalmers2000Pdf } from '../fixtures'

describe('OCR chalmers2000Pdf', () => {
  chalmers2000Pdf.forEach((raw, idx) => {
    it(`chalmers2000Pdf fragment ${idx + 1}`, () => {
      const output = repairBreakLines(raw)
      console.log(output)
      expect(output).toMatchSnapshot()
    })
  })
})
