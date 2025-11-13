import { createSystem, defineConfig, defaultConfig } from '@chakra-ui/react'

const theme = defineConfig({
  theme: {},
  globalCss: {
    html: {
      colorPalette: 'cyan'
    }
  }
})

export default createSystem(defaultConfig, theme)
