import { useVoiceContext } from '@/hooks/useCustomContext'
import { useUtterance } from '@/hooks/useUtterance'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { MdPause, MdPlayArrow, MdStop } from 'react-icons/md'

export const Controls = () => {
  const { play, stop } = useUtterance()
  const {
    state: { speaking }
  } = useVoiceContext()
  const isSpeaking = speaking || window.speechSynthesis.speaking
  return (
    <ButtonGroup>
      <Button
        title={speaking ? 'Pausar' : 'Reproducir'}
        type="button"
        onClick={play}
        colorPalette={speaking ? 'teal' : 'green'}
      >
        {speaking ? <MdPause /> : <MdPlayArrow />}
      </Button>
      <Button disabled={!isSpeaking} title={'Detener'} type="button" onClick={stop}>
        <MdStop />
      </Button>
    </ButtonGroup>
  )
}
