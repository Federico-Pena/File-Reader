import { describe, it, expect } from 'vitest'
import { repairBreakLines } from '../../../src/service/repairBreakLines'
import { neuroeducacion_Francisco_Mora_pdf } from '../fixtures'

describe('OCR neuroeducacionFranciscoMoraPdf', () => {
  neuroeducacion_Francisco_Mora_pdf.forEach((raw, idx) => {
    it(`neuroeducacionFranciscoMora fragment ${idx + 1}`, () => {
      const output = repairBreakLines(raw)
      console.log(output)
      expect(output).toMatchSnapshot()
    })
  })
})
