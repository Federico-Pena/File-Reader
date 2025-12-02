import { UseFileDataContext } from '@/context/FileDataContext'
import { UseVoiceContext } from '@/context/VoiceContext'
import { RenderBlock } from '@/components/TextOutput/RenderBlock'
import { Box, Center, Flex, Heading, Separator, Stack, Text } from '@chakra-ui/react'

const TextOutput = () => {
  const {
    dispatch,
    state: { currentWord, textPages, currentPage, nameFile }
  } = UseFileDataContext()

  const {
    state: { speaking }
  } = UseVoiceContext()

  const handleOnClickWord = (word: string, index: number) => {
    if (speaking || window.speechSynthesis.speaking) return
    dispatch({ type: 'SET_CURRENT_WORD', payload: { word, index } })
  }

  let globalIndex = 0

  const createSpan = (word: string) => {
    if (!word) return ' '
    const currentIndex = globalIndex++
    const isRead = currentWord && currentWord.index >= currentIndex
    return (
      <Text
        as={'span'}
        fontFamily={'inherit'}
        key={currentIndex}
        color={isRead ? 'green.500' : ''}
        onClick={() => handleOnClickWord(word, currentIndex)}
        cursor={speaking || window.speechSynthesis.speaking ? 'disabled' : 'pointer'}
        _hover={{ textDecoration: 'underline' }}
      >
        {word}{' '}
      </Text>
    )
  }

  return textPages.length === 0 ? (
    <Center as={'article'} minH={'100dvh'}>
      <Heading as={'h2'} size={'2xl'}>
        Comienza cargando el archivo
      </Heading>
    </Center>
  ) : (
    <Box as={'article'} px={4} pt={4} pb={32} minH={'100dvh'}>
      <Flex gap={4} justifyContent={'space-between'}>
        <Text fontSize={'xs'} color={'GrayText'}>
          {nameFile}
        </Text>
        <Text fontSize={'xs'} color={'GrayText'}>
          Página {currentPage + 1} de {textPages.length}
        </Text>
      </Flex>
      <Separator my={4} />
      {/* <pre
        style={{
          whiteSpace: 'pre-wrap'
        }}
      >
        {textPages[currentPage]?.withLineBreaks
          .map((block) => block.content)
          .join('\n\n')}
      </pre> */}
      <Stack gap={8} maxW={'breakpoint-lg'} mx={'auto'} bg={'bg.subtle'} p={4} borderRadius={'md'}>
        {textPages[currentPage].forRender.map((block, i) => RenderBlock(block, i, createSpan))}
      </Stack>
    </Box>
  )
}

export default TextOutput
