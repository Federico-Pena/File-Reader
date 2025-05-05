"""Extract text from a file."""

import json
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image

def pdf_processor(buffer, language="eng", init_page=0, end_page=0, batch_size=10):
    """Extract text from a PDF buffer in page batches."""
    try:
        current_page = max(0, init_page)
        max_page = end_page if end_page > 0 else None

        while True:
            first_page = current_page + 1
            last_page = first_page + batch_size - 1

            if max_page and first_page > max_page:
                break
            if max_page:
                last_page = min(last_page, max_page)

            try:
                images = convert_from_bytes(
                    buffer,
                    grayscale=True,
                    first_page=first_page,
                    last_page=last_page
                )
            except Exception:
                break  # salir si no hay más páginas o hay error al cargar

            for idx, image in enumerate(images, start=current_page):
                preprocessed_image = preprocess_image(image)
                text_result = (
                    pytesseract.image_to_string(preprocessed_image, lang=language)
                ).strip()
                print(json.dumps({"text": text_result, "page": idx}), flush=True)

            if len(images) < batch_size:
                break  # terminamos si no quedan más páginas

            current_page += batch_size

        sys.exit(0)

    except Exception as e:
        print(json.dumps({"error": f"Can't extract text from file. {str(e)}"}), flush=True)
        sys.exit(1)

