export function parseTextToRichBlocks(raw: string) {
  const sections = preprocessOCRText(raw).split(/\n\n/g)
  const withLineBreaks: RichBlock[] = []
  for (const section of sections) {
    const trimmed = section.trim()
    if (!trimmed) continue
    withLineBreaks.push({ type: 'paragraph', content: [{ type: 'text', text: trimmed }] })
  }
  const cleaned = withLineBreaks
    .map((block) => block.content.map((inline) => inline.text).join(''))
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
    .replace(/(?<=[a-záéíóúñ])\n+(?=[a-záéíóúñ])/g, ' ')
    .trim()
}
