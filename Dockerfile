# Etapa 1: Build del frontend
FROM node:22-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/ ./
COPY shared ../shared/
RUN npm ci && npm run build

# Etapa 2: Build del backend (tsc + esbuild)
FROM node:22-slim AS backend-builder
WORKDIR /app/backend
COPY backend/ ./
COPY shared ../shared/
RUN npm ci && npm run build

# Imagen final más limpia
FROM node:22-slim

WORKDIR /app/backend
ENV NODE_ENV=production

# Instala OCR y Python (solo lo necesario)
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-spa \
    poppler-utils \
    python3 \
    python3-venv \
    python3-pip \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Python deps
COPY --from=backend-builder /app/backend/requirements.txt ./requirements.txt
RUN python3 -m venv /opt/venv \
 && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
 && /opt/venv/bin/pip install --no-cache-dir -r requirements.txt \
 && rm -rf ~/.cache/pip \
 && rm requirements.txt

# Node deps
COPY --from=backend-builder /app/backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Código y assets
# from frontend-builder o backend-builder
COPY --from=frontend-builder /app/shared ./shared  
# from frontend o backend

COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/python ./python
COPY --from=frontend-builder /app/frontend/dist ./dist/public

# Puerto y CMD
EXPOSE 1234
CMD ["npm", "run", "start"]

