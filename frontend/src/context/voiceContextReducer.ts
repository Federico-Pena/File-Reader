import { updateLocalStorage } from '@/utils/updateLocalStorage'

const voiceContextReducer = (state: VoiceStateType, action: VoiceAction) => {
  switch (action.type) {
    case 'LOAD_STATE':
      const stringData = window.localStorage.getItem('dataLastFile')
      if (stringData === null) {
        return {
          ...state
        }
      }
      const { readWords, selectedVoice, rateUtterance, volume }: VoiceStateType =
        JSON.parse(stringData)
      return {
        ...state,
        readWords: readWords || state.readWords,
        selectedVoice: selectedVoice || state.selectedVoice,
        rateUtterance: rateUtterance || state.rateUtterance,
        volume: volume || state.volume
      }
    case 'SET_VOICES':
      return {
        ...state,
        voices: action.payload.voices
      }
    case 'SET_VOICE_NAME':
      updateLocalStorage({
        selectedVoice: action.payload.voice
      })
      return {
        ...state,
        selectedVoice: action.payload.voice
      }
    case 'SET_SPEAKING':
      return {
        ...state,
        speaking: action.payload.speaking
      }
    case 'SET_RATE_UTTERANCE':
      updateLocalStorage({
        rateUtterance: action.payload.rateUtterance
      })
      return {
        ...state,
        rateUtterance: action.payload.rateUtterance
      }
    case 'SET_VOLUME':
      updateLocalStorage({
        volume: action.payload.volume
      })
      return {
        ...state,
        volume: action.payload.volume
      }
    case 'SET_READ_WORD':
      updateLocalStorage({
        readWords: action.payload
      })
      return {
        ...state,
        readWords: action.payload
      }
    default:
      return state
  }
}

export { voiceContextReducer }
