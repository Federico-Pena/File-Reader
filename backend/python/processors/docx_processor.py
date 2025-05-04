"""Extract text from a file."""

from io import BytesIO
import mammoth
from processors.split_text_into_pages import split_text_into_pages


def docx_processor(buffer: bytes):
    """Extract text from a DOCX file using mammoth, with logical pagination."""
    try:
        result = mammoth.extract_raw_text(BytesIO(buffer))
        text = result.value.strip()
        split_text_into_pages(text)
    except Exception as e:
        raise Exception(f"Can't extract text from file. {e}") from e
