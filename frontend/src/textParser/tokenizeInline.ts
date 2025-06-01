export type InlineToken =
  | { type: 'link'; href: string; text: string[] }
  | { type: 'quote'; text: string[] }
  | { type: 'text'; text: string[] }

export const tokenizeInline = (input: string): InlineToken[] => {
  const words = input.split(/\s+/g)
  const tokens: InlineToken[] = []

  let i = 0
  while (i < words.length) {
    const word = words[i]

    // Links
    if (word.includes('http') || word.includes('www')) {
      tokens.push({ type: 'link', href: word, text: [word] })
      i++
      continue
    }

    // Quotes one word
    if (
      word.replace(/^[^\w".]+/, '').startsWith('"') &&
      word.replace(/[^\w".]+$/, '').endsWith('"')
    ) {
      tokens.push({ type: 'quote', text: [word] })
      i++
      continue
    }

    // Quotes multiple words
    if (word.replace(/^[^\w".]+/, '').startsWith('"')) {
      const quoteWords: string[] = [word]
      i++
      while (i < words.length && !words[i].replace(/[^\w".]+$/, '').endsWith('"')) {
        quoteWords.push(words[i])
        i++
      }
      if (i < words.length) {
        quoteWords.push(words[i])
        i++
      }
      tokens.push({ type: 'quote', text: quoteWords })
      continue
    }

    // Normal text
    tokens.push({ type: 'text', text: [word] })
    i++
  }

  return tokens
}
