import { spawn } from "node:child_process";
import { join } from "node:path";
import os from "node:os";
import readline from "node:readline";
import { consoleStyler } from "logpainter";
const extractTextWithPython = ({
  fileBuffer,
  fileExt,
  senData,
  language
}) => {
  const scriptPath = join(process.cwd(), "src", "scripts", "main.py");
  const isWindows = os.platform() === "win32";
  const pythonPath = isWindows ? join(process.cwd(), "venv", "Scripts", "python.exe") : "/opt/venv/bin/python";
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(pythonPath, [scriptPath, `.${fileExt}`, language]);
    const rl = readline.createInterface({ input: pythonProcess.stdout });
    let extractedOutput = "";
    let errorOutput = "";
    pythonProcess.stdin.write(fileBuffer, "utf-8");
    pythonProcess.stdin.end();
    pythonProcess.stdout.on("data", (data) => {
      extractedOutput += data.toString();
    });
    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });
    rl.on("line", (line) => {
      try {
        const pageData = JSON.parse(line);
        senData(pageData);
      } catch (err) {
        console.warn("No se pudo parsear l\xEDnea:", line);
      }
    });
    pythonProcess.on("close", (code) => {
      rl.close();
      if (code !== 0) {
        reject(new Error(`Python exited with code ${code}: ${errorOutput}`));
      } else {
        resolve();
      }
    });
  });
};
export {
  extractTextWithPython
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3NlcnZpY2VzL2V4dHJhY3RUZXh0V2l0aFB5dGhvbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgc3Bhd24gfSBmcm9tICdub2RlOmNoaWxkX3Byb2Nlc3MnXHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdub2RlOnBhdGgnXHJcbmltcG9ydCBvcyBmcm9tICdub2RlOm9zJ1xyXG5pbXBvcnQgcmVhZGxpbmUgZnJvbSAnbm9kZTpyZWFkbGluZSdcclxuaW1wb3J0IHsgY29uc29sZVN0eWxlciB9IGZyb20gJ2xvZ3BhaW50ZXInXHJcblxyXG5leHBvcnQgY29uc3QgZXh0cmFjdFRleHRXaXRoUHl0aG9uID0gKHtcclxuICBmaWxlQnVmZmVyLFxyXG4gIGZpbGVFeHQsXHJcbiAgc2VuRGF0YSxcclxuICBsYW5ndWFnZVxyXG59OiB7XHJcbiAgZmlsZUJ1ZmZlcjogQnVmZmVyXHJcbiAgZmlsZUV4dDogc3RyaW5nXHJcbiAgc2VuRGF0YTogKHBhZ2U6IERhdGEpID0+IHZvaWRcclxuICBsYW5ndWFnZTogc3RyaW5nXHJcbn0pOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICBjb25zdCBzY3JpcHRQYXRoID0gam9pbihwcm9jZXNzLmN3ZCgpLCAnc3JjJywgJ3NjcmlwdHMnLCAnbWFpbi5weScpXHJcbiAgY29uc3QgaXNXaW5kb3dzID0gb3MucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJ1xyXG4gIGNvbnN0IHB5dGhvblBhdGggPSBpc1dpbmRvd3NcclxuICAgID8gam9pbihwcm9jZXNzLmN3ZCgpLCAndmVudicsICdTY3JpcHRzJywgJ3B5dGhvbi5leGUnKVxyXG4gICAgOiAnL29wdC92ZW52L2Jpbi9weXRob24nXHJcblxyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBjb25zdCBweXRob25Qcm9jZXNzID0gc3Bhd24ocHl0aG9uUGF0aCwgW3NjcmlwdFBhdGgsIGAuJHtmaWxlRXh0fWAsIGxhbmd1YWdlXSlcclxuICAgIGNvbnN0IHJsID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHsgaW5wdXQ6IHB5dGhvblByb2Nlc3Muc3Rkb3V0IH0pXHJcblxyXG4gICAgbGV0IGV4dHJhY3RlZE91dHB1dCA9ICcnXHJcbiAgICBsZXQgZXJyb3JPdXRwdXQgPSAnJ1xyXG5cclxuICAgIHB5dGhvblByb2Nlc3Muc3RkaW4ud3JpdGUoZmlsZUJ1ZmZlciwgJ3V0Zi04JylcclxuICAgIHB5dGhvblByb2Nlc3Muc3RkaW4uZW5kKClcclxuXHJcbiAgICBweXRob25Qcm9jZXNzLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XHJcbiAgICAgIGV4dHJhY3RlZE91dHB1dCArPSBkYXRhLnRvU3RyaW5nKClcclxuICAgIH0pXHJcblxyXG4gICAgcHl0aG9uUHJvY2Vzcy5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xyXG4gICAgICBlcnJvck91dHB1dCArPSBkYXRhLnRvU3RyaW5nKClcclxuICAgIH0pXHJcbiAgICBybC5vbignbGluZScsIChsaW5lKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcGFnZURhdGEgPSBKU09OLnBhcnNlKGxpbmUpXHJcbiAgICAgICAgc2VuRGF0YShwYWdlRGF0YSlcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdObyBzZSBwdWRvIHBhcnNlYXIgbFx1MDBFRG5lYTonLCBsaW5lKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgcHl0aG9uUHJvY2Vzcy5vbignY2xvc2UnLCAoY29kZSkgPT4ge1xyXG4gICAgICBybC5jbG9zZSgpXHJcbiAgICAgIGlmIChjb2RlICE9PSAwKSB7XHJcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgUHl0aG9uIGV4aXRlZCB3aXRoIGNvZGUgJHtjb2RlfTogJHtlcnJvck91dHB1dH1gKSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXNvbHZlKClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9KVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICJBQUFBLFNBQVMsYUFBYTtBQUN0QixTQUFTLFlBQVk7QUFDckIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxjQUFjO0FBQ3JCLFNBQVMscUJBQXFCO0FBRXZCLE1BQU0sd0JBQXdCLENBQUM7QUFBQSxFQUNwQztBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGLE1BS3FCO0FBQ25CLFFBQU0sYUFBYSxLQUFLLFFBQVEsSUFBSSxHQUFHLE9BQU8sV0FBVyxTQUFTO0FBQ2xFLFFBQU0sWUFBWSxHQUFHLFNBQVMsTUFBTTtBQUNwQyxRQUFNLGFBQWEsWUFDZixLQUFLLFFBQVEsSUFBSSxHQUFHLFFBQVEsV0FBVyxZQUFZLElBQ25EO0FBRUosU0FBTyxJQUFJLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFDdEMsVUFBTSxnQkFBZ0IsTUFBTSxZQUFZLENBQUMsWUFBWSxJQUFJLE9BQU8sSUFBSSxRQUFRLENBQUM7QUFDN0UsVUFBTSxLQUFLLFNBQVMsZ0JBQWdCLEVBQUUsT0FBTyxjQUFjLE9BQU8sQ0FBQztBQUVuRSxRQUFJLGtCQUFrQjtBQUN0QixRQUFJLGNBQWM7QUFFbEIsa0JBQWMsTUFBTSxNQUFNLFlBQVksT0FBTztBQUM3QyxrQkFBYyxNQUFNLElBQUk7QUFFeEIsa0JBQWMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxTQUFTO0FBQ3hDLHlCQUFtQixLQUFLLFNBQVM7QUFBQSxJQUNuQyxDQUFDO0FBRUQsa0JBQWMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxTQUFTO0FBQ3hDLHFCQUFlLEtBQUssU0FBUztBQUFBLElBQy9CLENBQUM7QUFDRCxPQUFHLEdBQUcsUUFBUSxDQUFDLFNBQVM7QUFDdEIsVUFBSTtBQUNGLGNBQU0sV0FBVyxLQUFLLE1BQU0sSUFBSTtBQUNoQyxnQkFBUSxRQUFRO0FBQUEsTUFDbEIsU0FBUyxLQUFLO0FBQ1osZ0JBQVEsS0FBSyxnQ0FBNkIsSUFBSTtBQUFBLE1BQ2hEO0FBQUEsSUFDRixDQUFDO0FBQ0Qsa0JBQWMsR0FBRyxTQUFTLENBQUMsU0FBUztBQUNsQyxTQUFHLE1BQU07QUFDVCxVQUFJLFNBQVMsR0FBRztBQUNkLGVBQU8sSUFBSSxNQUFNLDJCQUEyQixJQUFJLEtBQUssV0FBVyxFQUFFLENBQUM7QUFBQSxNQUNyRSxPQUFPO0FBQ0wsZ0JBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSCxDQUFDO0FBQ0g7IiwKICAibmFtZXMiOiBbXQp9Cg==
