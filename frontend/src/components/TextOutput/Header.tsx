import { useLocalDataContext, useVoiceContext } from '@/hooks/useCustomContext'
import { IconPause, IconPlay, IconStop } from '../Icons/Icons'
import React from 'react'
import { useUtterance } from '@/hooks/useUtterance'

const Header = () => {
  const {
    dispatch,
    state: { rateUtterance, volume, voices, speaking, selectedVoice }
  } = useVoiceContext()
  const {
    dispatch: dispatchLocalData,
    state: { textPages, currentPage }
  } = useLocalDataContext()
  const { play, stop } = useUtterance()

  const handleVoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.trim() === '') return
    const voiceName = event.target.value
    const voice = voices.find((voice) => voice.name === voiceName)
    if (!voice) return
    stop()
    dispatch({
      type: 'SET_VOICE_NAME',
      payload: {
        voice: voice.name ?? selectedVoice
      }
    })
  }

  const handleSetPage = (page: number) => {
    stop()
    dispatchLocalData({
      type: 'SET_PAGE',
      payload: {
        currentPage: page
      }
    })
    dispatch({
      type: 'SET_READED_WORDS',
      payload: {
        readWord: null
      }
    })
  }

  const handleVolumeChange = (volume: number) => {
    dispatch({
      type: 'SET_VOLUME',
      payload: {
        volume
      }
    })
  }

  const handleRateChange = (rateUtterance: number) => {
    dispatch({
      type: 'SET_RATE_UTTERANCE',
      payload: {
        rateUtterance
      }
    })
  }

  return (
    <header>
      <div className="voice-select">
        <label htmlFor="voiceSelect">Voz:</label>
        <input
          defaultValue={selectedVoice}
          onChange={handleVoiceChange}
          type="search"
          list="listVoices"
          id="voiceSelect"
          name="voiceSelect"
        />
        <datalist id="listVoices" aria-label="Selecciona la voz para la lectura en voz alta">
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </datalist>
      </div>
      <div className="btns-controls">
        <button
          title={speaking ? 'Pause' : 'Play'}
          type="button"
          className="btn-control"
          onClick={play}
        >
          {speaking ? <IconPause /> : <IconPlay />}
        </button>
        <button title={'Stop'} type="button" className="btn-control" onClick={stop}>
          <IconStop />
        </button>
      </div>
      <div className="pages-btns">
        {textPages.length > 1 && (
          <>
            {textPages.map((page, i) => (
              <span
                key={i}
                className={currentPage === i ? 'active' : ''}
                onClick={() => handleSetPage(i)}
              >
                {page.page + 1}
              </span>
            ))}
          </>
        )}
      </div>
      <div className="volume-rate-container">
        <div>
          <label htmlFor="volumeRate">Volumen: {volume}</label>
          <input
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            type="range"
            min="0"
            max="1"
            step="0.1"
            id="volumeRate"
            name="volumeRate"
            value={volume}
          />
        </div>
        <div>
          <label htmlFor="rate">Rate: {rateUtterance}</label>
          <input
            onChange={(e) => handleRateChange(Number(e.target.value))}
            type="range"
            min="0"
            max="2"
            step="0.1"
            id="rate"
            name="rate"
            value={rateUtterance}
          />
        </div>
      </div>
    </header>
  )
}
export default Header
