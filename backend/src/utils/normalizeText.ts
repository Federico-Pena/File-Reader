export function parseTextToRichBlocks(raw: string) {
  const sections = preprocessOCRText(raw).split(/\n\n/)
  const withLineBreaks: RichBlock[] = []
  for (const section of sections) {
    const trimmed = section.trim()
    if (!trimmed) continue
    withLineBreaks.push({ type: 'paragraph', content: [{ type: 'text', text: trimmed }] })
  }
  const cleaned = sections.join('\n\n').replace(/\n+/gm, ' ').trim()
  return { withLineBreaks, cleaned }
}

function preprocessOCRText(text: string) {
  return (
    text
      .replace(/["'»«“”]+/gm, '"')
      // Eliminar retornos de carro
      .replace(/\r+?\n/gm, ' ')
      // Unir palabras cortadas por guión al final de línea
      .replace(/-\s*\n/gm, '')
      // Mantener saltos de línea que separan oraciones pero eliminar los que no tienen sentido
      .replace(/(?<=[A-Za-zÁÉÍÓÚáéíóúñ0-9])\n(?=[a-záéíóúñ])/gm, ' ')
      // Normalizar múltiples saltos de línea
      .replace(/\n{2,}/gm, '\n\n')
      // Eliminar líneas que consisten solo en símbolos o caracteres especiales
      .replace(/^[^A-Za-zÁÉÍÓÚáéíóúñ0-9\n]{2,}$/gm, '')
      // Eliminar líneas que no parecen contener palabras válidas
      .replace(/^\s*[^a-zA-ZÁÉÍÓÚáéíóúñ]{0,3}\s*$/gm, '')
      // Eliminar caracteres de control y espacios invisibles
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Esto elimina caracteres como ZERO WIDTH SPACE, JOINER, etc.
      .trim()
  )
}

function fixUnmatchedQuotes(text: string): string {
  const quoteRegex = /"/g
  let match
  let count = 0
  const positions: number[] = []

  while ((match = quoteRegex.exec(text)) !== null) {
    positions.push(match.index)
    count++
  }

  // Si ya están balanceadas, no hacer nada
  if (count % 2 === 0) return text

  // Si hay una comilla de apertura sin cierre
  if (positions.length % 2 === 1) {
    const lastQuotePos = positions[positions.length - 1] ?? 0

    // Buscamos hasta el próximo punto, salto de línea o final de texto para cerrar la cita
    const end = text.slice(lastQuotePos).search(/[.?!\n]/)
    if (end !== -1) {
      return text.slice(0, lastQuotePos + end + 1) + '"' + text.slice(lastQuotePos + end + 1)
    } else {
      // Si no hay buen lugar para cerrar, la quitamos
      return text.slice(0, lastQuotePos) + text.slice(lastQuotePos + 1)
    }
  }

  return text
}

function restoreOriginalQuotes(text: string, quoteMap: Map<number, string>) {
  let restored = ''
  for (let i = 0; i < text.length; i++) {
    if (quoteMap.has(i)) {
      restored += quoteMap.get(i)
    } else {
      restored += text[i]
    }
  }
  return restored
}

function parseInline(text: string): RichInline[] {
  const elements: RichInline[] = []
  const quotePattern = /"[^"]*?"[.,!?;:]?/gm
  const linkPattern = /https?:\/\/[^\s]+|www\.[^\s]+/gm
  const emailPattern = /[\\w.-]+@[\\w.-]+\\.\\w+/gm
  const pattern = new RegExp(
    `${quotePattern.source}|${linkPattern.source}|${emailPattern.source}`,
    'gmi'
  )

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push({ type: 'text', text: text.slice(lastIndex, match.index) })
    }

    const matchedStr = match[0]

    /*  if (match[0].startsWith('"') && match[0].endsWith('"')) {
      const quote = matchedStr.match(/^"(.*?)"([.,!?;):]?)$/)
      const text = quote ? `"${quote[1]}"${quote[2] || ''}` : matchedStr
      elements.push({ type: 'quote', text })
    } else if (matchedStr.includes('@')) {
      elements.push({ type: 'email', text: matchedStr })
    } else if (matchedStr.startsWith('http') || matchedStr.startsWith('www.')) {
      const href = matchedStr.startsWith('www.') ? `https://${matchedStr}` : matchedStr
      elements.push({ type: 'link', url: href, text: matchedStr })
    } */

    lastIndex = pattern.lastIndex
  }

  if (lastIndex < text.length) {
    elements.push({ type: 'text', text: text.slice(lastIndex) })
  }

  return elements
}
