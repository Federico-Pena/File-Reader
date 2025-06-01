import './TextOutput.css'
import { useEffect, useRef } from 'react'
import { useLocalDataContext, useVoiceContext } from '@/hooks/useCustomContext'
import Header from './Header'
import { renderBlock } from '@/textParser/renderBlock'

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
          {textNormalized.map((block, i) => renderBlock(block, i, createSpan))}
        </div>
      </div>
    </article>
  )
}

export default TextOutput
