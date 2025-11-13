import { describe, it, expect } from 'vitest'
import {
  cleanText,
  removeZeroWidthChars,
  fixBrokenWords,
  normalizeQuotes,
  cleanLineStartSymbols,
  fixPageSeparators,
  convertRomanNumerals,
  normalizeParagraphs,
  OCRTextCleaner
} from '@/textParser/preprocess'
import { getFixtures } from './fixtures/fixtures'
describe('Text cleaning functions', () => {
  /*   it('debug cleaning steps', () => {
    const input = 'conti-\nnuar «ejemplo» XII'
    console.log(cleanText(input))
  })
  it('removes zero-width and control chars', () => {
    const input = 'palabra\u200Bcon\u00A0espacios\u00ADextra'
    const output = removeZeroWidthChars(input)
    expect(output).toBe('palabra con espacios extra')
  })

  it('fixes broken words with hyphen + newline', () => {
    const input = 'conti-\nnuar'
    const output = fixBrokenWords(input)
    expect(output).toBe('continuar')
  }) */

  /*   it('normalizes quotes', () => {
    const input = '«texto» “con” ‘comillas’'
    const output = normalizeQuotes(input)
    expect(output).toBe('"texto" "con" "comillas"')
  })

  it('cleans symbols at start of line', () => {
    const input = '#!   Hola mundo'
    const output = cleanLineStartSymbols(input)
    expect(output).toBe('Hola mundo')
  })

  it('fixes page separators', () => {
    const input = '------ 123 loremipsumdolorsitamet'
    const output = fixPageSeparators(input)
    expect(output).toContain('....123')
  })

  it('converts roman numerals', () => {
    const input = 'Capítulo IV sección XII'
    const output = convertRomanNumerals(input)
    expect(output).toBe('Capítulo 4 sección 12')
  })

  it('normalizes paragraphs', () => {
    const input = 'Esto es una frase.\ncontinua mal.'
    const output = normalizeParagraphs(input)
    expect(output).toBe('Esto es una frase. continua mal.')
  }) */

  it('applies full cleaning pipeline', () => {
    const input = getFixtures()[7].input
    // console.log('input: ', input)
    const output = cleanText(input)

    // 🔎 Chequeos básicos
    expect(output).not.toMatch(/\u200B|\u00AD/) // no chars invisibles
    expect(output).not.toContain('-\n') // no cortes con guión
    expect(output).not.toContain('  ') // no dobles espacios innecesarios

    // 🔎 Casos concretos del texto
    expect(output).toContain('producción teórica') // unión de palabra cortada
    expect(output).toContain('condiciones históricas') // título arreglado
    expect(output).toContain('13') // número romano convertido a arábigo
  })
})
