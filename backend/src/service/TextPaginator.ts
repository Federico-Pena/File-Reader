export class TextPaginator {
  private pages: string[] = []

  constructor(private text: string, private maxChars = 2000) {
    this.paginate()
  }

  private paginate() {
    let buffer = ''
    const sentences = this.text.split(/(?<=[.!?])\s+/)

    for (const sentence of sentences) {
      if ((buffer + sentence).length > this.maxChars) {
        this.pages.push(buffer.trim())
        buffer = ''
      }
      buffer += sentence + ' '
    }

    if (buffer.trim().length > 0) {
      this.pages.push(buffer.trim())
    }
  }

  getPage(pageNumber: number): string {
    return this.pages[pageNumber - 1] || ''
  }

  getTotalPages(): number {
    return this.pages.length
  }
}
