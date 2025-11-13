import Compatibility from '@/components/Compatibility/Compatibility'
import { FormFile } from '@/components/FormFile/FormFile'
import TextOutput from '@/components/TextOutput/TextOutput'
import { Box, ButtonGroup, Separator, Stack } from '@chakra-ui/react'
import { ColorModeButton } from './components/ui/color-mode'
import { Toaster } from './components/ui/toaster'
import { speechCompatibilityCheck } from './utils/compatibilityNavigator'
import { Settings } from './components/Settings/Settings'
import { Controls } from './components/Controls/Controls'
import { PaginationPages } from './components/Pagination/Pagination'

function App() {
  const { hasSpeechAPI } = speechCompatibilityCheck()

  return !hasSpeechAPI ? (
    <Box
      as={'main'}
      minH={'100dvh'}
      data-state="open"
      _open={{
        animationName: 'slide-from-bottom-full, fade-in',
        animationDuration: '0.3s'
      }}
    >
      <Compatibility />
    </Box>
  ) : (
    <Box
      as={'main'}
      minH={'100dvh'}
      maxW={'100dvw'}
      data-state="open"
      _open={{
        animationName: 'slide-from-bottom-full, fade-in',
        animationDuration: '0.3s'
      }}
    >
      <Compatibility />
      <Toaster />
      <TextOutput />

      <Stack
        pos={'fixed'}
        bottom={0}
        left={'50%'}
        transform={'translateX(-50%)'}
        zIndex={1}
        bg={'bg'}
        px={4}
        py={2}
        w={'fit-content'}
        rounded={'md'}
      >
        <ButtonGroup justifyContent={'center'}>
          <FormFile />
          <Separator orientation="vertical" height={8} mx={2} />
          <Controls />
          <Separator orientation="vertical" height={8} mx={2} />
          <Settings />
        </ButtonGroup>
        <PaginationPages />
      </Stack>
    </Box>
  )
}
export default App
