import { updateLocalStorage } from '@/utils/updateLocalStorage'

const localDataContextReducer = (state: LocalDataStateType, action: LocalDataAction) => {
  switch (action.type) {
    case 'CHANGE_FILE':
      const changeFileSearchFile = state.lastFiles.find(
        (file) => file.nameFile === action.payload.nameFile
      )
      if (!changeFileSearchFile) {
        return state
      }
      const newLastFiles = [
        ...state.lastFiles.filter(
          (file) => file.nameFile !== action.payload.nameFile && file.nameFile !== state.nameFile
        ),
        {
          nameFile: state.nameFile,
          textPages: state.textPages,
          currentPage: state.currentPage
        },
        {
          ...changeFileSearchFile,
          textPages: []
        }
      ]

      const newState = {
        lastFiles: newLastFiles,
        nameFile: changeFileSearchFile.nameFile,
        textPages: changeFileSearchFile.textPages,
        currentPage: changeFileSearchFile.currentPage
      }
      updateLocalStorage(newState)
      return {
        ...state,
        ...newState
      }

    case 'CLEAN_TEXT_PAGES':
      updateLocalStorage({
        textPages: [],
        currentPage: 0
      })
      return {
        ...state,
        textPages: [],
        currentPage: 0
      }
    case 'SET_TEXT_PAGES_APPEND':
      const sortedPages = [
        ...state.textPages.filter((page) => page.page !== action.payload.page.page),
        action.payload.page
      ].sort((a, b) => a.page - b.page)
      updateLocalStorage({
        textPages: sortedPages,
        currentPage: state.currentPage
      })
      return {
        ...state,
        textPages: sortedPages
      }
    case 'SET_NAME_FILE':
      const newFiles = state.lastFiles.filter((file) => file.nameFile !== state.nameFile)
      const setNameFileOldFile = {
        textPages: state.textPages,
        currentPage: state.currentPage,
        nameFile: state.nameFile
      }
      const setNameFileNewFile = {
        textPages: [],
        currentPage: 0,
        nameFile: action.payload.nameFile
      }
      const setNameNewFiles = [setNameFileNewFile, setNameFileOldFile, ...newFiles].filter(
        (file) => file.nameFile.trim().length > 0
      )
      updateLocalStorage({ lastFiles: setNameNewFiles, nameFile: action.payload.nameFile })
      return {
        ...state,
        textPages: [],
        currentPage: 0,
        nameFile: action.payload.nameFile,
        lastFiles: setNameNewFiles
      }
    case 'LOAD_STATE':
      const stringData = window.localStorage.getItem('dataLastFile')
      if (stringData === null) {
        return {
          ...state
        }
      }
      const {
        nameFile,
        textPages,
        currentPage,
        lastFiles: previosFiles
      }: LocalDataStateType = JSON.parse(stringData)
      if (textPages && typeof textPages[0]?.withLineBreaks[0]?.content !== 'string') {
        return {
          ...state
        }
      }

      return {
        ...state,
        lastFiles: previosFiles || state.lastFiles,
        nameFile: nameFile || state.nameFile,
        textPages: textPages || state.textPages,
        currentPage: currentPage || state.currentPage
      }
    case 'SET_PAGE':
      updateLocalStorage({
        currentPage: action.payload.currentPage
      })
      return {
        ...state,
        currentPage: action.payload.currentPage
      }

    default:
      return state
  }
}

export { localDataContextReducer }
