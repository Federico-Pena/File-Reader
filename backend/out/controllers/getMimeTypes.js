import { apiConfig } from "../config/apiConfig.js";
const getMimeTypes = async (req, res) => {
  try {
    const clientMimeTypes = Object.values(apiConfig.ACCEPTED_MIME_TYPES).map((type) => type.client);
    res.status(200).json({
      data: clientMimeTypes
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error"
    });
  }
};
var getMimeTypes_default = getMimeTypes;
export {
  getMimeTypes_default as default
};
