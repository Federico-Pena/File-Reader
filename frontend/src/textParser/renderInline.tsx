import { JSX } from 'react'
import { InlineToken } from './tokenizeInline'

export const renderInline = (
  tokens: InlineToken[],
  createSpan: (word: string) => JSX.Element
): JSX.Element[] => {
  return tokens.map((token, index) => {
    const content = token.text.map(createSpan)

    switch (token.type) {
      case 'link':
        return (
          <a
            href={token.href}
            target="_blank"
            rel="noreferrer"
            className="link"
            key={`link-${index}`}
          >
            {content}
          </a>
        )
      case 'quote':
        return (
          <em className="quote" key={`quote-${index}`}>
            {content}
          </em>
        )
      case 'text':
        return <span key={`text-${index}`}>{content}</span>
    }
  })
}
