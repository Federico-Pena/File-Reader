"""Extract text from a file."""

import os
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image


def preprocess_image(image: Image.Image) -> Image.Image:
    """Preprocess image."""
    gray = image.convert("L")
    return gray


def pdf_processor(buffer):
    """Extract text from a file."""
    try:
        pages_text = []
        poppler_path = os.path.join(os.path.dirname(__file__), "../", "poppler", "bin")
        tesseract_path = os.path.join(
            os.path.dirname(__file__), "../", "tesseract", "tesseract"
        )
        pytesseract.pytesseract.tesseract_cmd = tesseract_path
        images = convert_from_bytes(buffer, poppler_path=poppler_path, grayscale=True)
        for index, image in enumerate(images):
            if index == 12:
                break
            preprocessed_image = preprocess_image(image)
            text_result = (
                pytesseract.image_to_string(preprocessed_image, lang="spa")
            ).strip()
            pages_text.append({"text": text_result, "page": index})
        return pages_text
    except Exception as e:
        raise Exception(f"Can't extract text from file. {e}")
