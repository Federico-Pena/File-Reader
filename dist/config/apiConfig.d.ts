export declare const apiConfig: {
    API_URL: string;
    PORT: string | number;
    API_ROUTES: {
        uploadFile: {
            uploadFile: string;
            getMimeTypes: string;
        };
    };
    CORS_SETTINGS: {
        origin: string[];
        methods: string[];
        allowedHeaders: string[];
    };
    ACCEPTED_MIME_TYPES: {
        pdf: {
            server: string;
            client: string;
        };
        docx: {
            server: string;
            client: string;
        };
        txt: {
            server: string;
            client: string;
        };
        md: {
            server: string;
            client: string;
        };
    };
};
