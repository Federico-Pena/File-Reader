import multer, { memoryStorage } from 'multer'

const newMemoryStorage = memoryStorage()

export const multerMemoryStorage = multer({
  storage: newMemoryStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/octet-stream' &&
      file.originalname.endsWith('.md')
    ) {
      file.mimetype = '.md'
    }
    cb(null, true)
  }
}).single('file')
