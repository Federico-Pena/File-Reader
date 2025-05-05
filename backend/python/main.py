"""Extract text from a file."""

import sys
import json
from processors.docx_processor import docx_processor
from processors.txt_processor import txt_processor
from processors.md_processor import md_processor
from processors.pdf_processor import pdf_processor

if __name__ == "__main__":
    data = json.loads(sys.argv[1])
    file_path = data["filePath"]
    language = data["lang"]
    init_page = int(data["initPage"]) if data["initPage"] else 0
    end_page = int(data["endPage"]) if data["endPage"] else 0
    print(json.dumps(f"Processing file: {file_path}"), flush=True)

    with open(file_path, "rb") as f:
        file_bytes = f.read()
        file_ext = file_path.split(".")[-1]
        try:
            if file_ext == "docx":
                docx_processor(file_bytes)
            elif file_ext == "pdf":
                pdf_processor(file_bytes, language, init_page, end_page)
            elif file_ext == "md":
                md_processor(file_bytes)
            elif file_ext == "txt":
                txt_processor(file_bytes)
            else:
                print(json.dumps({"error": "Formato de archivo no soportado."}), flush=True)

        except Exception as e:
            print(json.dumps({"error": "Error al extraer texto del archivo."}), flush=True)
