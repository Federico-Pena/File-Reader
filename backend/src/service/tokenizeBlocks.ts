import type { ListType, RichBlock } from '@shared/types/types'
import { tokenizeInline } from './tokenizeInline'

// REGEX PATTERNS
const RE = {
  blockquote: /^".+?"[\.,]?(?:\s+[a-zA-Z0-9áéíóúÁÉÍÓÚÑÜç].*)?$/,
  titleAllCaps: /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s,;:'"()\-\–—]{8,}$/,
  titleWithNumber: /^[\s]*(CAP[ÍI]TULO|SECCI[ÓO]N|PARTE|UNIDAD|TEMA)\s+([IVXLCDM\d]+)\s*$/i,
  roman: /^[\s]*([IVXLCDM]+)(?:[.)\]-])\s+([A-ZÁÉÍÓÚÑ][^\n]{2,})$/,
  numbering:
    /^[\s]*(\d+(?:\.\d+)*)(?:[\.\)\]\-])\s+([A-ZÁÉÍÓÚÑ¿¡][A-ZÁÉÍÓÚÑa-záéíóúñü\s\-,;:.()?!¿¡]{3,})$/,
  subtitle: /^[A-ZÁÉÍÓÚÑ¿¡][A-ZÁÉÍÓÚÑ\s\-,;:.()?!¿¡]{5,}$/,
  bullet: /^[\s]*([●•\*◦\-–—])\s+(.+)$/,
  lettered: /^[\s]*([a-záéíóúñA-ZÁÉÍÓÚÑ])[\.)\]-]\s+(.{3,})$/,
  indexLine: /^(\d+(?:\.\d+)*[.)\]-]?)\s+(.+?)\.?\s*(\d+)?\s*$/
}

//  HELPERS DE CREACIÓN DE BLOQUES

const makeBlock = (
  type: 'title' | 'subtitle' | 'blockquote' | 'paragraph',
  content: string
): RichBlock => ({
  type,
  inlineTokens: [{ type: 'text', text: content.trim() }]
})

const makeList = (listType: ListType, indicator: string, content: string): RichBlock => ({
  type: 'list',
  inlineTokens: [
    {
      type: 'list',
      text: content.replace(indicator.toString(), '').trim(),
      listType: listType ?? 'bullet',
      listIndicator: indicator.toString()
    }
  ]
})

// DETECTORES DE TIPO

function isIndexLine(clean: string): boolean {
  const m = clean.match(RE.indexLine)
  if (!m) return false
  const [, , content = '', trailingNumber] = m
  const words = content.trim().split(/\s+/)

  if (trailingNumber) return true
  if (words.length <= 3 && content.length <= 30) return true
  const alpha = content.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, '')
  if (alpha && alpha === alpha.toUpperCase() && content.length > 20) return false
  if (content.length > 20) return false
  return true
}

function looksLikeTitle(text: string): boolean {
  const clean = text.trim()
  if (clean.length < 10) return false
  if (RE.titleAllCaps.test(clean)) return true
  return false
}

function isValidRomanNumeral(value: string): boolean {
  return /^(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))$/i.test(value.trim())
}

const isOnlySymbols = (t: string) => /^[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüç]+$/.test(t)

const isMostlyUppercase = (input: string, threshold = 0.8) => {
  const words = input.split(/\s+/).filter(Boolean)
  const upperCount = words.filter((w) => {
    const alpha = w.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, '')
    return alpha && alpha === alpha.toUpperCase()
  }).length
  return words.length > 0 && upperCount / words.length >= threshold
}

// CLASIFICADOR DE LÍNEAS

