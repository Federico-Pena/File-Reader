import fs from 'node:fs/promises'
import { TextPaginator } from './TextPaginator'

export class TxtService implements IFileProcessor {
  private paginator: TextPaginator | null = null

  constructor(private filePath: string) {}

  private async ensurePaginator() {
    if (!this.paginator) {
      const content = await fs.readFile(this.filePath, 'utf8')
      this.paginator = new TextPaginator(content, 2000) // 2000 chars por página
    }
  }

  async getTotalPages(): Promise<number> {
    await this.ensurePaginator()
    return this.paginator!.getTotalPages()
  }

  async extractPageText(pageNumber: number): Promise<string> {
    await this.ensurePaginator()
    return this.paginator!.getPage(pageNumber)
  }
}
