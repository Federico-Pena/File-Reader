import { LocalDataStateType, VoiceStateType } from '@/types'

export const updateLocalStorage = (
  newPartialState: Partial<LocalDataStateType | VoiceStateType>,
  itemKey: string = 'dataLastFile'
) => {
  try {
    let dataLastFileString = window.localStorage.getItem(itemKey)
    if (dataLastFileString === null) {
      window.localStorage.setItem(itemKey, JSON.stringify(newPartialState))
      dataLastFileString = JSON.stringify(newPartialState)
    }

    const existingState = JSON.parse(dataLastFileString)
    const updatedState: LocalDataStateType | VoiceStateType = {
      ...existingState,
      ...newPartialState
    }

    try {
      window.localStorage.setItem(itemKey, JSON.stringify(updatedState))
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        while ((updatedState as LocalDataStateType).lastFiles?.length > 0) {
          ;(updatedState as LocalDataStateType).lastFiles = (
            updatedState as LocalDataStateType
          ).lastFiles.slice(0, -1)

          try {
            window.localStorage.setItem(itemKey, JSON.stringify(updatedState))
            break
          } catch (_) {
            continue
          }
        }
      } else {
        console.error('Error saving to localStorage:', e)
      }
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

const MAX_BYTES = 5 * 1024 * 1024

export const getLocalStorageUsage = () => {
  let total = 0
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const value = localStorage.getItem(key)
      total += value ? value.length * 2 : 0 // cada char ~2 bytes
    }
  }
  const percent = ((total / MAX_BYTES) * 100).toFixed(2)
  return `${percent}%`
}
