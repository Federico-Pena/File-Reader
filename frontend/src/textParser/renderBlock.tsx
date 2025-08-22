import { JSX } from 'react'
import { tokenizeInline } from './tokenizeInline'
import { renderInline } from './renderInline'

export const renderBlock = (
  block: RichBlock,
  i: number,
  createSpan: (word: string) => JSX.Element
) => {
  const inlineTokens = tokenizeInline(block.content)
  const content = renderInline(inlineTokens, createSpan)

  switch (block.type) {
    case 'title':
      return (
        <p className="paragraph" key={i}>
          {content}
        </p>
        /* <h1 className="title" key={i}>
          {content}
        </h1> */
      )
    case 'subtitle':
      return (
        <h4 className="subtitle" key={i}>
          {content}
        </h4>
      )
    case 'paragraph':
      return (
        <p className="paragraph" key={i}>
          {content}
        </p>
      )
    case 'blockquote':
      return (
        <blockquote className="blockquote" key={i}>
          {content}
        </blockquote>
      )
    case 'list':
      const start = block.content.match(/^([0-9]+)[.)]/)?.[1]
      return (
        <ol className="list" key={i} start={start ? Number(start) : 1}>
          <li>{content}</li>
        </ol>
      )
  }
}
