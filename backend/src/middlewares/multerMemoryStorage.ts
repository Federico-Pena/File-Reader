import multer from 'multer'

export const multerMemoryStorage = multer({
  dest: '/tmp/uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB límite
  }
}).single('file')
