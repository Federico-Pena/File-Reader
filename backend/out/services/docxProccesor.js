import mammoth from "mammoth";
import { CHUNK_SIZE, splitText } from "./switchServices.js";
const docxProcessor = async (docxBuffer, sendPage) => {
  try {
    const { value: text } = await mammoth.extractRawText({ buffer: docxBuffer });
    if (text.trim().length === 0) {
      throw new Error("El archivo DOCX est\xE1 vac\xEDo o no se pudo extraer el texto.");
    }
    const pages = splitText(text, CHUNK_SIZE);
    const data = pages.map((page, i) => ({ text: page, page: i }));
    sendPage(data);
  } catch (error) {
    console.error("Error procesando DOCX:", error.message);
    throw new Error("Error procesando el archivo DOCX.");
  }
};
export {
  docxProcessor
};
