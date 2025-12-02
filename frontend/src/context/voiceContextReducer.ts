import { getLocalStorageItem, updateLocalStorage } from '@/utils/updateLocalStorage'

const voiceContextReducer = (state: VoiceStateType, action: VoiceAction) => {
  switch (action.type) {
    case 'LOAD_STATE':
      const stringData = getLocalStorageItem('voiceState')
      if (!stringData) {
        return {
          ...state
        }
      }
      const { rateUtterance, volume }: LocalStorageVoiceStateType = stringData
      return {
        ...state,

        rateUtterance: rateUtterance || state.rateUtterance,
        volume: volume || state.volume
      }
    case 'SET_VOICES':
      return {
        ...state,
        voices: action.payload.voices
      }
    case 'SET_CURRENT_VOICE':
      updateLocalStorage(
        {
          voiceName: action.payload.voice.name
        },
        'voiceState'
      )
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
      updateLocalStorage(
        {
          rateUtterance: action.payload.rateUtterance
        },
        'voiceState'
      )
      return {
        ...state,
        rateUtterance: action.payload.rateUtterance
      }
    case 'SET_VOLUME':
      updateLocalStorage(
        {
          volume: action.payload.volume
        },
        'voiceState'
      )
      return {
        ...state,
        volume: action.payload.volume
      }

    default:
      return state
  }
}

export { voiceContextReducer }
