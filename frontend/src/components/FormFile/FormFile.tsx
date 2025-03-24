import './FormFile.css'
import useFileReader from '@/hooks/useFileReader'
import { useState } from 'react'

export const FormFile = () => {
  const { clientMimeTypes, handleFileUpload: handleUpload } = useFileReader()
  const [fileForUpload, setFileForUpload] = useState<File | null>(null)

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!fileForUpload) return
    await handleUpload(fileForUpload)
    setFileForUpload(null)
  }

  return (
    <>
      <h2>Subir Archivo</h2>
      <form onSubmit={handleFileUpload}>
        <label htmlFor="fileInput">
          Sube un archivo para leer
          <input
            onChange={(e) => {
              if (!e.target.files) return
              setFileForUpload(e.target.files[0])
              e.target.files = null
            }}
            name="fileInput"
            id="fileInput"
            type="file"
            accept={clientMimeTypes.map((type: string) => `.${type.toLowerCase()}`).join(', ')}
            aria-label="Sube un archivo para leer"
          />
        </label>
        {clientMimeTypes.length > 0 && (
          <div className="mime-types-list">
            <p>Formatos:</p>
            <ul>
              {clientMimeTypes.map((type: string, index: number) => (
                <li key={index}>.{type}</li>
              ))}
            </ul>
          </div>
        )}
        <button className="btn-form" title="Enviar" type="submit">
          Enviar
        </button>
      </form>
    </>
  )
}
