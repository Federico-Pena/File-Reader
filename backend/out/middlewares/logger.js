const logger = (req, res, next) => {
  if (req.url.match(
    /\.(css|js|png|jpg|jpeg|ico|svg|woff|woff2|ttf|eot|mp4|webm|gif)$/
  )) {
    return next();
  }
  const date = /* @__PURE__ */ new Date();
  const methodColor = setColorMethod(req.method);
  const message = `${date.toLocaleDateString()} ${date.toLocaleTimeString()} --> ${methodColor}${req.method}${colors.reset} statusCode ${req.url}`;
  res.on("finish", () => {
    const statusCodeColor = setColorStatusCode(res.statusCode);
    const finalMessage = message.replace(
      "statusCode",
      `${statusCodeColor}${res.statusCode}${colors.reset}`
    );
    console.log(finalMessage);
  });
  next();
};
const setColorStatusCode = (statusCode) => {
  if (statusCode >= 500) {
    return colors.red;
  } else if (statusCode >= 400) {
    return colors.yellow;
  } else if (statusCode >= 300) {
    return colors.cyan;
  } else if (statusCode >= 200) {
    return colors.green;
  } else {
    return colors.white;
  }
};
const setColorMethod = (method) => {
  if (method === "GET") {
    return colors.blue;
  } else if (method === "POST") {
    return colors.magenta;
  } else if (method === "PUT") {
    return colors.cyan;
  } else if (method === "DELETE") {
    return colors.red;
  } else {
    return colors.white;
  }
};
const colors = {
  reset: "\x1B[0m",
  red: "\x1B[31m",
  yellow: "\x1B[33m",
  green: "\x1B[32m",
  blue: "\x1B[34m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  white: "\x1B[37m"
};
export {
  colors,
  logger
};
