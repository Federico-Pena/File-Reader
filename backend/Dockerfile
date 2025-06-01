FROM node:22-slim

WORKDIR /app/backend

# Dependencias del sistema necesarias para Python + OCR
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-spa \
    poppler-utils \
    python3 \
    python3-venv \
    python3-pip \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Crea entorno virtual y instala paquetes
COPY ./backend/requirements.txt .

RUN python3 -m venv /opt/venv \ 
 && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
 && /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# Copia app
COPY ./backend .
COPY ../shared ../shared
# Asegúrate de usar el pip/python del entorno virtual en tiempo de ejecución si hace falta
ENV PATH="/opt/venv/bin:$PATH"

RUN npm ci

EXPOSE 1234

CMD [ "npm", "run", "dev" ]
