import { Blockquote, Heading, List, ListIndicator, Text } from '@chakra-ui/react'
import { RenderInline } from './RenderInline'

export const RenderBlock = (
  block: RichBlock,
  indexBlock: number,
  createSpan: (word: string) => React.JSX.Element | ' '
) => {
  const tokens = block.inlineTokens ?? []
  const content = RenderInline(tokens, createSpan)

  switch (block.type) {
    case 'title': {
      return (
        <Heading className={block.type} as="h1" size="xl" key={indexBlock}>
          {content}
        </Heading>
      )
    }
    case 'subtitle': {
      return (
        <Heading className={block.type} as="h3" size="lg" key={indexBlock}>
          {content}
        </Heading>
      )
    }

    case 'paragraph': {
      return (
        <Text className={block.type} as="p" lineHeight="1.6" key={indexBlock}>
          {content}
        </Text>
      )
    }

    case 'blockquote': {
      return (
        <Blockquote.Root className={block.type} key={indexBlock}>
          <Blockquote.Icon />
          <Blockquote.Content fontSize="md" fontStyle="italic">
            {content}
          </Blockquote.Content>
        </Blockquote.Root>
      )
    }

    case 'list': {
      const listType = block.inlineTokens[0]?.listType ?? 'bullet'

      const listStyle =
        listType === 'numbered'
          ? 'decimal'
          : listType === 'lettered'
          ? 'lower-alpha'
          : listType === 'roman'
          ? 'lower-roman'
          : 'disc'
      return (
        <List.Root
          className={block.type}
          as={listType === 'bullet' ? 'ul' : 'ol'}
          key={indexBlock}
          listStyle={`${listStyle} inside`}
          gap={2}
        >
          {content.map((span, i) => {
            const indicator = block.inlineTokens[i] ? block.inlineTokens[i].listIndicator : ''
            const padding = indicator?.length < 20 ? indicator?.length : 0

            return (
              <List.Item listStyle="none" key={`${indexBlock}-${i}`} ps={padding}>
                {indicator && <ListIndicator color="GrayText">{indicator}</ListIndicator>}
                {span}
              </List.Item>
            )
          })}
        </List.Root>
      )
    }
    default: {
      return (
        <Text as="p" key={indexBlock}>
          {content}
        </Text>
      )
    }
  }
}
