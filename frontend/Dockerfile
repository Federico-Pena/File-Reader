FROM node:22-slim

WORKDIR /app/frontend

COPY ./frontend .
RUN npm install

EXPOSE 5173
CMD ["npm", "run", "dev"]