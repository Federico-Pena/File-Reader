"""Extract text from a file."""

import json
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image

def pdf_processor(buffer, language="eng", init_page=1, end_page=0, batch_size=10):
    """Extract text from a PDF buffer in page batches."""
    try:
        current_page = max(0, init_page - 1)
        max_page = end_page if end_page > 0 else None

        while True:
            first_page = current_page + 1
            last_page = first_page + batch_size - 1

            if max_page and first_page > max_page:
                break
            if max_page:
                last_page = min(last_page, max_page)

            images = convert_from_bytes(
                buffer,
                grayscale=True,
                first_page=first_page,
                last_page=last_page
            )
            if len(images) == 0:
                print(json.dumps({"error": "No se pudo extraer texto"}), flush=True)
                break
            for idx, image in enumerate(images, start=current_page):
                preprocessed_image = image.convert("L")
                text_result = (
                    pytesseract.image_to_string(preprocessed_image, lang=language)
                ).strip()
                print(json.dumps({"text": text_result, "page": idx}), flush=True)

            if len(images) < batch_size:
                break  # terminamos si no quedan más páginas

            current_page += batch_size

    except Exception as e:
        print(json.dumps({"error": "Error al extraer texto del archivo PDF."}), flush=True)

