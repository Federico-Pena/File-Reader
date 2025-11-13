export interface RichBlock {
  type: 'title' | 'subtitle' | 'paragraph' | 'list' | 'blockquote'
  inlineTokens: InlineToken[]
}
export type InlineToken =
  | { type: 'text'; text: string }
  | { type: 'link'; href: string; text: string }
  | { type: 'email'; email: string; text: string }
  | { type: 'quote'; text: string }
  | { type: 'emphasis'; text: string }
  | { type: 'strong'; text: string }
  | { type: 'code'; text: string }
  | { type: 'math'; text: string }
  | { type: 'citation'; ref: string; text: string }
  | { type: 'footnote'; ref: string; text: string }
  | { type: 'date'; text: string }
  | { type: 'number'; text: string }
  | { type: 'currency'; text: string }
  | {
      type: 'list'
      text: string
      listType: 'bullet' | 'numbered' | 'lettered' | 'roman' | 'indexLine'
      listIndicator: string
    }

export type ListType = 'bullet' | 'numbered' | 'lettered' | 'roman' | 'indexLine'
