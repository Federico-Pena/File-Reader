import { describe, it, expect } from 'vitest'
import { repairBreakLines } from '../../../src/service/repairBreakLines'
import { neuroeducacion_Francisco_Mora_pdf } from '../fixtures'
import { tokenizeBlocks } from '../../../src/service/tokenizeBlocks'

describe('OCR neuroeducacionFranciscoMoraPdf', () => {
  neuroeducacion_Francisco_Mora_pdf.forEach((raw, idx) => {
    it(`neuroeducacionFranciscoMora fragment ${idx + 1}`, () => {
      const output = repairBreakLines(raw)
      const blocks = tokenizeBlocks(output)
      expect(blocks).toMatchSnapshot()
    })
  })
})
