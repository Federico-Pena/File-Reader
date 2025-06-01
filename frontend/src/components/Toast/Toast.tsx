import { useFileReaderContext, useLocalDataContext } from '@/hooks/useCustomContext'
import './Toast.css'
export const Toast = () => {
  const { error, loading, queued, totalPages } = useFileReaderContext()
  const {
    state: { textPages }
  } = useLocalDataContext()
  if (error) {
    return (
      <div className={`toast`}>
        <p>{error}</p>
      </div>
    )
  }
  if (queued > 0) {
    return (
      <div className={`toast`}>
        <div className="loaderContainer">
          <span>
            Esperando para iniciar, hay {queued} {queued > 1 ? 'procesos' : 'proceso'} antes que
            usted.
          </span>
          <span className="loader"></span>
        </div>
      </div>
    )
  }
  if (loading) {
    return (
      <div className={`toast`}>
        <div className="loaderContainer">
          <span>
            Cargando páginas {textPages[textPages.length - 1]?.page + 1 || 0} de {totalPages}
          </span>
          <span className="loader"></span>
        </div>
      </div>
    )
  }
  return null
}
