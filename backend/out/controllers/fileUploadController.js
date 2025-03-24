import { switchServices } from "../services/switchServices.js";
import { apiConfig } from "../config/apiConfig.js";
const fileUploadController = async (req, res) => {
  var _a, _b;
  try {
    if (!req.file || !((_a = req.file) == null ? void 0 : _a.buffer)) {
      res.status(400).json({ error: "Can't find file" });
      return;
    }
    const fileExt = ((_b = req.file.originalname.split(".").pop()) == null ? void 0 : _b.toLowerCase()) || "";
    const mimeTypes = Object.values(apiConfig.ACCEPTED_MIME_TYPES).map((type) => type.client);
    if (!mimeTypes.includes(fileExt)) {
      const clientMimeTypes = mimeTypes.map((type) => `"${type}"`).join(", ");
      const msg = `Formats allowed are: ${clientMimeTypes}.`;
      res.status(400).json({ error: msg });
      return;
    }
    const sendPage = async (data) => {
      res.status(200).json({ data });
    };
    await switchServices(fileExt, req.file.buffer, sendPage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var fileUploadController_default = fileUploadController;
export {
  fileUploadController_default as default
};
