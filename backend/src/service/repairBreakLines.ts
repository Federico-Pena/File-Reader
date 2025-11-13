/**
 * - Corrige comillas, bullets, guiones, puntuación y saltos de línea incorrectos.
 * - El objetivo es dejar líneas lógicas limpias y listas para tokenización semántica.
 */
export const repairBreakLines = (rawText: string) => {
  let text = rawText

  // ------------------------------------------------------------
  // (1) NORMALIZACIONES BÁSICAS DE CARACTERES
  // ------------------------------------------------------------
  text = normalizeQuotes(text)
  text = normalizeBullets(text)
  text = fixApostrophes(text)
  text = fixOCRDotNoise(text)

  // ------------------------------------------------------------
  // (2) LIMPIEZA DE SÍMBOLOS / RUIDO AL INICIO Y FINAL DE LÍNEA
  // ------------------------------------------------------------
  text = cleanLineEdges(text)

  // ------------------------------------------------------------
  // (3) REPARACIÓN DE SALTOS DE LÍNEA
  // ------------------------------------------------------------
  text = fixHyphenBreaks(text)
  text = gentleRejoinWrappedLines(text)

  // ------------------------------------------------------------
  // (4) LIMPIEZA DE SÍMBOLOS AISLADOS Y ESPACIADOS INCORRECTOS
  // ------------------------------------------------------------
  text = removeIsolatedSymbols(text)
  text = fixSpacingBeforePunctuation(text)

  // ------------------------------------------------------------
  // (5) ELIMINACIÓN DE NUMERACIÓN DE PÁGINA / HEADERS
  // ------------------------------------------------------------
  text = removePageNumbers(text)

  // ------------------------------------------------------------
  // (6) NORMALIZACIÓN FINAL DE PUNTUACIÓN Y ESPACIOS
  // ------------------------------------------------------------
  text = normalizePunctuation(text)
  text = text.replace(/ +/g, ' ').trim()

  // ------------------------------------------------------------
  // SALIDA: líneas separadas limpias
  // ------------------------------------------------------------
  return text
    .trim()
    .split(/\n+/)
    .map((line) => line.trim())
    .join('\n\n')
}

//
// ──────────────────────────────────────────────
// SUBFUNCIONES
// ──────────────────────────────────────────────
//

// (1) --- Normalización básica de caracteres ---
function normalizeQuotes(text: string): string {
  return text.replace(/[“”«'»„]/g, '"').replace(/[‘’‚‛]/g, "'")
}

function normalizeBullets(text: string): string {
  return text
    .replace(
      /^[\s\t]*(["*•·→»_◦▪▫■□●○‣‣►▶⟶\-–—]+)[\s\t]+([A-ZÁÉÍÓÚÜ])/gm,
      '● $2'
    )
    .replace(/^\●\s*\●\s*/gm, '● ')
    .replace(/^\●\s*(?=\S)/gm, '● ')
}

function fixApostrophes(text: string): string {
  return text.replace(
    /([A-ZÁÉÍÓÚÜa-záéíóúñü])["']([A-ZÁÉÍÓÚÜa-záéíóúñü])/gm,
    "$1'$2"
  )
}

function fixOCRDotNoise(text: string): string {
  return text.replace(/\b(?:[a-z]*([a-z])\1{2,}[a-z]*){1,}\b/gi, (match) => {
    if (match === 'www') return 'www.'
    return '.'.repeat(match.split('').length)
  })
}

// (2) --- Limpieza de símbolos extraños al inicio/final de línea ---
function cleanLineEdges(text: string): string {
  text = text.replace(/^\s*[\_\~\|\.\,\!\?\-]+\s*/gm, '')
  return text.replace(/\s+[\_\~\|\.\,\!\?\-]\w*/g, ' ')
}

// (3) --- Reparación de saltos de línea ---
function fixHyphenBreaks(text: string): string {
  return text.replace(/([a-záéíóúñü])\s*-\s*\W?\n\s*([a-záéíóúñü])/gi, '$1$2')
}

function gentleRejoinWrappedLines(text: string): string {
  return text
    .replace(/([a-záéíóúñü,;:()])\s*\n\s*([a-záéíóúñü"()])/gm, '$1 $2')
    .replace(/([a-záéíóúñü,;:])\s*\n\s*(\d{1,3})(?!\s*[\.\)\-])/gm, '$1 $2')
    .replace(/([a-záéíóúñü,;":()])\n([a-záéíóúñü"()])/gm, '$1 $2')
    .replace(/\n+(['(])/g, ' $1')
    .replace(/([0-9A-ZÁÉÍÓÑÜ,;"()])\n([a-záéíóúñü'"()])/gm, '$1 $2')
    .replace(/([a-záéíóúñü,;"()])\n([A-ZÁÉÍÓÚÑÜ][a-záéíóúñü])/gm, '$1 $2')
}

// (4) --- Limpieza de símbolos aislados y spacing ---
function removeIsolatedSymbols(text: string): string {
  return text.replace(/(?<=\s)[^\w](?=\s)/gi, (match) => {
    if (['&', '-', '.', ',', '®', '©', '●'].includes(match)) return match
    return ''
  })
}

function fixSpacingBeforePunctuation(text: string): string {
  return text.replace(/\s+([,\.;:!?…])/g, '$1')
}

// (5) --- Eliminación de numeración de página ---
function removePageNumbers(text: string): string {
  return text
    .replace(/^\s*\d+\s*$/gm, '')
    .replace(/^\s*Página\s*\d+\s*$/gim, '')
    .replace(/^\s*[-–—]\s*\d+\s*[-–—]\s*$/gm, '')
}

// (6) --- Normalización avanzada de puntuación ---
function normalizePunctuation(text: string): string {
  const protections: Record<string, string> = { 'etc.,': '__ETC_COMMA__' }

  // Proteger abreviaturas
  for (const [pattern, token] of Object.entries(protections)) {
    text = text.replace(new RegExp(pattern, 'gm'), token)
  }

  // Elipsis
  text = text.replace(/\.{2,}/g, '...')

  // Runs de puntuación (colapsar repeticiones)
  text = text.replace(/([@©,\.;:!?='…]{1,})/g, (run) => {
    const uniq = Array.from(new Set(run.split('')))
    return uniq[0] ?? ''
  })
  text = text.replace(/([|"@©,\.;:!?'…()])\1+/g, '$1')

  // Espacios antes de signos
  text = text.replace(/\s+([,\.;:!?…])/g, '$1')

  // Restaurar abreviaturas
  for (const [pattern, token] of Object.entries(protections)) {
    text = text.replace(new RegExp(token, 'gm'), pattern)
  }

  return text
}
