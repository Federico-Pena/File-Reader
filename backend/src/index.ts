import app from './app/app.js'
import { apiConfig } from './config/apiConfig.js'
import { cleanTempDirFIles } from './utils/cleanTempDirFIles.js'

app.listen(apiConfig.PORT, () => {
  const text = `Server running in: ${apiConfig.API_URL}`
  console.log(text)
  const tempDir = apiConfig.PATH_DIR_TEMP_FILES ?? ''
  cleanTempDirFIles(tempDir)
})
