import { describe, it, expect } from 'vitest'
import { repairBreakLines } from '../../../src/service/repairBreakLines'
import { vinculoPdf } from '../fixtures'

describe('OCR vinculoPdf', () => {
  vinculoPdf.forEach((raw, idx) => {
    it(`vinculoPdf fragment ${idx + 1}`, () => {
      const output = repairBreakLines(raw)
      console.log(output)
      expect(output).toMatchSnapshot()
    })
  })
})
