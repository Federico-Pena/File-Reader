/////////// WORKERS ///////////

type WorkerStartMsg = {
  type: 'start'
  file: File
  lang: string
  initPage: string
  endPage: string
  postUrl: string
}

type WorkerStopMsg = { type: 'stop' }

type WorkerIncomingMsg = WorkerStartMsg | WorkerStopMsg

type WorkerOutgoingMsg =
  | { type: 'sse'; data: SSEEvent }
  | { type: 'parse-error'; error: string; raw: string }
  | { type: 'done' }
  | { type: 'aborted' }
  | { type: 'error'; error: string }

/////////// FILE READER CONTEXT ///////////

type TextPage = {
  forSpeech: string
  forRender: RichBlock[]
  page: number
}

interface FilesStateType {
  textPages: TextPage[]
  currentPage: number
  nameFile: string
  currentWord: { word: string; index: number } | null
}

interface LocalStorageFileStateType {
  files: FileDataStateType[]
  currentFileName: string
}

type FilesActionType =
  | { type: 'LOAD_STATE' }
  | { type: 'CLEAN_STATE' }
  | { type: 'SET_TEXT_PAGES_APPEND'; payload: { page: TextPages } }
  | { type: 'SET_NAME_FILE'; payload: { nameFile: string } }
  | { type: 'SET_PAGE'; payload: { currentPage: number } }
  | { type: 'CHANGE_FILE'; payload: { nameFile: string } }
  | {
      type: 'SET_CURRENT_WORD'
      payload: {
        word: string
        index: number
      } | null
    }

interface FileDataContextType {
  state: FilesStateType
  dispatch: React.Dispatch<FilesActionType>
}

/////////////// VOICE CONTEXT //////////////

interface VoiceStateType {
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  speaking: boolean
  rateUtterance: number
  volume: number
}

interface LocalStorageVoiceStateType {
  volume: number
  rateUtterance: number
  voiceName: string
}

type VoiceAction =
  | { type: 'LOAD_STATE' }
  | { type: 'SET_CURRENT_VOICE'; payload: { voice: SpeechSynthesisVoice } }
  | { type: 'SET_VOICES'; payload: { voices: SpeechSynthesisVoice[] } }
  | { type: 'SET_SPEAKING'; payload: { speaking: boolean } }
  | { type: 'SET_RATE_UTTERANCE'; payload: { rateUtterance: number } }
  | { type: 'SET_VOLUME'; payload: { volume: number } }

interface VoiceContextType {
  state: VoiceStateType
  dispatch: React.Dispatch<VoiceAction>
}
