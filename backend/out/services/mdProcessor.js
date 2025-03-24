import MarkdownIt from "markdown-it";
import { normalizeText } from "./normalizeText.js";
import { CHUNK_SIZE, splitText } from "./switchServices.js";
const mdProcessor = async (mdBuffer, sendPage) => {
  try {
    const markdown = mdBuffer.toString("utf-8");
    const md = new MarkdownIt();
    const text = md.render(markdown).replace(/<\/?[^>]+(>|$)/g, "");
    if (text.trim().length === 0) {
      throw new Error("El archivo MD est\xE1 vac\xEDo o no se pudo extraer el texto.");
    }
    const pages = splitText(text, CHUNK_SIZE);
    const data = pages.map((page, i) => ({ text: page, page: i }));
    sendPage(data);
  } catch (error) {
    throw new Error("Error procesando el archivo MD.");
  }
};
export {
  mdProcessor
};
