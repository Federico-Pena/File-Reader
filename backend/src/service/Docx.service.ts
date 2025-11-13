import fs from 'node:fs/promises'
import mammoth from 'mammoth'
import { TextPaginator } from './TextPaginator'

export class DocxService {
  private paginator: TextPaginator | null = null

  constructor(private filePath: string) {}

  async getTotalPages(): Promise<number> {
    await this.ensurePaginator()
    return this.paginator!.getTotalPages()
  }

  private async ensurePaginator() {
    if (!this.paginator) {
      const buffer = await fs.readFile(this.filePath)
      const { value } = await mammoth.extractRawText({ buffer })
      this.paginator = new TextPaginator(value, 2000) // 2000 chars por página
    }
  }
  async extractPageText(pageNumber: number): Promise<string> {
    await this.ensurePaginator()
    return this.paginator!.getPage(pageNumber)
  }
}
