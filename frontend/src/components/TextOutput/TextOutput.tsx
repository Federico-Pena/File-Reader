import './TextOutput.css'
import { useEffect, useRef } from 'react'
import {
  useFileReaderContext,
  useLocalDataContext,
  useVoiceContext
} from '@/hooks/useCustomContext'
import Header from './Header'
import { normalizeText } from '@/utils/normalizeText'

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

  const textNormalized = normalizeText(textPages[currentPage] ? textPages[currentPage].text : '')
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
            <p className="text-line" key={i}>
              {paragraphs.split(' ').map((word) => {
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
            </p>
          )
        )
      })}
      {/*  </HighlightedText> */}
    </article>
  )
}
export default TextOutput
