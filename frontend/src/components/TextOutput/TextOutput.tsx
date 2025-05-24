import './TextOutput.css'
import { JSX, useEffect, useRef } from 'react'
import { useLocalDataContext, useVoiceContext } from '@/hooks/useCustomContext'
import Header from './Header'

const TextOutput = () => {
  const {
    dispatch,
    state: { readWords, speaking }
  } = useVoiceContext()
  const {
    state: { textPages, currentPage, nameFile }
  } = useLocalDataContext()

  const refWordHighlighted = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (refWordHighlighted.current) {
      refWordHighlighted.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [readWords])

  const textNormalized: RichBlock[] = textPages[currentPage]?.withLineBreaks ?? []
  let globalIndex = 0

  const handleOnClickWord = (word: string, index: number) => {
    if (speaking || window.speechSynthesis.speaking) return
    dispatch({ type: 'SET_READED_WORD', payload: { word, index } })
  }

  const createSpan = (word: string) => {
    const currentIndex = globalIndex++
    const isRead = readWords && readWords.index >= currentIndex
    return (
      <span
        data-index={currentIndex}
        key={currentIndex}
        onClick={() => handleOnClickWord(word, currentIndex)}
        className={`word ${isRead ? 'word-highlighted' : ''}`}
        ref={isRead ? refWordHighlighted : null}
      >
        {word}{' '}
      </span>
    )
  }

  const renderInline = (inline: string) => {
    const words = inline.split(/\s+/g)
    const elements: JSX.Element[] = []

    let i = 0
    while (i < words.length) {
      const word = words[i]

      // Detectar enlaces
      if (word.includes('http') || word.includes('www')) {
        const span = createSpan(word)
        elements.push(
          <a
            href={word}
            target="_blank"
            rel="noreferrer"
            className="link"
            key={`link-${globalIndex}`}
          >
            {span}
          </a>
        )
        i++
        continue
      }

      // Citas simples de una palabra
      if (
        word.replace(/^[.,;(:¡¿]+/, '').startsWith('"') &&
        word.replace(/[.,;:)!?]+$/, '').endsWith('"') &&
        word.length > 1
      ) {
        elements.push(
          <em className="quote" key={`quote-${globalIndex}`}>
            {createSpan(word)}
          </em>
        )
        i++
        continue
      }

      // Citas que abarcan múltiples palabras
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
          <em className="quote" key={`quote-${globalIndex}`}>
            {quoteSpans}
          </em>
        )
        continue
      }

      // Palabra normal
      elements.push(createSpan(word))
      i++
    }

    return elements
  }

  const renderBlock = (block: RichBlock, i: number) => {
    const content = renderInline(block.content)
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

  return textPages.length === 0 ? (
    <article className="articleText">
      <h2>Comienza cargando el archivo</h2>
    </article>
  ) : (
    <article className="articleText">
      <Header />
      <div className="div-text">
        <h3>{nameFile}</h3>
        <div className="richTextContent">
          {textNormalized.map((block, i) => renderBlock(block, i))}
        </div>
      </div>
    </article>
  )
}

export default TextOutput
