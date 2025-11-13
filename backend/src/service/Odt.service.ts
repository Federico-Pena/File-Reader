import fs from 'node:fs/promises'
import JSZip from 'jszip'

export class OdtService {
  constructor(private filePath: string) {}

  async getTotalPages(): Promise<number> {
    return 1
  }

  async extractPageText(_pageNumber: number): Promise<string> {
    const buffer = await fs.readFile(this.filePath)
    const zip = await JSZip.loadAsync(buffer)
    const xml = await zip.file('content.xml')?.async('string')
    if (!xml) return ''
    return xml.replace(/<[^>]+>/g, ' ') // naive clean XML tags
  }
}
