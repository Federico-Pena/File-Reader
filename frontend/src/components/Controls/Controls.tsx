import { UseVoiceContext } from '@/context/VoiceContext'
import { useUtterance } from '@/hooks/useUtterance'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { MdPause, MdPlayArrow, MdStop } from 'react-icons/md'

export const Controls = () => {
  const { stop, togglePlayPause } = useUtterance()
  const {
    state: { speaking }
  } = UseVoiceContext()
  const isSpeaking = speaking || window.speechSynthesis.speaking
  return (
    <ButtonGroup>
      <Button
        title={speaking ? 'Pausar' : 'Reproducir'}
        type="button"
        onClick={togglePlayPause}
        colorPalette={isSpeaking ? 'teal' : 'green'}
      >
        {speaking ? <MdPause /> : <MdPlayArrow />}
      </Button>
      <Button colorPalette="red" disabled={!isSpeaking} title={'Detener'} type="button" onClick={stop}>
        <MdStop />
      </Button>
    </ButtonGroup>
  )
}
