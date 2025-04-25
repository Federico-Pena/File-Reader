import './TextOutput.css'
import { useEffect, useRef } from 'react'
import {
  useFileReaderContext,
  useLocalDataContext,
  useVoiceContext
} from '@/hooks/useCustomContext'
import Header from './Header'

const TextOutput = () => {
  const { error, loading } = useFileReaderContext()
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
    dispatch({ type: 'SET_READED_WORDS', payload: { readWord: null } })
    for (let i = 0; i < index; i++) {
      if (i === index) {
        dispatch({ type: 'SET_READED_WORDS', payload: { readWord: { word, index } } })
      } else {
        dispatch({ type: 'SET_READED_WORDS', payload: { readWord: { word: '', index: i } } })
      }
    }
  }

  const renderInline = (inline: RichInline) => {
    const words = inline.text.split(/\s+/)

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

  if (loading) {
    return (
      <article className="articleText">
        <h2>Espere</h2>
        <div className="loaderContainer">
          <span className="custom-loader"></span>
        </div>
      </article>
    )
  }

  if (error) {
    return (
      <article className="articleText">
        <h2 className="error">Ocurrió un error</h2>
        <p className="error">{error}</p>
      </article>
    )
  }

  return textPages.length === 0 ? (
    <article className="articleText">
      <h2>No hay texto procesado aún.</h2>
      <h3>Sube un archivo para leer.</h3>
    </article>
  ) : (
    <article className="articleText">
      <h2>Opciones de Lectura</h2>
      <Header />
      <h3>{nameFile}</h3>
      <div className="richTextContent">
        {textNormalized.map((block, i) => renderBlock(block, i))}
      </div>
    </article>
  )
}
export default TextOutput
/* import './TextOutput.css'
import { useEffect, useRef } from 'react'
import {
  useFileReaderContext,
  useLocalDataContext,
  useVoiceContext
} from '@/hooks/useCustomContext'
import Header from './Header'

const TextOutput = () => {
  const { error, loading } = useFileReaderContext()
  const {
    dispatch,
    state: { readWords, speaking }
  } = useVoiceContext()
  const {
    state: { textPages, currentPage, nameFile }
  } = useLocalDataContext()
  const refWordHighlighted = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (refWordHighlighted.current) {
      refWordHighlighted.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [readWords])

  const textNormalized = textPages[currentPage]?.text ?? ''
  let globalIndex = 0

  const handleOnClickWord = (word: string, index: number) => {
    if (speaking) return
    dispatch({
      type: 'SET_READED_WORDS',
      payload: {
        readWord: null
      }
    })
    for (let i = 0; i < index; i++) {
      if (i === index) {
        dispatch({
          type: 'SET_READED_WORDS',
          payload: {
            readWord: { word, index }
          }
        })
      } else {
        dispatch({
          type: 'SET_READED_WORDS',
          payload: {
            readWord: { word: '', index: i }
          }
        })
      }
    }
  }

  if (loading) {
    return (
      <article className="articleText">
        <h2>Espere</h2>
        <div className="loaderContainer">
          <span className="custom-loader"></span>
        </div>
      </article>
    )
  }

  if (error) {
    return (
      <article className="articleText">
        <h2 className="error">Ocurrió un error</h2>
        <p className="error">{error}</p>
      </article>
    )
  }

  return textPages.length === 0 ? (
    <article className="articleText">
      <h2>No hay texto procesado aún.</h2>
      <h3>Sube un archivo para leer.</h3>
    </article>
  ) : (
    <article className="articleText">
      <h2>Opciones de Lectura</h2>
      <Header />
      <h3>{nameFile}</h3>
      {textNormalized.split('\n\n').map((paragraphs, i) => {
        return (
          paragraphs.trim().length > 0 && (
            <pre className="text-line" key={i}>
              {paragraphs.split(/\s+/).map((word) => {
                const currentWordIndex = globalIndex++
                const isRead =
                  readWords.some((entry) => entry.index === currentWordIndex) ||
                  (readWords && readWords[readWords.length - 1]?.index > currentWordIndex)
                return (
                  <span
                    onClick={() => handleOnClickWord(word, currentWordIndex)}
                    className={`word ${isRead ? 'word-highlighted' : ''}`}
                    key={currentWordIndex}
                    ref={isRead ? refWordHighlighted : null}
                  >
                    {word}
                  </span>
                )
              })}
            </pre>
          )
        )
      })}
    </article>
  )
}
export default TextOutput
 */
