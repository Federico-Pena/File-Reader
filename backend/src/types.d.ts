type Data = {
  text: string
  page: number
}
type RichBlock =
  | { type: 'title' | 'subtitle'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'blockquote'; content: string }
  | { type: 'list'; content: string }
