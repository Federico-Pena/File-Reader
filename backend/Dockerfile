FROM node:22-slim

WORKDIR /app/backend

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-spa \
    tesseract-ocr-eng \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*


# Copiar aplicación
COPY ./backend .

RUN npm install

EXPOSE 1234

CMD [ "npm", "run", "dev" ]
