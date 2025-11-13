import type { InlineToken } from '@shared/types/types'

// patrones básicos (podés ir ampliándolos)
const regexes = {
  link: /\bhttps?:\/\/[^\s/$.?#].[^\s]*/gi,
  email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  quote: /("[^"]+"[\.,]?)/g,
  code: /`([^`]+)`/g,
  date: /\b\d{1,2}([-/])\d{1,2}\1\d{2,4}\b/g,
  currency: /(\$|€|£)\s?\d+(?:[.,]\d+)?/g,
  number: /\b\s(\d+)\s\b/g
}

export const tokenizeInline = (blockInlineTokens: InlineToken[]): InlineToken[] => {
  const tokens: InlineToken[] = []

  for (const block of blockInlineTokens) {
    if (block.type === 'list') {
      tokens.push(block)
      continue
    }

    if (block.type !== 'text') {
      tokens.push(block)
      continue
    }

    const text = block.text
    let parts: InlineToken[] = [{ type: 'text', text }]

    // aplicar cada regex sobre los textos actuales
    for (const [type, regex] of Object.entries(regexes)) {
      const newParts: InlineToken[] = []
      for (const token of parts) {
        if (token.type !== 'text') {
          newParts.push(token)
          continue
        }

        let lastIndex = 0
        const matches = [...token.text.matchAll(regex)]
        if (matches.length === 0) {
          newParts.push(token)
          continue
        }

        for (const match of matches) {
          const matched = match[0]
          const start = match.index ?? 0
          const end = start + matched.length

          if (start > lastIndex)
            newParts.push({ type: 'text', text: token.text.slice(lastIndex, start).trim() })

          const trimmed = matched.trim()
          switch (type) {
            case 'link':
              newParts.push({ type: 'link', href: trimmed, text: trimmed })
              break
            case 'email':
              newParts.push({ type: 'email', email: trimmed, text: trimmed })
              break
            case 'quote':
              newParts.push({ type: 'quote', text: trimmed })
              break
            case 'code':
              newParts.push({ type: 'code', text: trimmed })
              break
            case 'number':
              newParts.push({ type: 'number', text: trimmed })
              break
            case 'currency':
              newParts.push({ type: 'currency', text: trimmed })
              break
            case 'date':
              newParts.push({ type: 'date', text: trimmed })
              break
          }

          lastIndex = end
        }

        if (lastIndex < token.text.length)
          newParts.push({ type: 'text', text: token.text.slice(lastIndex) })
      }
      parts = newParts
    }

    tokens.push(...parts)
  }

  return tokens.filter((t) => t.text.trim().length > 0)
}
