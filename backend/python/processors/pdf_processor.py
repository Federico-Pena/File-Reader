"""Extract text from a file."""

import json
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image


def preprocess_image(image: Image.Image) -> Image.Image:
    """Preprocess image."""
    gray = image.convert("L")
    return gray


def pdf_processor(buffer, language, init_page=0, end_page=0):
    """Extract text from a PDF file buffer."""
    try:
        images = convert_from_bytes(buffer, grayscale=True)
        total_pages = len(images)
        init_page = min(total_pages - 1, init_page - 1 > 0 and init_page - 1 or 0)
        if end_page:
            end_page = min(total_pages - 1, end_page)
            images = images[(init_page):end_page]
        else:
            images = images[(init_page):]

        for index, image in enumerate(images, start=(init_page)):
            preprocessed_image = preprocess_image(image)
            text_result = (
                pytesseract.image_to_string(preprocessed_image, lang=language)
            ).strip()
            print(json.dumps({"text": text_result, "page": index}), flush=True)
    except Exception as e:
        raise Exception(f"Can't extract text from file. {e}") from e
