type LocalStorageItemMap = {
  fileDataState: LocalStorageFileStateType
  voiceState: LocalStorageVoiceStateType
}
type LocalStorageKey = keyof LocalStorageItemMap

function handleMakingSpace(itemKey: 'fileDataState') {
  const updatedState = getLocalStorageItem(itemKey)
  if (!updatedState) {
    console.error(`Error making space in localStorage for ${itemKey}`)
    return
  }
  /*  while (updatedState.lastFiles?.length > 0) {
    updatedState.lastFiles = updatedState.lastFiles.slice(0, -1)

    try {
      window.localStorage.setItem(itemKey, JSON.stringify(updatedState))
      break
    } catch {
      continue
    }
  } */
}

export const updateLocalStorage = <K extends LocalStorageKey>(
  newPartialState: Partial<LocalStorageItemMap[K]>,
  itemKey: K
) => {
  try {
    let dataLastFileString = window.localStorage.getItem(itemKey)
    if (dataLastFileString === null) {
      window.localStorage.setItem(itemKey, JSON.stringify(newPartialState))
      dataLastFileString = JSON.stringify(newPartialState)
    }

    const existingState = JSON.parse(dataLastFileString) as LocalStorageItemMap[K]
    const updatedState: LocalStorageItemMap[K] = {
      ...existingState,
      ...newPartialState
    }

    try {
      window.localStorage.setItem(itemKey, JSON.stringify(updatedState))
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        if (itemKey === 'fileDataState') {
          handleMakingSpace(itemKey)
        }
      } else {
        console.error('Error saving to localStorage:', e)
      }
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const getLocalStorageItem = <K extends LocalStorageKey>(itemKey: K): LocalStorageItemMap[K] | undefined => {
  const dataLastFileString = window.localStorage.getItem(itemKey)
  if (dataLastFileString === null) {
    return undefined
  }
  return JSON.parse(dataLastFileString) as LocalStorageItemMap[K]
}

const MAX_BYTES = 5 * 1024 * 1024

export const getLocalStorageUsage = () => {
  let total = 0
  for (const key in localStorage) {
    const value = localStorage.getItem(key)
    if (value) {
      total += new Blob([value]).size
    }
  }
  const percent = ((total / MAX_BYTES) * 100).toFixed(2)
  return `${percent}%`
}

export const getTotalFiles = () => {
  let total = 0
  const dataFiles = getLocalStorageItem('fileDataState')
  if (dataFiles) {
    total += dataFiles.files.length
  }
  return total
}
