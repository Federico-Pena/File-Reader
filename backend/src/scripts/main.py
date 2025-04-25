"""Extract text from a file."""

import sys
import json
from processors.pdf_processor import pdf_processor
from processors.docx_processor import docx_processor
from processors.txt_processor import txt_processor
from processors.md_processor import md_processor

if __name__ == "__main__":
    file_bytes = sys.stdin.buffer.read()
    file_ext = sys.argv[1]
    pages = []
    try:
        if file_ext == ".docx":
            pages = docx_processor(file_bytes)
        elif file_ext == ".pdf":
            pages = pdf_processor(file_bytes)
        elif file_ext == ".md":
            pages = md_processor(file_bytes)
        elif file_ext == ".txt":
            pages = txt_processor(file_bytes)
        else:
            print(json.dumps({"error": "Format not supported."}))

        print(json.dumps({"pages": pages}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
