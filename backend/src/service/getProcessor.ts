import { PdfService } from './Pdf.service.js'
import { DocxService } from './Docx.service.js'
import { TxtService } from './Txt.service.js'
import { MdService } from './Md.service.js'
import { OdtService } from './Odt.service.js'

export const getProcessor = (filePath: string, ext: string, mimetype: string) => {
  switch (ext) {
    case 'pdf':
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'tiff':
      return new PdfService(filePath)
    case 'docx':
      return new DocxService(filePath)
    case 'txt':
      return new TxtService(filePath)
    case 'md':
      return new MdService(filePath)
    case 'odt':
      return new OdtService(filePath)

    default:
      throw new Error(`Unsupported file type: ${ext} (${mimetype})`)
  }
}
