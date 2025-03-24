import sys
from extract_text import extract_text

if __name__ == "__main__":
    file_bytes = sys.stdin.buffer.read()
    file_ext = sys.argv[1]
    extract_text(file_bytes, file_ext)
