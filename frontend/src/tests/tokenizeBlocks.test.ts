import { describe, it, expect } from 'vitest'
import { tokenizeBlocks } from '@/textParser/tokenizeBlocks'
import { getFixtures } from './fixtures/fixtures'

describe('tokenizeBlocks.test', () => {
  const fixtures = getFixtures()
  for (const { id, input, expected } of fixtures) {
    it(`"${id}"  should correctly tokenize BLOCKS`, () => {
      const result = tokenizeBlocks(input)
      expect(result.withLineBreaks).toEqual(expected.withLineBreaks)
      expect(result.cleaned).toBe(expected.cleaned)
    })
  }
})
