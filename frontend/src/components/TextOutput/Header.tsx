import { useVoiceContext } from '@/hooks/useCustomContext'
import { Portal, Select, createListCollection, Box } from '@chakra-ui/react'

const Header = () => {
  const {
    dispatch,
    state: { rateUtterance, volume, voices, speaking, selectedVoice }
  } = useVoiceContext()

  const isSpeaking = speaking || window.speechSynthesis.speaking

  const handleVoiceChange = (value: { label: string; value: string }) => {
    if (isSpeaking) return
    if (value.value.trim() === '') return
    const voiceName = value.value
    const voice = voices.find((voice) => voice.voiceURI === voiceName)
    if (!voice) return
    dispatch({
      type: 'SET_VOICE_NAME',
      payload: {
        voice: voice.name ?? selectedVoice
      }
    })
  }

  const handleVolumeChange = (volume: number) => {
    if (isSpeaking) return
    dispatch({
      type: 'SET_VOLUME',
      payload: {
        volume
      }
    })
  }

  const handleRateChange = (rateUtterance: number) => {
    if (isSpeaking) return
    dispatch({
      type: 'SET_RATE_UTTERANCE',
      payload: {
        rateUtterance
      }
    })
  }

  const collection = createListCollection({
    items: voices.map((voice) => ({ label: voice.voiceURI, value: voice.voiceURI }))
  })
  return (
    <Box as={'header'} aria-label="Voice header" w={'full'}>
      <Select.Root
        disabled={isSpeaking}
        collection={collection}
        onValueChange={(e) => handleVoiceChange(e.items[0])}
        value={[selectedVoice]}
      >
        <Select.HiddenSelect />
        <Select.Label>Selecciona una voz</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Selecciona una voz" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content zIndex={9999}>
              {collection.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      <div className="volume-rate-container">
        <div>
          <label htmlFor="volumeRate">Volumen: {volume}</label>
          <input
            disabled={isSpeaking}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            type="range"
            min="0"
            max="1"
            step="0.1"
            id="volumeRate"
            name="volumeRate"
            value={volume}
          />
        </div>
        <div>
          <label htmlFor="rate">Rate: {rateUtterance}</label>
          <input
            disabled={isSpeaking}
            onChange={(e) => handleRateChange(Number(e.target.value))}
            type="range"
            min="0"
            max="2"
            step="0.1"
            id="rate"
            name="rate"
            value={rateUtterance}
          />
        </div>
      </div>
    </Box>
  )
}
export default Header
