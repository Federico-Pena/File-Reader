import { speechSynthesisInWindow } from '../../utils/compatibilityNavigator'

const Compatibility = () => {
  const navegador = speechSynthesisInWindow()
  if (navegador === 'PC Firefox') {
    return (
      <h1>
        Para una mejor experiencia, te recomendamos usar{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.microsoft.com/es-es/edge/download"
        >
          Microsoft Edge
        </a>{' '}
        o{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.google.com/intl/es_es/chrome"
        >
          Google Chrome
        </a>
      </h1>
    )
  }
  if (navegador === 'Android no Edge') {
    return (
      <h1>
        Para una mejor experiencia, te recomendamos usar{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://play.google.com/store/apps/details?id=com.microsoft.emmx"
        >
          Microsoft Edge
        </a>
      </h1>
    )
  }
  if (navegador === 'No speech recognition') {
    return (
      <h1>
        Tu navegador no es compatible con la API de Web Speech. Te recomendamos usar{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.microsoft.com/es-es/edge/download"
        >
          Microsoft Edge
        </a>{' '}
        o{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.google.com/intl/es_es/chrome"
        >
          Google Chrome
        </a>
      </h1>
    )
  }
  if (navegador === true) {
    return null
  }
}
export default Compatibility
