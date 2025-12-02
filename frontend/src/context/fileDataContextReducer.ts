import { getLocalStorageItem, updateLocalStorage } from '@/utils/updateLocalStorage'

const fileDataContextInitialState: FilesStateType = {
  textPages: [],
  currentPage: 0,
  nameFile: '',
  currentWord: null
}

const fileDataContextReducer = (state: FilesStateType, action: FilesActionType) => {
  const storageData = getLocalStorageItem('fileDataState')

  switch (action.type) {
    case 'SET_CURRENT_WORD':
      if (storageData) {
        const fileSaved = storageData.files.find((file) => file.nameFile === state.nameFile)
        if (fileSaved) {
          updateLocalStorage(
            {
              files: [
                ...storageData.files.filter((file) => file.nameFile !== state.nameFile),
                {
                  ...state,
                  currentWord: action.payload
                }
              ]
            },
            'fileDataState'
          )
        }
      }
      return {
        ...state,
        currentWord: action.payload
      }
    case 'CHANGE_FILE':
      if (storageData) {
        const fileSaved = storageData.files.find((file) => file.nameFile === action.payload.nameFile)
        if (fileSaved) {
          return {
            ...state,
            nameFile: action.payload.nameFile,
            textPages: fileSaved.textPages,
            currentPage: fileSaved.currentPage,
            currentWord: fileSaved.currentWord
          }
        }
      }
      return {
        ...state
      }

    case 'CLEAN_STATE':
      return {
        textPages: [],
        currentPage: 0,
        nameFile: '',
        currentWord: null
      }

    case 'SET_TEXT_PAGES_APPEND':
      const sortedPages = [
        ...state.textPages.filter((page) => page.page !== action.payload.page.page),
        action.payload.page
      ].sort((a, b) => a.page - b.page)
      if (storageData) {
        updateLocalStorage(
          {
            files: [
              ...storageData.files.filter((file) => file.nameFile !== state.nameFile),
              {
                ...state,
                textPages: sortedPages
              }
            ]
          },
          'fileDataState'
        )
      } else {
        updateLocalStorage(
          {
            files: [
              {
                ...state,
                textPages: sortedPages
              }
            ]
          },
          'fileDataState'
        )
      }

      return {
        ...state,
        textPages: sortedPages
      }

    case 'SET_NAME_FILE':
      updateLocalStorage(
        {
          files: storageData?.files ?? [],
          currentFileName: action.payload.nameFile
        },
        'fileDataState'
      )
      return {
        ...state,
        nameFile: action.payload.nameFile
      }

    case 'LOAD_STATE':
      if (storageData) {
        return {
          ...state,
          nameFile: storageData.currentFileName,
          textPages: storageData.files.find((file) => file.nameFile === storageData.currentFileName)?.textPages ?? [],
          currentPage:
            storageData.files.find((file) => file.nameFile === storageData.currentFileName)?.currentPage ?? 0,
          currentWord:
            storageData.files.find((file) => file.nameFile === storageData.currentFileName)?.currentWord ?? null
        }
      }
      return {
        ...state
      }
    case 'SET_PAGE':
      // Revisar desde aca

      return {
        ...state,
        currentPage: action.payload.currentPage
      }

    default:
      return state
  }
}

export { fileDataContextReducer, fileDataContextInitialState }
