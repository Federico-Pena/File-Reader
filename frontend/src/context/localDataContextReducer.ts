import { updateLocalStorage } from '@/utils/updateLocalStorage'

const localDataContextReducer = (state: LocalDataStateType, action: LocalDataAction) => {
  switch (action.type) {
    case 'SET_TEXT_PAGES':
      updateLocalStorage({
        textPages: action.payload.textPages,
        currentPage: 0
      })
      return {
        ...state,
        textPages: action.payload.textPages,
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
      updateLocalStorage({
        nameFile: action.payload.nameFile
      })
      return {
        ...state,
        nameFile: action.payload.nameFile
      }
    case 'LOAD_STATE':
      const stringData = window.localStorage.getItem('dataLastFile')
      if (stringData === null) {
        return {
          ...state
        }
      }
      const { nameFile, textPages, currentPage }: LocalDataStateType = JSON.parse(stringData)
      if (typeof textPages[0].withLineBreaks[0].content !== 'string') {
        return {
          ...state
        }
      }
      return {
        ...state,
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
