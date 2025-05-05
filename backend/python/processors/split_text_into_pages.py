"""Divide text into logical pages."""

import json


def split_text_into_pages(text: str):
    """Divide text into logical pages, ensuring splits occur at the next period (.)."""
    try:
        pages = []
        start = 0
        max_chars = 2000

        while start < len(text):
            end = min(start + max_chars, len(text))

            split_point = text.find(".", end) + 1

            if split_point == 0:
                split_point = end

            page_text = text[start:split_point].strip()
            if page_text:
                pages.append(page_text)

            start = split_point

        pages = [{"text": page, "page": i} for i, page in enumerate(pages)]
        for page in pages:
            print(json.dumps(page), flush=True)
    except Exception as e:
        print(json.dumps({"error": "Error al dividir el texto en páginas."}), flush=True)
    
