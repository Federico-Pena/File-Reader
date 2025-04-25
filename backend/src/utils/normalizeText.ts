export function parseTextToRichBlocks(raw: string) {
  const sections = preprocessOCRText(raw).split(/\n\n/)
  const withLineBreaks: RichBlock[] = []
  for (const section of sections) {
    const trimmed = section.trim()
    if (!trimmed) continue
    if (/^"/.test(trimmed) && /".*$/.test(trimmed)) {
      withLineBreaks.push({ type: 'blockquote', content: parseInline(trimmed) })
      continue
    }
    withLineBreaks.push({ type: 'paragraph', content: parseInline(trimmed) })
  }
  const cleaned = sections.join('\n\n').replace(/\n+/gm, ' ')
  return { withLineBreaks, cleaned }
}

function preprocessOCRText(text: string) {
  const normalizedText = text
    .replace(/["'»«“”]+/gm, '"')
    .replace(/\r+/gm, '')
    .replace(/-\s?\n/gm, '')
    .replace(/(?<=[A-ZÁÉÍÓÚÑa-záéíóúñ,])\n+(?=[a-záéíóúñ])/gm, '\n')
    .replace(/\n{2,}/gm, '\n\n')
    .trim()
  return normalizedText
}

function isLikelySubheading(text: string): boolean {
  const trimmed = text.trim()
  if (trimmed.length > 80) return false
  const numbered = /^(\d+\.|[a-zA-Z]\))\s+[A-ZÁÉÍÓÚÑ]/.test(trimmed)
  const wordCount = trimmed.split(' ').length
  const endsWithPunct = /[.?!0-9]$/.test(trimmed)
  return numbered && wordCount <= 8 && !endsWithPunct
}

function parseInline(text: string): RichInline[] {
  const inlines: RichInline[] = []
  const parts = text.split(/\n+/)

  // Quotes (con puntuación justo después), links y emails
  const quotePattern = /"[^"]*?"[.,!?;:]?/gm
  const linkPattern = /\b(?:https?:\/\/|www\.)[^\s]+/gm
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/gi
  const combinedPattern = new RegExp(
    `${quotePattern.source}|${linkPattern.source}|${emailPattern.source}`,
    'gmi'
  )

  for (const part of parts) {
    if (!part) continue

    let lastIndex = 0
    const matches = Array.from(part.matchAll(combinedPattern))

    for (const match of matches) {
      const matchText = match[0]
      const index = match.index ?? 0

      if (index > lastIndex) {
        const before = part.slice(lastIndex, index)
        const clean = before.trim()
        if (clean) {
          inlines.push({ type: 'text', text: clean })
        }
      }

      if (matchText.startsWith('"')) {
        const quote = matchText.match(/^"(.*?)"([.,!?;):]?)$/)
        const text = quote ? `"${quote[1]}"${quote[2] || ''}` : matchText
        inlines.push({ type: 'quote', text })
      } else if (matchText.includes('@')) {
        inlines.push({ type: 'email', text: matchText })
      } else {
        inlines.push({ type: 'link', text: matchText })
      }

      lastIndex = index + matchText.length
    }

    // Resto del texto después del último match
    if (lastIndex < part.length) {
      const after = part.slice(lastIndex).trim()
      if (after) {
        inlines.push({ type: 'text', text: after })
      }
    }
  }

  return inlines
}