function classifyLine(nextLine: string, linea: string, allCaps = false): RichBlock | false {
  const clean = linea.trim()
  if (!clean) return false

  // Orden de prioridad (simplificado y claro)
  if (RE.blockquote.test(clean)) return makeBlock('blockquote', clean)
  if (RE.titleWithNumber.test(clean)) return makeBlock('title', clean)

  const mRoman = clean.match(RE.roman)
  if (mRoman && mRoman[2] && isValidRomanNumeral(mRoman[1] ?? '')) {
    return RE.titleAllCaps.test(mRoman[2])
      ? makeBlock('title', clean)
      : makeList('roman', mRoman[1] ?? '', mRoman[2])
  }

  if (RE.titleAllCaps.test(clean) && !allCaps) {
    return makeBlock('title', clean)
  }

  const mNumbering = clean.match(RE.numbering)
  if (mNumbering) {
    const [, indicator = '', content = ''] = mNumbering
    if (looksLikeTitle(content) && !looksLikeTitle(nextLine)) return makeBlock('subtitle', clean)
    return makeList('numbered', indicator, content)
  }

  if (RE.indexLine.test(clean) && isIndexLine(clean))
    return makeList('indexLine', clean.split(' ')[0] ?? '', clean)

  if (RE.bullet.test(clean)) {
    const [, indicator = '', content = ''] = clean.match(RE.bullet)!
    return makeList('bullet', indicator, content)
  }

  if (RE.lettered.test(clean)) {
    const [, indicator = '', content = ''] = clean.match(RE.lettered)!
    return makeList('lettered', indicator, content)
  }

  if (RE.subtitle.test(clean) && !allCaps) return makeBlock('subtitle', clean)

  return makeBlock('paragraph', clean)
}

// AGRUPACIÓN DE BLOQUES
function shouldGroupWith(current: RichBlock | null, next: RichBlock, allCaps: boolean): boolean {
  if (!current) return false

  const sameType = current.type === next.type

  // 🔸 No unir títulos/subtítulos si allCaps (todo en mayúsculas)
  if (allCaps && (sameType || ['title', 'subtitle'].includes(next.type))) return false

  // 🔹 Agrupar títulos consecutivos que parecen continuación
  if (['title', 'subtitle'].includes(current.type) && ['title', 'subtitle'].includes(next.type)) {
    const content = next.inlineTokens[0]?.text || ''
    const hasNumber = RE.numbering.test(content) || RE.roman.test(content)
    return !hasNumber && !allCaps
  }

  // 🔹 Agrupar listas del mismo tipo
  const currentToken = current.inlineTokens[0]
  const nextToken = next.inlineTokens[0]

  if (
    current.type === 'list' &&
    next.type === 'list' &&
    currentToken?.type === 'list' &&
    nextToken?.type === 'list'
  ) {
    return currentToken.listType === nextToken.listType
  }

  if (
    current.type === 'list' &&
    next.type === 'list' &&
    current.inlineTokens[0]?.type === 'list' &&
    next.inlineTokens[0]?.type === 'list'
  ) {
    return current.inlineTokens[0].listType === next.inlineTokens[0].listType
  }

  return false
}

// Función PRINCIPAL

export function tokenizeBlocks(input: string) {
  const lines = input
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
  const allCaps = isMostlyUppercase(input)
  const blocks: RichBlock[] = []
  let current: RichBlock | null = null

  const push = () => {
    if (current) {
      current.inlineTokens = tokenizeInline(current.inlineTokens)
      blocks.push(current)
      current = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    const nextLine = lines[i + 1] ?? ''
    if (isOnlySymbols(line)) continue

    const classified = classifyLine(nextLine, line, allCaps)
    if (!classified) continue
    const canGroup = shouldGroupWith(current, classified, allCaps)

    if (!canGroup) {
      push()
      current = classified
    } else {
      if (classified.inlineTokens[0]) {
        current!.inlineTokens.push(classified.inlineTokens[0])
      }
    }

    if (['blockquote', 'paragraph'].includes(classified.type)) push()
  }

  push()
  const textCleaned = blocks
    .map((b) => b.inlineTokens.map((t) => t.text).join(' '))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  return { blocks, textCleaned }
}
