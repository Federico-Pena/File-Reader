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
      const first = block.inlineTokens.find((t) => t.type === 'list')

      const listType = first?.listType ?? 'bullet'

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
            const token = block.inlineTokens[i]

            const indicator = token?.type === 'list' ? token.listIndicator : ''
            const padding =
              token?.type === 'list' ? (token.listIndicator.length < 20 ? token.listIndicator.length : 0) : 0

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
