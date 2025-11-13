import { Button, CloseButton, Drawer, Portal, Separator } from '@chakra-ui/react'
import { useState } from 'react'
import { MdSettings } from 'react-icons/md'
import { ColorModeButton } from '../ui/color-mode'
import Header from '../TextOutput/Header'
import { useVoiceContext } from '@/hooks/useCustomContext'
import { SelectFile } from '../TextOutput/SelectFile'

export const Settings = () => {
  const [open, setOpen] = useState(false)
  const {
    state: { speaking }
  } = useVoiceContext()
  const isSpeaking = speaking || window.speechSynthesis.speaking

  return (
    <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Drawer.Trigger asChild>
        <Button title="Opciones" variant={'subtle'} disabled={isSpeaking}>
          <MdSettings />
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Opciones</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <SelectFile />
              <Header />
            </Drawer.Body>
            <Separator my={2} />
            <Drawer.Footer>
              <ColorModeButton variant={'subtle'} />
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
