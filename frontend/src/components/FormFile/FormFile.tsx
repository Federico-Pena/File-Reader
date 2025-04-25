import './FormFile.css'
import useFileReader from '@/hooks/useFileReader'

export const FormFile = () => {
  const { clientMimeTypes, handleFileUpload: handleUpload } = useFileReader()

  return (
    <>
      <h2>Subir Archivo</h2>
      <form>
        <label htmlFor="fileInput">
          Sube un archivo para leer
          <input
            onChange={async (e) => {
              if (!e.target.files) return
              const fileForUpload = e.target.files[0]
              await handleUpload(fileForUpload)
              e.target.files = null
              e.target.value = ''
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
      </form>
    </>
  )
}
