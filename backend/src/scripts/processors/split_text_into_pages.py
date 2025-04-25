"""Divide text into logical pages without cutting words."""


def split_text_into_pages(text: str, max_chars: int = 1500):
    """Divide text into logical pages without cutting words."""
    pages = []
    start = 0
    while start < len(text):
        end = min(start + max_chars, len(text))
        split_point = text.rfind("\n\n", start, end)
        if split_point == -1:
            split_point = text.rfind(" ", start, end)
        if split_point == -1 or split_point <= start:
            split_point = end
        page_text = text[start:split_point].strip()
        if page_text:
            pages.append(page_text)
        start = split_point
    return [{"text": page, "page": i} for i, page in enumerate(pages)]
