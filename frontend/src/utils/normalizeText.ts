export const normalizeText = (text: string) => {
  let paragraphs = text
    .replace(/( \n \n+)/g, '\n')
    .replace(/((\w) \n(\w))/g, '$2 $3')
    .replace(/((\w)\n(\w))/g, '$2 $3')
    .replace(/(-\n+)/g, '')
    .replace(/\n\(/g, '(')
    .replace(/ \n/g, ' ')
    .replace(/\n\)/g, ')')
    .replace(/(, \n+)/g, ', ')
    .split(/\n+/g)
  paragraphs = paragraphs.map((paragraph) =>
    paragraph.endsWith('.') ? paragraph.trim() : (paragraph + '.').trim()
  )
  paragraphs = paragraphs.filter((paragraph) => paragraph !== '')
  return paragraphs.join('\n\n')
}
