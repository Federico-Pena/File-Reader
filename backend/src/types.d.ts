type Data = {
  text: string
  page: number
}
type RichBlock =
  | { type: 'title' | 'subtitle'; content: RichInline[] }
  | { type: 'paragraph'; content: RichInline[] }
  | { type: 'list'; ordered: boolean; depth: number; items: RichInline[][] }
  | { type: 'blockquote'; content: RichInline[] }

type RichInline =
  | { type: 'text'; text: string }
  | { type: 'link'; url: string; text: string }
  | { type: 'email'; text: string }
  | { type: 'quote'; text: string }
