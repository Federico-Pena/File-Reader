import { normalizeText } from "./normalizeText.js";
import { CHUNK_SIZE, splitText } from "./switchServices.js";
const txtProcessor = async (txtBuffer, sendPage) => {
  try {
    const text = txtBuffer.toString("utf-8").trim();
    if (text.length === 0) {
      throw new Error("El archivo TXT est\xE1 vac\xEDo o no se pudo extraer el texto.");
    }
    const pages = splitText(text, CHUNK_SIZE);
    const data = pages.map((page, i) => ({ text: page, page: i }));
    sendPage(data);
  } catch (error) {
    throw new Error("Error procesando el archivo TXT.");
  }
};
export {
  txtProcessor
};
