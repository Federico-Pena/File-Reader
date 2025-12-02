import { UseVoiceContext } from '@/context/VoiceContext'
import { Box, HStack, Slider, SliderValueChangeDetails } from '@chakra-ui/react'

export const VolumeAndRate = () => {
  const {
    dispatch,
    state: { rateUtterance, volume, speaking }
  } = UseVoiceContext()

  const handleVolumeChange = (volume: number) => {
    dispatch({
      type: 'SET_VOLUME',
      payload: {
        volume
      }
    })
  }

  const handleRateChange = (rateUtterance: number) => {
    dispatch({
      type: 'SET_RATE_UTTERANCE',
      payload: {
        rateUtterance
      }
    })
  }

  return (
    <Box>
      <SliderCustom onChange={handleVolumeChange} label="Volumen" value={volume} disabled={speaking} />
      <SliderCustom
        onChange={handleRateChange}
        label="Velocidad"
        value={rateUtterance}
        max={2}
        step={0.1}
        disabled={speaking}
      />
    </Box>
  )
}

const SliderCustom = ({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  step = 1,
  disabled
}: {
  value: number
  onChange: (value: number) => void
  label: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}) => {
  const handleValueChange = (details: SliderValueChangeDetails) => {
    onChange(details.value[0])
  }

  return (
    <Slider.Root value={[value]} onValueChange={handleValueChange} min={min} max={max} step={step} disabled={disabled}>
      <HStack justify="space-between">
        <Slider.Label>{label}</Slider.Label>
        <Slider.ValueText />
      </HStack>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
  )
}
