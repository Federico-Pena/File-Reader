import { Badge, Em, Link, Text, Code } from '@chakra-ui/react'
import { InlineToken } from '@shared/types/types'
import React from 'react'

export const RenderInline = (
  tokens: InlineToken[],
  createSpan: (word: string) => React.JSX.Element | ' '
) => {
  return tokens.map((token, index) => {
    const content = token.text.split(/\s+/g).map(createSpan)
    switch (token.type) {
      case 'link':
        return (
          <Link href={token.href} target="_blank" rel="noreferrer" key={`link-${index}`}>
            {content}
          </Link>
        )

      case 'email':
        return (
          <Link href={`mailto:${token.email}`} key={`email-${index}`}>
            {content}
          </Link>
        )

      case 'quote':
        return <Em key={`quote-${index}`}>{content}</Em>

      case 'emphasis':
        return <Em key={`emphasis-${index}`}>{content}</Em>

      case 'strong':
        return (
          <Text as={'span'} fontWeight="bold" key={`strong-${index}`}>
            {content}
          </Text>
        )

      case 'code':
        return (
          <Code key={`code-${index}`} fontSize="inherit">
            {content}
          </Code>
        )

      case 'math':
        return (
          <Text as={'span'} fontFamily="monospace" fontStyle="italic" key={`math-${index}`}>
            {content}
          </Text>
        )

      case 'citation':
        return (
          <Text as={'span'} key={`citation-${index}`}>
            {content}
            <Text as={'sup'} fontSize="xs" color="blue.500">
              [{token.ref}]
            </Text>
          </Text>
        )

      case 'footnote':
        return (
          <Text as={'span'} key={`footnote-${index}`}>
            {content}
            <Text as={'sup'} fontSize="xs" color="gray.500">
              {token.ref}
            </Text>
          </Text>
        )

      case 'date':
        return (
          <Badge colorScheme="blue" variant="subtle" key={`date-${index}`}>
            {content}
          </Badge>
        )

      case 'number':
        return (
          <Text
            as={'span'}
            fontWeight="semibold"
            fontVariantNumeric="tabular-nums"
            key={`number-${index}`}
          >
            {content}
          </Text>
        )

      case 'currency':
        return (
          <Text as={'span'} fontWeight="semibold" color="green.600" key={`currency-${index}`}>
            {content}
          </Text>
        )
      default:
        return content
    }
  })
}
