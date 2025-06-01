"""Extract text from a file."""

import json
import pytesseract
from pdf2image import convert_from_bytes
import fitz


def extract_text_from_page(page):
    """Extrae texto ignorando encabezado/pie."""
    try:
        blocks = page.get_textpage().extractText("blocks")
        content = []
        for block in blocks:
            if len(block) < 5:
                continue
            x0, y0, x1, y1, text = block[:5]
            if y0 > 50 and y1 < page.rect.height - 50:
                cleaned = text.strip()
                if cleaned:
                    content.append(cleaned)
        return "\n\n".join(content)
    except Exception:
        return ""


def pdf_processor(buffer, language="eng", init_page=1, end_page=0, batch_size=10):
    """Extract text from a PDF buffer in page batches using PyMuPDF first, fallback to OCR."""
    try:
        doc = fitz.open(stream=buffer, filetype="pdf")
        total_pages = len(doc)
        current_page = max(0, init_page - 1)
        max_page = min(end_page if end_page > 0 else total_pages, total_pages)
        print(json.dumps({"total_pages": max_page}), flush=True)

        while current_page < max_page:
            end_batch = min(current_page + batch_size, max_page)
            for idx in range(current_page, end_batch):
                page = doc[idx]
                text_result = extract_text_from_page(page)

                if not text_result:
                    images = convert_from_bytes(
                        buffer, grayscale=True, first_page=idx + 1, last_page=idx + 1
                    )
                    if images:
                        preprocessed_image = images[0].convert("L")
                        text_result = pytesseract.image_to_string(
                            preprocessed_image, lang=language
                        ).strip()

                print(json.dumps({"text": text_result, "page": idx}), flush=True)

            current_page += batch_size

    except Exception as e:
        print(
            json.dumps({"error": "Error al extraer texto del archivo PDF."}), flush=True
        )
