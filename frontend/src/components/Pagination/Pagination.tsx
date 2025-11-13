import { useEffect, useRef } from 'react'
import { useLocalDataContext, useVoiceContext } from '@/hooks/useCustomContext'
import { IconButton, HStack, ScrollArea } from '@chakra-ui/react'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

export const PaginationPages = () => {
  const {
    dispatch: dispatchLocalData,
    state: { textPages, currentPage }
  } = useLocalDataContext()
  const {
    dispatch,
    state: { speaking }
  } = useVoiceContext()
  const isSpeaking = speaking || window.speechSynthesis.speaking

  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSetPage = (page: number) => {
    if (isSpeaking) return
    dispatchLocalData({ type: 'SET_PAGE', payload: { currentPage: page } })
    dispatch({ type: 'SET_READ_WORD', payload: null })
  }

  // Auto-scroll al cambiar de página
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const active = container.querySelector<HTMLButtonElement>(`[data-page="${currentPage}"]`)
    if (active) {
      const offsetLeft = active.offsetLeft - container.clientWidth / 2 + active.clientWidth / 2
      container.scrollTo({
        left: offsetLeft,
        behavior: 'smooth'
      })
    }
  }, [currentPage])

  if (textPages.length === 0) return null

  return (
    <HStack gap={2} align="center" justify="center" width="100%">
      <IconButton
        aria-label="Página anterior"
        size="sm"
        variant="ghost"
        onClick={() => handleSetPage(Math.max(currentPage - 1, 0))}
        disabled={isSpeaking || currentPage === 0}
      >
        <MdChevronLeft />
      </IconButton>

      <ScrollArea.Root
        variant={'hover'}
        maxW={{
          base: '60dvw',
          md: 'xl'
        }}
        size="xs"
      >
        <ScrollArea.Viewport ref={scrollRef} mb={2}>
          <ScrollArea.Content>
            <HStack gap={2} py={1}>
              {textPages.map((page, index) => (
                <IconButton
                  key={index}
                  data-page={index}
                  onClick={() => handleSetPage(index)}
                  aria-label={`Página ${index + 1}`}
                  title={`Página ${index + 1}`}
                  size="sm"
                  flexShrink={0}
                  variant={currentPage === index ? 'solid' : 'ghost'}
                  colorScheme={currentPage === index ? 'blue' : 'gray'}
                  disabled={isSpeaking}
                >
                  {page.page}
                </IconButton>
              ))}
            </HStack>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" />
        <ScrollArea.Corner />
      </ScrollArea.Root>

      <IconButton
        aria-label="Página siguiente"
        size="sm"
        variant="ghost"
        onClick={() => handleSetPage(Math.min(currentPage + 1, textPages.length - 1))}
        disabled={isSpeaking || currentPage === textPages.length - 1}
      >
        <MdChevronRight />
      </IconButton>
    </HStack>
  )
}
