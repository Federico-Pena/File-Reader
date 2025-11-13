const userAgentDetect = (userAgent: string) => {
  userAgent = userAgent.toLowerCase()

  if (/chrome|crios|crmo/.test(userAgent) && !/edg|opera|opr/.test(userAgent)) {
    return 'Google Chrome'
  } else if (/firefox|fxios/.test(userAgent)) {
    return 'Mozilla Firefox'
  } else if (/safari/.test(userAgent) && !/chrome|crios/.test(userAgent)) {
    return 'Safari'
  } else if (/edg/.test(userAgent)) {
    return 'Microsoft Edge'
  } else if (/opr|opera/.test(userAgent)) {
    return 'Opera'
  } else if (/msie|trident/.test(userAgent)) {
    return 'Internet Explorer'
  } else if (/android/.test(userAgent)) {
    return 'Navegador Android'
  } else if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'Navegador en iOS'
  } else {
    return 'Navegador desconocido'
  }
}

const speechCompatibilityCheck = () => {
  const userNavigator = userAgentDetect(navigator.userAgent)
  const hasSpeechAPI = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window

  return {
    browser: userNavigator,
    hasSpeechAPI,
    isEdge: userNavigator === 'Microsoft Edge'
  }
}

const getDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)
  const isAndroid = /android/.test(userAgent)
  const isIOS = /iphone|ipad|ipod/.test(userAgent)

  return {
    isMobile,
    isAndroid,
    isIOS,
    isDesktop: !isMobile
  }
}

export { userAgentDetect, speechCompatibilityCheck, getDeviceType }
