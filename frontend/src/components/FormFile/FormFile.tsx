import { useState } from 'react'
import './FormFile.css'
import { useFileReader } from '@/hooks/useFileReader'
import { useFileReaderContext } from '@/hooks/useCustomContext'
import { IconBackNext, IconUpload, SendIcon } from '../Icons/Icons'

type FormFileState = {
  file: File | null
  language: string
  initPage: string
  endPage: string
  open: boolean
}
export const FormFile = () => {
  const { clientMimeTypes, handleFileUpload } = useFileReader()
  const { loading } = useFileReaderContext()
  const [state, setState] = useState<FormFileState>({
    file: null,
    language: 'spa',
    initPage: '1',
    endPage: '',
    open: false
  })
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!state.file || loading) return
    handleStateChange({ open: false })
    const input = e.currentTarget?.querySelector('#fileInput') as HTMLInputElement
    if (input) {
      input.value = ''
      input.files = null
    }
    const initPageNumber = state.initPage ? Number(state.initPage) : 0
    const endPageNumber = state.endPage ? Number(state.endPage) : 0
    await handleFileUpload(state.file, state.language, initPageNumber, endPageNumber)

    handleStateChange({ file: null, language: 'spa', initPage: '1', endPage: '', open: false })
  }

  const handleStateChange = (newState: Partial<FormFileState>) => {
    setState((prevState) => ({ ...prevState, ...newState }))
  }

  return (
    <>
      {!loading && (
        <button
          type="button"
          title={state.open ? 'Volver' : 'Cargar archivo'}
          className={`btn-load-file ${state.open ? 'open' : ''}`}
          onClick={() => handleStateChange({ open: !state.open })}
        >
          {state.open ? <IconBackNext /> : <IconUpload />}
        </button>
      )}

      <form className={`form-file ${state.open ? 'open' : ''}`} onSubmit={handleUpload}>
        <label htmlFor="fileInput">
          Sube un archivo para leer
          <input
            onChange={async (e) => {
              if (!e.target.files) return
              const fileForUpload = e.target.files[0]
              handleStateChange({ file: fileForUpload })
            }}
            name="fileInput"
            id="fileInput"
            type="file"
            accept={clientMimeTypes.map((type: string) => `.${type.toLowerCase()}`).join(', ')}
            aria-label="Sube un archivo para leer"
          />
          {clientMimeTypes.length > 0 && (
            <div className="mime-types-list">
              <p>Formatos:</p>
              <ul>
                {clientMimeTypes.map((type: string, index: number) => (
                  <li key={index}>{type}</li>
                ))}
              </ul>
            </div>
          )}
        </label>
        <label htmlFor="language">
          Idioma del archivo
          <select
            name="language"
            id="language"
            onChange={(e) => handleStateChange({ language: e.target.value })}
          >
            <option value="spa">Español</option>
            <option value="eng">Inglés</option>
          </select>
        </label>
        {state.file && state.file.name.split('.').pop()?.toLowerCase() === 'pdf' && (
          <label htmlFor="initPage" className="pages">
            Paginas
            <span>
              Desde{' '}
              <input
                type="number"
                name="initPage"
                id="initPage"
                min="1"
                value={state.initPage}
                onChange={(e) => handleStateChange({ initPage: e.target.value })}
              />
            </span>
            <span>
              Hasta{' '}
              <input
                type="number"
                name="endPage"
                id="endPage"
                min="1"
                value={state.endPage}
                onChange={(e) => handleStateChange({ endPage: e.target.value })}
              />
            </span>
          </label>
        )}

        <button type="submit" title="Cargar archivo">
          Enviar <SendIcon />
        </button>
      </form>
    </>
  )
}
