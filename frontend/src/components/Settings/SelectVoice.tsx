import { UseVoiceContext } from '@/context/VoiceContext'
import { createListCollection, Portal, Select } from '@chakra-ui/react'

export const SelectVoice = () => {
  const {
    dispatch,
    state: { voices, speaking, selectedVoice }
  } = UseVoiceContext()

  const isSpeaking = speaking || window.speechSynthesis.speaking

  const handleVoiceChange = (value: { label: string; value: string }) => {
    if (isSpeaking) return
    if (value.value.trim() === '') return
    const voiceName = value.value
    const voice = voices.find((voice) => voice.voiceURI === voiceName)
    if (!voice) return
    dispatch({
      type: 'SET_CURRENT_VOICE',
      payload: {
        voice: voice ?? selectedVoice
      }
    })
  }

  const collection = createListCollection({
    items: voices.map((voice) => ({ label: voice.voiceURI, value: voice.voiceURI }))
  })
  return (
    <Select.Root
      disabled={isSpeaking}
      collection={collection}
      onValueChange={(e) => handleVoiceChange(e.items[0])}
      value={[selectedVoice?.name ?? 'No hay voces disponibles']}
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
  )
}
