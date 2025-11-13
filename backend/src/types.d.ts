type Data = {
  text: string
  page: number
}
interface IFileProcessor {
  getTotalPages(): Promise<number>
  extractPageText(pageNumber: number): Promise<string>
}
