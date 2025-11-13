import { RichBlock } from '@shared/types/types'

/////////// FILE READER CONTEXT ///////////
interface FileReaderContextType {
  loading: boolean
  error: string
  queued: number
  totalPages: number
  changeError: (error: string) => void
  changeLoading: (isLoading: boolean) => void
  changeQueued: (position: number) => void
  changeTotalPages: (totalPages: number) => void
}

type TextPages = {
  cleaned: string
  withLineBreaks: RichBlock[]
  page: number
}
interface LastFileMetaData {
  textPages: TextPages[] | []
  currentPage: number
  nameFile: string
}
interface LocalDataStateType {
  lastFiles: LastFileMetaData[]
  textPages: TextPages[] | never[]
  currentPage: number
  nameFile: string
}

type LocalDataAction =
  | { type: 'LOAD_STATE' }
  | { type: 'CLEAN_TEXT_PAGES' }
  | { type: 'SET_TEXT_PAGES_APPEND'; payload: { page: TextPages } }
  | { type: 'SET_NAME_FILE'; payload: { nameFile: string } }
  | { type: 'SET_PAGE'; payload: { currentPage: number } }
  | { type: 'SET_VOICE_NAME'; payload: { voice: string } }
  | { type: 'CHANGE_FILE'; payload: { nameFile: string } }

interface LocalDataContextType {
  state: LocalDataStateType
  dispatch: React.Dispatch<LocalDataAction>
}

/////////////// VOICE CONTEXT //////////////

interface VoiceStateType {
  voices: SpeechSynthesisVoice[]
  selectedVoice: string
  readWords: { word: string; index: number } | null
  speaking: boolean
  rateUtterance: number
  volume: number
}

type VoiceAction =
  | { type: 'LOAD_STATE' }
  | { type: 'SET_VOICE_NAME'; payload: { voice: string } }
  | { type: 'SET_VOICES'; payload: { voices: SpeechSynthesisVoice[] } }
  | {
      type: 'SET_READ_WORD'
      payload: {
        word: string
        index: number
      } | null
    }
  | { type: 'SET_SPEAKING'; payload: { speaking: boolean } }
  | { type: 'SET_RATE_UTTERANCE'; payload: { rateUtterance: number } }
  | { type: 'SET_VOLUME'; payload: { volume: number } }

interface VoiceContextType {
  state: VoiceStateType
  dispatch: React.Dispatch<VoiceAction>
}
