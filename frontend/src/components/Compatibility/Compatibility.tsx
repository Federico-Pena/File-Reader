import { Heading, Link } from '@chakra-ui/react'
import { speechCompatibilityCheck, getDeviceType } from '../../utils/compatibilityNavigator'

const Compatibility = () => {
  const { hasSpeechAPI, isEdge } = speechCompatibilityCheck()
  const { isAndroid, isIOS } = getDeviceType()

  // Si es Edge y tiene la API, no mostrar nada
  if (isEdge && hasSpeechAPI) {
    return null
  }

  // Determinar la URL de descarga según el dispositivo
  const getDownloadUrl = () => {
    if (isAndroid) {
      return 'https://play.google.com/store/apps/details?id=com.microsoft.edgemobile'
    } else if (isIOS) {
      return 'https://apps.apple.com/app/microsoft-edge/id1288723196'
    } else {
      return 'https://www.microsoft.com/es-es/edge/download'
    }
  }

  // Mensaje según el caso
  const getMessage = () => {
    if (!hasSpeechAPI) {
      return 'Tu navegador no es compatible con la API de Web Speech.'
    } else if (!isEdge) {
      return 'Para una mejor experiencia con las funciones de voz,'
    }
    return 'Para una mejor experiencia,'
  }

  return (
    <Heading
      as={'h2'}
      pos={'sticky'}
      top={0}
      left={0}
      bg={'bg.muted'}
      p={3}
      w={'fit-content'}
      rounded={'md'}
    >
      {getMessage()} te recomendamos usar{' '}
      <Link
        color={'blue.500'}
        textDecor={'underline'}
        target="_blank"
        rel="noopener noreferrer"
        href={getDownloadUrl()}
      >
        Microsoft Edge
      </Link>
      {isAndroid && ' desde Google Play'}
      {isIOS && ' desde App Store'}
    </Heading>
  )
}

export default Compatibility
