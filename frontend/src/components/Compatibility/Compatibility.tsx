import { speechSynthesisInWindow } from '../../utils/compatibilityNavigator'

const Compatibility = () => {
  const userNavigator = speechSynthesisInWindow()
  if (userNavigator === 'No Edge') {
    return (
      <h1>
        Para una mejor experiencia, te recomendamos usar{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.microsoft.com/es-es/edge/download"
        >
          Microsoft Edge
        </a>
      </h1>
    )
  }
  if (userNavigator === 'No speech recognition') {
    return (
      <h1>
        Tu navegador no es compatible con la API de Web Speech. Te recomendamos usar{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.microsoft.com/es-es/edge/download"
        >
          Microsoft Edge
        </a>
      </h1>
    )
  }
  if (userNavigator === true) {
    return null
  }
}
export default Compatibility
