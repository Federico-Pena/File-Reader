export function parseTextToRichBlocks(raw: string) {
  const sections = preprocessOCRText(raw).split(/\n\n+/g)
  const withLineBreaks: RichBlock[] = []

  for (const section of sections) {
    const trimmed = section.trim()
    if (!trimmed) continue
    if (isOnlySymbols(trimmed)) continue
    if (isTitle(trimmed)) {
      withLineBreaks.push({
        type: 'title',
        content: trimmed
      })
      continue
    }
    if (isSubtitle(trimmed)) {
      withLineBreaks.push({
        type: 'subtitle',
        content: trimmed
      })
      continue
    }
    if (isBlockquote(trimmed)) {
      withLineBreaks.push({
        type: 'blockquote',
        content: trimmed
      })
      continue
    }
    if (isList(trimmed)) {
      const text = trimmed.replace(/([0-9]+[.)])/, '$1 ')
      withLineBreaks.push({
        type: 'list',
        content: text
      })
      continue
    }
    const text = trimmed.endsWith('.') ? trimmed : trimmed + '.'
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

function preprocessOCRText(text: string) {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\n{2,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/-\n\s*/g, '')
    .replace(/(?<=[a-záéíóúñ])\n+(?=[a-záéíóúñ0-9])/gi, ' ')
    .replace(/\.{4,}\s+([0-9]+)/g, '....$1\n\n')
    .replace(/[«»'“”]+/g, '"')
    .replace(/^[^\wáéíóúÁÉÍÓÚñÑ0-9"]+ /gm, '')
    .trim()
}

function isTitle(text: string): boolean {
  return (
    text === text.toUpperCase() &&
    text.length <= 100 &&
    Number.isNaN(Number(text)) &&
    /[0-9]/.test(text) === false
  )
}

function isSubtitle(text: string): boolean {
  return /^[A-ZÁÉÍÓÚÑ][^.!?]{0,80}$/.test(text) && text === text.toUpperCase()
}

function isBlockquote(text: string): boolean {
  return /^".*"[.]?$/.test(text)
}
function isOnlySymbols(text: string): boolean {
  return /^[^a-zA-Z0-9]*$/.test(text)
}

function isList(text: string): boolean {
  return /^[0-9]+[.)]/.test(text)
}
