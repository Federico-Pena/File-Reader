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
    const updatedState = {
      ...existingState,
      ...newPartialState
    }
    window.localStorage.setItem(itemKey, JSON.stringify(updatedState))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}
