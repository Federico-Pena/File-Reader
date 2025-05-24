import { JSX } from 'react'

export const renderBlock = (
  block: RichBlock,
  i: number,
  createSpan: (word: string) => JSX.Element
) => {
  const content = renderInline(block.content, createSpan)
  switch (block.type) {
    case 'title':
      return (
        <h1 className="title" key={i}>
          {content}
        </h1>
      )
    case 'subtitle':
      return (
        <h4 className="subtitle" key={i}>
          {content}
        </h4>
      )
    case 'paragraph':
      return (
        <p className="paragraph" key={i}>
          {content}
        </p>
      )
    case 'blockquote':
      return (
        <blockquote className="blockquote" key={i}>
          {content}
        </blockquote>
      )
    case 'list':
      const start = block.content.match(/^([0-9]+)[.)]/)?.[1]
      return (
        <ol className="list" key={i} start={start ? Number(start) : 1}>
          <li>{content}</li>
        </ol>
      )
  }
}

const renderInline = (inline: string, createSpan: (word: string) => JSX.Element) => {
  const words = inline.split(/\s+/g)
  const elements: JSX.Element[] = []

  let i = 0
  while (i < words.length) {
    const word = words[i]
    // Links
    if (word.includes('http') || word.includes('www')) {
      const span = createSpan(word)
      elements.push(
        <a href={word} target="_blank" rel="noreferrer" className="link" key={`link-${i}`}>
          {span}
        </a>
      )
      i++
      continue
    }

    // Quotes simples
    if (
      word.replace(/^[.,;:(¡¿]+/, '').startsWith('"') &&
      word.replace(/[.,;:)!?]+$/, '').endsWith('"') &&
      word.length > 1
    ) {
      elements.push(
        <em className="quote" key={`quote-${i}`}>
          {createSpan(word)}
        </em>
      )
      i++
      continue
    }

    // Quotes multiple words
    if (word.replace(/^[.,;(:¡¿]+/, '').startsWith('"')) {
      const quoteWords: string[] = [word]
      i++
      while (i < words.length && !words[i].replace(/[.,;:!.?]+$/, '').endsWith('"')) {
        quoteWords.push(words[i])
        i++
      }
      if (i < words.length) {
        quoteWords.push(words[i])
        i++
      }

      const quoteSpans = quoteWords.map(createSpan)
      elements.push(
        <em className="quote" key={`quote-${i}`}>
          {quoteSpans}
        </em>
      )
      continue
    }

    // Normal word
    elements.push(createSpan(word))
    i++
  }

  return elements
}
