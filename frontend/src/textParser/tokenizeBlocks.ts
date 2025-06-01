import { cleanText } from './preprocess'
export const tokenizeBlocks = (rawText: string) => {
  const sections = preprocessOCRText(rawText).split(/\n\n+/g)
  const withLineBreaks: RichBlock[] = []

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim()
    if (!section) continue
    if (isOnlySymbols(section)) continue

    let current = section

    // Elimina coma final si existe
    if (current.endsWith(',')) {
      current = current.replace(/,\s*$/, '')
    }

    const next = sections[i + 1]?.trim()
    const before = sections[i - 1]?.trim()

    if (isSubtitle(section) && next && (isSubtitle(next) || isList(next) || isList(before))) {
      withLineBreaks.push({
        type: 'list',
        content: current
      })
      continue
    }

    if (isTitle(section)) {
      withLineBreaks.push({
        type: 'title',
        content: current
      })
      continue
    }

    if (isSubtitle(section)) {
      withLineBreaks.push({
        type: 'subtitle',
        content: current
      })
      continue
    }

    if (isBlockquote(section)) {
      withLineBreaks.push({
        type: 'blockquote',
        content: current
      })
      continue
    }

    if (isList(section)) {
      withLineBreaks.push({
        type: 'list',
        content: current
      })
      continue
    }

    const text = section.endsWith('.') ? current : current + '.'
    withLineBreaks.push({
      type: 'paragraph',
      content: text
    })
  }

  const cleaned = withLineBreaks
    .map((block) => block.content)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  return { withLineBreaks, cleaned }
}

export function preprocessOCRText(text: string) {
  // Must be applied in order
  return cleanText(text)
}

function isTitle(text: string): boolean {
  return text === text.toUpperCase() && text.length <= 100 && /[0-9]/.test(text) === false
}

function isSubtitle(text: string): boolean {
  return (
    text.split(/\s+/).length <= 20 &&
    (/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+ \d+$/.test(text.trimStart()) ||
      /^\d+ [A-ZÁÉÍÓÚÑ]+$/.test(text.trimStart()) ||
      /^\d+[.)]\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]\.?/.test(text.trimStart()))
  )
}

function isBlockquote(text: string): boolean {
  return /^".*"[,.?!]?$/.test(text)
}
function isOnlySymbols(text: string): boolean {
  return /^[^a-zA-Z0-9]*$/.test(text)
}

function isList(text: string): boolean {
  return (
    /^[0-9]+[.)]\s?\w+.*[0-9.]+?$/.test(text.trimStart()) ||
    /^[a-zA-Z]+[)]/.test(text.trimStart()) ||
    /\.{3,}\s?[0-9]+$/.test(text.trimStart())
  )
}
