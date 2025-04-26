"""Extract text from a file."""

from processors.split_text_into_pages import split_text_into_pages


def txt_processor(buffer: bytes):
    """Extract text from a TXT file with logical pagination."""
    try:
        text = buffer.decode("utf-8").strip()
        return split_text_into_pages(text)
    except Exception as e:
        raise Exception(f"Can't extract text from file. {e}")
