import fs from 'node:fs/promises'
import { remark } from 'remark'
import strip from 'strip-markdown'
import { TextPaginator } from './TextPaginator'

export class MdService {
  private paginator: TextPaginator | null = null

  constructor(private filePath: string) {}

  private async ensurePaginator() {
    if (!this.paginator) {
      const content = await fs.readFile(this.filePath, 'utf8')
      const processed = await remark().use(strip).process(content)
      this.paginator = new TextPaginator(String(processed), 2000) // 2000 chars por página
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
