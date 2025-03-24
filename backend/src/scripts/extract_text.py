import os
import json
import fitz
import pytesseract
from pdf2image import convert_from_bytes
from spellchecker import SpellChecker


def correct_text(text):
    spell = SpellChecker(language="es")
    words = text.split()
    corrected_words = [spell.correction(word) or word for word in words]
    return " ".join(corrected_words)


def extract_text(buffer, file_ext):
    """Extract text from a file."""
    try:
        pages_text = []

        with fitz.open(stream=buffer, filetype=file_ext) as doc:
            for index, page in enumerate(doc):
                text_result = page.get_text().strip()
                if text_result.strip() == "":
                    continue
                pages_text.append({"text": text_result, "page": index})

        if not any(pages_text):
            poppler_path = os.path.join(os.path.dirname(__file__), "poppler", "bin")
            tesseract_path = os.path.join(
                os.path.dirname(__file__), "tesseract", "tesseract.exe"
            )

            pytesseract.pytesseract.tesseract_cmd = tesseract_path

            images = convert_from_bytes(buffer, poppler_path=poppler_path)
            for index, image in enumerate(images):
                text_result = (pytesseract.image_to_string(image, lang="spa")).strip()
                if text_result.strip() == "":
                    continue
                pages_text.append({"text": text_result, "page": index})

        if not any(pages_text):
            print(
                json.dumps(
                    {
                        "error": "EXTRACT_TEXT_ERROR: No se pudo extraer texto del archivo."
                    }
                )
            )

        print(json.dumps({"pages": pages_text}))

    except Exception as e:
        print(json.dumps({"error": f"EXTRACT_TEXT_ERROR: {str(e)}"}))
