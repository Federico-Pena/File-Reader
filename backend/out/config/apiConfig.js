const API_URL = process.env.NODE_ENV === "development" ? `http://localhost:${process.env.PORT ?? 1234}` : "/";
const ACCEPTED_MIME_TYPES = {
  pdf: {
    server: "application/pdf",
    client: "pdf"
  },
  docx: {
    server: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    client: "docx"
  },
  txt: {
    server: "text/plain",
    client: "txt"
  },
  md: {
    server: ".md",
    client: "md"
  }
};
const CORS_SETTINGS = {
  origin: [API_URL, "http://localhost:5173"],
  // Allow specific origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Control-Allow-Credentials"]
  // credentials: true,
  // optionsSuccessStatus: 200,
  // maxAge: 3600
  // preflightContinue: true,
};
const API_ROUTES = {
  uploadFile: {
    uploadFile: "/api/v1/upload-file",
    getMimeTypes: "/api/v1/get-mime-types"
  }
};
const apiConfig = {
  API_URL,
  PORT: process.env.PORT ?? 1234,
  API_ROUTES,
  CORS_SETTINGS,
  ACCEPTED_MIME_TYPES
};
export {
  apiConfig
};
