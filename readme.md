# File Reader

![Node.js](https://img.shields.io/badge/Node.js-22.x-green) ![React](https://img.shields.io/badge/React-19.x-blue) ![Vite](https://img.shields.io/badge/Vite-5.x-purple) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-orange) ![License](https://img.shields.io/badge/License-MIT-yellow)

File Reader is a web application that allows users to upload files, extract text, and listen to the content using the Speech API in the frontend. The backend is built with Node.js and Express, while the frontend is developed with React and Vite.

## Features

- Upload files and extract text automatically.
- Uses Speech API to read the extracted text aloud.
- Fast and lightweight implementation.

## Supported Formats

| Format | MIME Type                                                               |
| ------ | ----------------------------------------------------------------------- |
| PDF    | application/pdf                                                         |
| DOCX   | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| TXT    | text/plain                                                              |
| MD     | .md                                                                     |

## Installation

```sh
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. Open the app in your browser.
2. Upload a supported file.
3. The extracted text will be displayed.
4. Click "Play" to listen to the text using Speech API.

## License

This project is licensed under the MIT License.
