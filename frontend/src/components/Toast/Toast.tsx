import { useFileReaderContext } from '@/hooks/useCustomContext'
import './Toast.css'
export const Toast = () => {
  const { error, loading, queued } = useFileReaderContext()
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
          <span>Cargando páginas</span>
          <span className="loader"></span>
        </div>
      </div>
    )
  }
  return null
}
