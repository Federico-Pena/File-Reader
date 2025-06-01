FROM node:22-slim

WORKDIR /app/frontend

COPY ./frontend .
RUN npm ci
COPY ../shared ../shared/

EXPOSE 5173
CMD ["npm", "run", "dev"]