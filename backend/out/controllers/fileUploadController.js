import { apiConfig } from "../config/apiConfig.js";
import { extractTextWithPython } from "../services/extractTextWithPython.js";
import { parseTextToRichBlocks } from "../utils/normalizeText.js";
const fileUploadController = async (req, res) => {
  var _a, _b;
  try {
    if (!req.file || !((_a = req.file) == null ? void 0 : _a.buffer)) {
      res.status(400).json({ error: "Can't find file" });
      return;
    }
    const fileExt = ((_b = req.file.originalname.split(".").pop()) == null ? void 0 : _b.toLowerCase()) || "";
    const mimeTypes = apiConfig.ACCEPTED_MIME_TYPES;
    if (!mimeTypes.includes(fileExt)) {
      const clientMimeTypes = mimeTypes.map((type) => `"${type}"`).join(", ");
      const msg = `Formats allowed are: ${clientMimeTypes}.`;
      res.status(400).json({ error: msg });
      return;
    }
    const pages = await extractTextWithPython(req.file.buffer, fileExt);
    const pagesWithRichText = pages.map((page) => {
      const { withLineBreaks, cleaned } = parseTextToRichBlocks(page.text);
      return {
        ...page,
        withLineBreaks,
        cleaned
      };
    });
    res.status(200).json({ data: pagesWithRichText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var fileUploadController_default = fileUploadController;
export {
  fileUploadController_default as default
};
