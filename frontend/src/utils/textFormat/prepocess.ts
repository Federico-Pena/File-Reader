function fixSymbolBeforeCapital(text: string): string {
  return text.replace(/([,;:])(\s*)(\p{L})/gu, (_, symbol, space, char) => {
    return char === char.toUpperCase() ? '.' + space + char : symbol + space + char
  })
}
function normalizeQuotes(text: string): string {
  return text.replace(/[«»'“”]+/g, '"')
}
function removeZeroWidthAndExtraSpaces(text: string): string {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{2,}/g, '\n\n')
}

function fixBrokenWords(text: string): string {
  return text.replace(/-\n\s*/g, '')
}
function fixLineBreaksInsideSentences(text: string): string {
  return text.replace(/(?<=[a-záéíóúñ])\n+(?=[a-záéíóúñ0-9])/gi, ' ')
}
function cleanLineStartSymbols(text: string): string {
  return text.replace(/^[^\wáéíóúÁÉÍÓÚñÑ0-9"]+ /gm, '')
}
function fixPageSeparators(text: string): string {
  return text.replace(/[-_o.]{4,}\s+?([0-9]+)/g, '....$1\n\n')
}

export {
  fixSymbolBeforeCapital,
  normalizeQuotes,
  removeZeroWidthAndExtraSpaces,
  fixBrokenWords,
  fixLineBreaksInsideSentences,
  cleanLineStartSymbols,
  fixPageSeparators
}
