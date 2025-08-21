import { useFileReaderContext, useLocalDataContext } from '@/hooks/useCustomContext'

export const SelectFile = () => {
  const { loading } = useFileReaderContext()
  const {
    state: { lastFiles, nameFile },
    dispatch
  } = useLocalDataContext()

  const handleChangeFile = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (loading) return
    const fileName = e.target.value
    if (fileName) {
      dispatch({ type: 'CHANGE_FILE', payload: { nameFile: fileName } })
    }
  }

  return (
    <select
      name="storageFiles"
      id="storageFiles"
      onChange={handleChangeFile}
      disabled={loading || window.speechSynthesis.speaking}
    >
      {lastFiles.length > 0 && <option value={''}>{nameFile}</option>}
      {lastFiles.length > 0 ? (
        lastFiles.map((file, i) => {
          return (
            file.nameFile !== nameFile && (
              <option key={`${file.nameFile}-${i}`} value={file.nameFile}>
                {file.nameFile}
              </option>
            )
          )
        })
      ) : (
        <option value="">{'No hay archivos cargados'}</option>
      )}
    </select>
  )
}
