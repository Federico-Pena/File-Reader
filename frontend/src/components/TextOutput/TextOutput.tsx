import './TextOutput.css'
import { useEffect, useRef } from 'react'
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
      refWordHighlighted.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [readWords])

  const textNormalized: RichBlock[] = textPages[currentPage]?.withLineBreaks ?? []
  let globalIndex = 0

  const handleOnClickWord = (word: string, index: number) => {
    if (speaking || window.speechSynthesis.speaking) return
    console.log('👉 handleOnClickWord', word, index)

    dispatch({ type: 'SET_READED_WORDS', payload: { readWord: null } })
    dispatch({ type: 'SET_READED_WORDS', payload: { readWord: { word, index } } })
  }

  const renderInline = (inline: RichInline) => {
    const words = inline.text.split(/\s+/g)

    return words.map((word) => {
      const currentIndex = globalIndex++
      const isRead = readWords && readWords[readWords.length - 1]?.index >= currentIndex

      const span = (
        <span
          key={currentIndex}
          onClick={() => handleOnClickWord(word, currentIndex)}
          className={`word ${isRead ? 'word-highlighted' : ''}`}
          ref={isRead ? refWordHighlighted : null}
        >
          {word}{' '}
        </span>
      )
      switch (inline.type) {
        case 'quote':
          return (
            <em className="quote" key={currentIndex}>
              {span}
            </em>
          )
        case 'link':
          return (
            <a
              className="link"
              href={inline.url}
              target="_blank"
              rel="noopener noreferrer"
              key={currentIndex}
            >
              {span}
            </a>
          )
        default:
          return span
      }
    })
  }

  const renderBlock = (block: RichBlock, i: number) => {
    const content = block.content.map(renderInline)
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
      default:
        return null
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
