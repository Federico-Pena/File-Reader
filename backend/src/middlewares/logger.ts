import type { Response, Request, NextFunction } from 'express'

export const logger = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.url.match(
      /\.(css|js|png|jpg|jpeg|ico|svg|woff|woff2|ttf|eot|mp4|webm|gif)$/
    )
  ) {
    return next()
  }
  const date = new Date()
  const methodColor = setColorMethod(req.method)
  const message = `${date.toLocaleDateString()} ${date.toLocaleTimeString()} --> ${methodColor}${
    req.method
  }${colors.reset} statusCode ${req.url}`

  res.on('finish', () => {
    const statusCodeColor = setColorStatusCode(res.statusCode)
    const finalMessage = message.replace(
      'statusCode',
      `${statusCodeColor}${res.statusCode}${colors.reset}`
    )
    console.log(finalMessage)
  })
  next()
}

const setColorStatusCode = (statusCode: number) => {
  if (statusCode >= 500) {
    return colors.red
  } else if (statusCode >= 400) {
    return colors.yellow
  } else if (statusCode >= 300) {
    return colors.cyan
  } else if (statusCode >= 200) {
    return colors.green
  } else {
    return colors.white
  }
}

const setColorMethod = (method: string) => {
  if (method === 'GET') {
    return colors.blue
  } else if (method === 'POST') {
    return colors.magenta
  } else if (method === 'PUT') {
    return colors.cyan
  } else if (method === 'DELETE') {
    return colors.red
  } else {
    return colors.white
  }
}

export const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
}
