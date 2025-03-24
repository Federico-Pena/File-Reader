import app from './app/app.js'
import { apiConfig } from './config/apiConfig.js'

app.listen(apiConfig.PORT, () => {
  const text = `Server running in: ${apiConfig.API_URL}`
  console.log(text)
})
