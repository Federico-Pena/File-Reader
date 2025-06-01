/**
 * Removes zero-width characters (e.g., BOM, narrow no-break space).
 */
function removeZeroWidthChars(text: string): string {
  return text.replace(/[\u200B-\u200D\uFEFF]+/g, '')
}

/**
 * Fixes hyphenated line breaks by joining split words.
 */
function fixBrokenWords(text: string): string {
  return text.replace(/-\n\s*/g, '').replace(/([a-záéíóúñ])\n+(?=["a-záéíóúñ0-9])/g, '$1 ')
}

/**
 * Cleans unwanted non-alphanumeric symbols at the beginning of lines.
 */
function cleanLineStartSymbols(text: string): string {
  return text.replace(/^[^\wáéíóúÁÉÍÓÚñÑ0-9"]+\s+/gm, '')
}

/**
 * Normalizes all types of quotation marks (single, double, angular) to standard double quotes.
 */
function normalizeQuotes(text: string): string {
  return text.replace(/[«»’‘“”]+/g, '"')
}

function fixPageSeparators(text: string): string {
  return text
    .replace(/[-_.o]{4,}\s*([0-9]+)/g, '....$1\n\n')
    .replace(/(\.{4,})\w+\.{4,}/g, '....')
    .replace(/\w{24,}/g, '....\n\n')
}

/**
 * Converts Roman numerals (length >= 2) to their Arabic equivalents.
 */
function convertRomanNumerals(text: string): string {
  const romanToInt = (roman: string): number => {
    const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
    let result = 0
    let prev = 0

    for (let i = roman.length - 1; i >= 0; i--) {
      const curr = map[roman[i]]
      if (!curr) return NaN
      if (curr < prev) {
        result -= curr
      } else {
        result += curr
        prev = curr
      }
    }
    return result
  }

  return text.replace(/\b[IVXLCDM]{2,}\b/gm, (match) => {
    const value = romanToInt(match)
    return isNaN(value) ? match : value.toString()
  })
}

/**
 * Fixes sentence-level line breaks, punctuation issues, and ensures paragraph separation.
 */
function normalizeParagraphs(text: string): string {
  return (
    text
      /*      // Join words broken by a line break inside a sentence
      .replace(/([a-záéíóúñ])\n+(?=[a-záéíóúñ0-9]{2,})/g, '$1 ')
      // Join lowercase sentence end followed by lowercase start
      // .replace(/([a-záéíóúñ])\.\n+([a-záéíóúñ])/g, '$1. $2')
      // Fix list numbering issues: e.g., "1) Text" or "2. Text"
      .replace(/,\s*\n(?=\d+[).])/g, '.\n\n')
      // Add space between joined numbers
      .replace(/(\d+)\n(\d+)/g, '$1\n\n$2')
      // Split consecutive uppercase lines
      .replace(/([A-ZÁÉÍÓÚÑ]+)\n(?=[A-ZÁÉÍÓÚÑ])/g, '$1\n\n')
      // Add double break after lowercase + dot followed by uppercase
      .replace(/([a-záéíóúñ])\.\n(?=[A-ZÁÉÍÓÚÑ])/g, '$1.\n\n')
      // Add spacing for numbered headings
      .replace(/\s(\d+[).][A-ZÁÉÍÓÚÑ])/g, '\n\n$1') */
      // Remove break after dot-dot-dot + number
      .replace(/(\.{3,})\s*\n+(\d)/g, '$1$2')
      //.replace(/\s(\d+[).] ?[A-ZÁÉÍÓÚÑ])/g, '\n\n$1')
      // Remove excess line breaks
      .replace(/\n{3,}/g, '\n\n')
      .replace(/([0-9])\n+([0-9])/g, '$1$2')
      .replace(/\.\n+([a-záéíóúñ])/g, '. $1')
      .replace(/([ \w+])\n(?=[A-ZÁÉÍÓÚÑa-záéíóúñ])/g, '$1 ')
  )
}

/**
 * Main cleaning pipeline: applies each step in logical order
 * and ensures block-level separation with double newlines.
 */
export function cleanText(text: string): string {
  let result = text
  result = normalizeQuotes(result)
  result = normalizeParagraphs(result)
  result = removeZeroWidthChars(result)
  result = fixBrokenWords(result)
  result = cleanLineStartSymbols(result)
  result = fixPageSeparators(result)
  result = convertRomanNumerals(result)
  return result.trim()
}
