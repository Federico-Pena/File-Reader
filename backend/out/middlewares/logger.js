import { createRequire } from "node:module"; const require = createRequire(import.meta.url);

// src/middlewares/logger.ts
var logger = (req, res, next) => {
  if (req.url.match(/\.(css|js|png|jpg|webp|jpeg|ico|svg|woff|woff2|ttf|eot|mp4|webm|gif)$/)) {
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
var setColorStatusCode = (statusCode) => {
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
var setColorMethod = (method) => {
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
var colors = {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL21pZGRsZXdhcmVzL2xvZ2dlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHR5cGUgeyBSZXNwb25zZSwgUmVxdWVzdCwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcydcclxuXHJcbmV4cG9ydCBjb25zdCBsb2dnZXIgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICBpZiAocmVxLnVybC5tYXRjaCgvXFwuKGNzc3xqc3xwbmd8anBnfHdlYnB8anBlZ3xpY298c3ZnfHdvZmZ8d29mZjJ8dHRmfGVvdHxtcDR8d2VibXxnaWYpJC8pKSB7XHJcbiAgICByZXR1cm4gbmV4dCgpXHJcbiAgfVxyXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpXHJcbiAgY29uc3QgbWV0aG9kQ29sb3IgPSBzZXRDb2xvck1ldGhvZChyZXEubWV0aG9kKVxyXG4gIGNvbnN0IG1lc3NhZ2UgPSBgJHtkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpfSAke2RhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCl9IC0tPiAke21ldGhvZENvbG9yfSR7XHJcbiAgICByZXEubWV0aG9kXHJcbiAgfSR7Y29sb3JzLnJlc2V0fSBzdGF0dXNDb2RlICR7cmVxLnVybH1gXHJcblxyXG4gIHJlcy5vbignZmluaXNoJywgKCkgPT4ge1xyXG4gICAgY29uc3Qgc3RhdHVzQ29kZUNvbG9yID0gc2V0Q29sb3JTdGF0dXNDb2RlKHJlcy5zdGF0dXNDb2RlKVxyXG4gICAgY29uc3QgZmluYWxNZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKFxyXG4gICAgICAnc3RhdHVzQ29kZScsXHJcbiAgICAgIGAke3N0YXR1c0NvZGVDb2xvcn0ke3Jlcy5zdGF0dXNDb2RlfSR7Y29sb3JzLnJlc2V0fWBcclxuICAgIClcclxuICAgIGNvbnNvbGUubG9nKGZpbmFsTWVzc2FnZSlcclxuICB9KVxyXG4gIG5leHQoKVxyXG59XHJcblxyXG5jb25zdCBzZXRDb2xvclN0YXR1c0NvZGUgPSAoc3RhdHVzQ29kZTogbnVtYmVyKSA9PiB7XHJcbiAgaWYgKHN0YXR1c0NvZGUgPj0gNTAwKSB7XHJcbiAgICByZXR1cm4gY29sb3JzLnJlZFxyXG4gIH0gZWxzZSBpZiAoc3RhdHVzQ29kZSA+PSA0MDApIHtcclxuICAgIHJldHVybiBjb2xvcnMueWVsbG93XHJcbiAgfSBlbHNlIGlmIChzdGF0dXNDb2RlID49IDMwMCkge1xyXG4gICAgcmV0dXJuIGNvbG9ycy5jeWFuXHJcbiAgfSBlbHNlIGlmIChzdGF0dXNDb2RlID49IDIwMCkge1xyXG4gICAgcmV0dXJuIGNvbG9ycy5ncmVlblxyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gY29sb3JzLndoaXRlXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBzZXRDb2xvck1ldGhvZCA9IChtZXRob2Q6IHN0cmluZykgPT4ge1xyXG4gIGlmIChtZXRob2QgPT09ICdHRVQnKSB7XHJcbiAgICByZXR1cm4gY29sb3JzLmJsdWVcclxuICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gJ1BPU1QnKSB7XHJcbiAgICByZXR1cm4gY29sb3JzLm1hZ2VudGFcclxuICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gJ1BVVCcpIHtcclxuICAgIHJldHVybiBjb2xvcnMuY3lhblxyXG4gIH0gZWxzZSBpZiAobWV0aG9kID09PSAnREVMRVRFJykge1xyXG4gICAgcmV0dXJuIGNvbG9ycy5yZWRcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGNvbG9ycy53aGl0ZVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNvbG9ycyA9IHtcclxuICByZXNldDogJ1xceDFiWzBtJyxcclxuICByZWQ6ICdcXHgxYlszMW0nLFxyXG4gIHllbGxvdzogJ1xceDFiWzMzbScsXHJcbiAgZ3JlZW46ICdcXHgxYlszMm0nLFxyXG4gIGJsdWU6ICdcXHgxYlszNG0nLFxyXG4gIG1hZ2VudGE6ICdcXHgxYlszNW0nLFxyXG4gIGN5YW46ICdcXHgxYlszNm0nLFxyXG4gIHdoaXRlOiAnXFx4MWJbMzdtJ1xyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7OztBQUVPLElBQU0sU0FBUyxDQUFDLEtBQWMsS0FBZSxTQUF1QjtBQUN6RSxNQUFJLElBQUksSUFBSSxNQUFNLHVFQUF1RSxHQUFHO0FBQzFGLFdBQU8sS0FBSztBQUFBLEVBQ2Q7QUFDQSxRQUFNLE9BQU8sb0JBQUksS0FBSztBQUN0QixRQUFNLGNBQWMsZUFBZSxJQUFJLE1BQU07QUFDN0MsUUFBTSxVQUFVLEdBQUcsS0FBSyxtQkFBbUIsQ0FBQyxJQUFJLEtBQUssbUJBQW1CLENBQUMsUUFBUSxXQUFXLEdBQzFGLElBQUksTUFDTixHQUFHLE9BQU8sS0FBSyxlQUFlLElBQUksR0FBRztBQUVyQyxNQUFJLEdBQUcsVUFBVSxNQUFNO0FBQ3JCLFVBQU0sa0JBQWtCLG1CQUFtQixJQUFJLFVBQVU7QUFDekQsVUFBTSxlQUFlLFFBQVE7QUFBQSxNQUMzQjtBQUFBLE1BQ0EsR0FBRyxlQUFlLEdBQUcsSUFBSSxVQUFVLEdBQUcsT0FBTyxLQUFLO0FBQUEsSUFDcEQ7QUFDQSxZQUFRLElBQUksWUFBWTtBQUFBLEVBQzFCLENBQUM7QUFDRCxPQUFLO0FBQ1A7QUFFQSxJQUFNLHFCQUFxQixDQUFDLGVBQXVCO0FBQ2pELE1BQUksY0FBYyxLQUFLO0FBQ3JCLFdBQU8sT0FBTztBQUFBLEVBQ2hCLFdBQVcsY0FBYyxLQUFLO0FBQzVCLFdBQU8sT0FBTztBQUFBLEVBQ2hCLFdBQVcsY0FBYyxLQUFLO0FBQzVCLFdBQU8sT0FBTztBQUFBLEVBQ2hCLFdBQVcsY0FBYyxLQUFLO0FBQzVCLFdBQU8sT0FBTztBQUFBLEVBQ2hCLE9BQU87QUFDTCxXQUFPLE9BQU87QUFBQSxFQUNoQjtBQUNGO0FBRUEsSUFBTSxpQkFBaUIsQ0FBQyxXQUFtQjtBQUN6QyxNQUFJLFdBQVcsT0FBTztBQUNwQixXQUFPLE9BQU87QUFBQSxFQUNoQixXQUFXLFdBQVcsUUFBUTtBQUM1QixXQUFPLE9BQU87QUFBQSxFQUNoQixXQUFXLFdBQVcsT0FBTztBQUMzQixXQUFPLE9BQU87QUFBQSxFQUNoQixXQUFXLFdBQVcsVUFBVTtBQUM5QixXQUFPLE9BQU87QUFBQSxFQUNoQixPQUFPO0FBQ0wsV0FBTyxPQUFPO0FBQUEsRUFDaEI7QUFDRjtBQUVPLElBQU0sU0FBUztBQUFBLEVBQ3BCLE9BQU87QUFBQSxFQUNQLEtBQUs7QUFBQSxFQUNMLFFBQVE7QUFBQSxFQUNSLE9BQU87QUFBQSxFQUNQLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxFQUNULE1BQU07QUFBQSxFQUNOLE9BQU87QUFDVDsiLAogICJuYW1lcyI6IFtdCn0K
