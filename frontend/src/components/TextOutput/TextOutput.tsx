import { useLocalDataContext, useVoiceContext } from '@/hooks/useCustomContext'
import { RenderBlock } from '@/textParser/RenderBlock'
import { Box, Center, Heading, Separator, Stack, Text } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'

const TextOutput = () => {
  const {
    state: { textPages, currentPage }
  } = useLocalDataContext()

  const {
    dispatch,
    state: { readWords, speaking }
  } = useVoiceContext()

  const refWordHighlighted = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    if (refWordHighlighted.current) {
      refWordHighlighted.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [readWords])

  const handleOnClickWord = (word: string, index: number) => {
    if (speaking || window.speechSynthesis.speaking) return
    dispatch({ type: 'SET_READ_WORD', payload: { word, index } })
  }

  let globalIndex = 0

  const createSpan = (word: string) => {
    if (!word) return ' '
    const currentIndex = globalIndex++
    const isRead = readWords && readWords.index >= currentIndex
    return (
      <Text
        as={'span'}
        fontFamily={'inherit'}
        data-index={currentIndex}
        key={currentIndex}
        color={isRead ? 'green.500' : ''}
        onClick={() => handleOnClickWord(word, currentIndex)}
        ref={isRead ? refWordHighlighted : null}
        cursor={'pointer'}
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
    <Box as={'article'} px={4} pt={4} pb={32} minH={'100dvh'} bg={'bg.muted'}>
      <Text my={2} justifySelf={'end'} as={'p'} fontSize={'xs'} color={'GrayText'}>
        Página {currentPage + 1} de {textPages.length}
      </Text>
      <Separator mb={4} />
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
        {textPages[currentPage]?.withLineBreaks.map((block, i) =>
          RenderBlock(block, i, createSpan)
        )}
      </Stack>
    </Box>
  )
}

export default TextOutput
