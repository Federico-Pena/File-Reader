import { join } from "path";
import os from "node:os";
import { spawn } from "child_process";
import readline from "readline";
import { existsSync, unlinkSync } from "node:fs";
import { sendEventStream } from "../utils/sendEventStream.js";
import { saveOCRPageFixture } from "../utils/saveOCRPageFixture.js";
const scriptPath = join(process.cwd(), "python", "main.py");
const isWindows = os.platform() === "win32";
const pythonPath = isWindows ? join(process.cwd(), "venv", "Scripts", "python.exe") : "/opt/venv/bin/python";
const streamController = (req, res) => {
  const { fileName, filePath, lang, initPage, endPage } = req.body;
  const payload = { filePath, lang, initPage, endPage };
  try {
    const pythonProcess = spawn(pythonPath, [scriptPath, JSON.stringify(payload)], {});
    const rl = readline.createInterface({ input: pythonProcess.stdout });
    const cleanup = () => {
      rl.close();
      pythonProcess.kill();
      res.end();
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    };
    res.on("close", () => {
      cleanup();
    });
    rl.on("line", (line) => {
      const payload2 = JSON.parse(line);
      const {
        error,
        text,
        page,
        total_pages
      } = payload2;
      if (total_pages) {
        sendEventStream(res, {
          eventName: "total_pages",
          data: { total_pages }
        });
      }
      if (error) {
        sendEventStream(res, {
          eventName: "errorEvent",
          data: { message: error }
        });
        cleanup();
        return;
      }
      if (text) {
        saveOCRPageFixture(fileName, text, page);
        sendEventStream(res, {
          eventName: "data",
          data: {
            text,
            page
          }
        });
      }
      if (!text) console.log("rl.on('line'", payload2);
    });
    pythonProcess.on("close", (code) => {
      if (code === 0) {
        sendEventStream(res, {
          eventName: "done",
          data: { message: "Tarea finalizada." }
        });
        cleanup();
      } else {
        sendEventStream(res, {
          eventName: "errorEvent",
          data: { message: `Ocurri\xF3 un error al procesar el archivo. C\xF3digo: ${code ?? "?"}` }
        });
        cleanup();
      }
    });
  } catch (error) {
    sendEventStream(res, {
      eventName: "errorEvent",
      data: { message: error.message }
    });
    res.end();
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
};
export {
  streamController
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2NvbnRyb2xsZXJzL3N0cmVhbUNvbnRyb2xsZXIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB0eXBlIHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xyXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCdcclxuaW1wb3J0IG9zIGZyb20gJ25vZGU6b3MnXHJcbmltcG9ydCB7IHNwYXduIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcclxuaW1wb3J0IHJlYWRsaW5lIGZyb20gJ3JlYWRsaW5lJ1xyXG5pbXBvcnQgeyBleGlzdHNTeW5jLCB1bmxpbmtTeW5jIH0gZnJvbSAnbm9kZTpmcydcclxuaW1wb3J0IHsgc2VuZEV2ZW50U3RyZWFtIH0gZnJvbSAnLi4vdXRpbHMvc2VuZEV2ZW50U3RyZWFtLmpzJ1xyXG5pbXBvcnQgeyBzYXZlT0NSUGFnZUZpeHR1cmUgfSBmcm9tICcuLi91dGlscy9zYXZlT0NSUGFnZUZpeHR1cmUuanMnXHJcblxyXG5jb25zdCBzY3JpcHRQYXRoID0gam9pbihwcm9jZXNzLmN3ZCgpLCAncHl0aG9uJywgJ21haW4ucHknKVxyXG5jb25zdCBpc1dpbmRvd3MgPSBvcy5wbGF0Zm9ybSgpID09PSAnd2luMzInXHJcbmNvbnN0IHB5dGhvblBhdGggPSBpc1dpbmRvd3NcclxuICA/IGpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3ZlbnYnLCAnU2NyaXB0cycsICdweXRob24uZXhlJylcclxuICA6ICcvb3B0L3ZlbnYvYmluL3B5dGhvbidcclxuXHJcbmV4cG9ydCBjb25zdCBzdHJlYW1Db250cm9sbGVyID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gIGNvbnN0IHsgZmlsZU5hbWUsIGZpbGVQYXRoLCBsYW5nLCBpbml0UGFnZSwgZW5kUGFnZSB9ID0gcmVxLmJvZHlcclxuICBjb25zdCBwYXlsb2FkID0geyBmaWxlUGF0aCwgbGFuZywgaW5pdFBhZ2UsIGVuZFBhZ2UgfVxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBweXRob25Qcm9jZXNzID0gc3Bhd24ocHl0aG9uUGF0aCwgW3NjcmlwdFBhdGgsIEpTT04uc3RyaW5naWZ5KHBheWxvYWQpXSwge30pXHJcbiAgICBjb25zdCBybCA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7IGlucHV0OiBweXRob25Qcm9jZXNzLnN0ZG91dCB9KVxyXG4gICAgY29uc3QgY2xlYW51cCA9ICgpID0+IHtcclxuICAgICAgcmwuY2xvc2UoKVxyXG4gICAgICBweXRob25Qcm9jZXNzLmtpbGwoKVxyXG4gICAgICByZXMuZW5kKClcclxuICAgICAgaWYgKGV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XHJcbiAgICAgICAgdW5saW5rU3luYyhmaWxlUGF0aClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlcy5vbignY2xvc2UnLCAoKSA9PiB7XHJcbiAgICAgIGNsZWFudXAoKVxyXG4gICAgfSlcclxuXHJcbiAgICBybC5vbignbGluZScsIChsaW5lKSA9PiB7XHJcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBKU09OLnBhcnNlKGxpbmUpXHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBlcnJvcixcclxuICAgICAgICB0ZXh0LFxyXG4gICAgICAgIHBhZ2UsXHJcbiAgICAgICAgdG90YWxfcGFnZXNcclxuICAgICAgfToge1xyXG4gICAgICAgIGVycm9yOiBzdHJpbmcgfCB1bmRlZmluZWRcclxuICAgICAgICB0ZXh0OiBzdHJpbmcgfCB1bmRlZmluZWRcclxuICAgICAgICBwYWdlOiBudW1iZXJcclxuICAgICAgICB0b3RhbF9wYWdlczogbnVtYmVyXHJcbiAgICAgIH0gPSBwYXlsb2FkXHJcbiAgICAgIGlmICh0b3RhbF9wYWdlcykge1xyXG4gICAgICAgIHNlbmRFdmVudFN0cmVhbShyZXMsIHtcclxuICAgICAgICAgIGV2ZW50TmFtZTogJ3RvdGFsX3BhZ2VzJyxcclxuICAgICAgICAgIGRhdGE6IHsgdG90YWxfcGFnZXMgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgc2VuZEV2ZW50U3RyZWFtKHJlcywge1xyXG4gICAgICAgICAgZXZlbnROYW1lOiAnZXJyb3JFdmVudCcsXHJcbiAgICAgICAgICBkYXRhOiB7IG1lc3NhZ2U6IGVycm9yIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIGNsZWFudXAoKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ZXh0KSB7XHJcbiAgICAgICAgc2F2ZU9DUlBhZ2VGaXh0dXJlKGZpbGVOYW1lLCB0ZXh0LCBwYWdlKVxyXG5cclxuICAgICAgICBzZW5kRXZlbnRTdHJlYW0ocmVzLCB7XHJcbiAgICAgICAgICBldmVudE5hbWU6ICdkYXRhJyxcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgdGV4dCxcclxuICAgICAgICAgICAgcGFnZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgaWYgKCF0ZXh0KSBjb25zb2xlLmxvZyhcInJsLm9uKCdsaW5lJ1wiLCBwYXlsb2FkKVxyXG4gICAgfSlcclxuXHJcbiAgICBweXRob25Qcm9jZXNzLm9uKCdjbG9zZScsIChjb2RlKSA9PiB7XHJcbiAgICAgIGlmIChjb2RlID09PSAwKSB7XHJcbiAgICAgICAgc2VuZEV2ZW50U3RyZWFtKHJlcywge1xyXG4gICAgICAgICAgZXZlbnROYW1lOiAnZG9uZScsXHJcbiAgICAgICAgICBkYXRhOiB7IG1lc3NhZ2U6ICdUYXJlYSBmaW5hbGl6YWRhLicgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgY2xlYW51cCgpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VuZEV2ZW50U3RyZWFtKHJlcywge1xyXG4gICAgICAgICAgZXZlbnROYW1lOiAnZXJyb3JFdmVudCcsXHJcbiAgICAgICAgICBkYXRhOiB7IG1lc3NhZ2U6IGBPY3VycmlcdTAwRjMgdW4gZXJyb3IgYWwgcHJvY2VzYXIgZWwgYXJjaGl2by4gQ1x1MDBGM2RpZ286ICR7Y29kZSA/PyAnPyd9YCB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgY2xlYW51cCgpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgc2VuZEV2ZW50U3RyZWFtKHJlcywge1xyXG4gICAgICBldmVudE5hbWU6ICdlcnJvckV2ZW50JyxcclxuICAgICAgZGF0YTogeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH1cclxuICAgIH0pXHJcbiAgICByZXMuZW5kKClcclxuICAgIGlmIChleGlzdHNTeW5jKGZpbGVQYXRoKSkge1xyXG4gICAgICB1bmxpbmtTeW5jKGZpbGVQYXRoKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiQUFDQSxTQUFTLFlBQVk7QUFDckIsT0FBTyxRQUFRO0FBQ2YsU0FBUyxhQUFhO0FBQ3RCLE9BQU8sY0FBYztBQUNyQixTQUFTLFlBQVksa0JBQWtCO0FBQ3ZDLFNBQVMsdUJBQXVCO0FBQ2hDLFNBQVMsMEJBQTBCO0FBRW5DLE1BQU0sYUFBYSxLQUFLLFFBQVEsSUFBSSxHQUFHLFVBQVUsU0FBUztBQUMxRCxNQUFNLFlBQVksR0FBRyxTQUFTLE1BQU07QUFDcEMsTUFBTSxhQUFhLFlBQ2YsS0FBSyxRQUFRLElBQUksR0FBRyxRQUFRLFdBQVcsWUFBWSxJQUNuRDtBQUVHLE1BQU0sbUJBQW1CLENBQUMsS0FBYyxRQUFrQjtBQUMvRCxRQUFNLEVBQUUsVUFBVSxVQUFVLE1BQU0sVUFBVSxRQUFRLElBQUksSUFBSTtBQUM1RCxRQUFNLFVBQVUsRUFBRSxVQUFVLE1BQU0sVUFBVSxRQUFRO0FBQ3BELE1BQUk7QUFDRixVQUFNLGdCQUFnQixNQUFNLFlBQVksQ0FBQyxZQUFZLEtBQUssVUFBVSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakYsVUFBTSxLQUFLLFNBQVMsZ0JBQWdCLEVBQUUsT0FBTyxjQUFjLE9BQU8sQ0FBQztBQUNuRSxVQUFNLFVBQVUsTUFBTTtBQUNwQixTQUFHLE1BQU07QUFDVCxvQkFBYyxLQUFLO0FBQ25CLFVBQUksSUFBSTtBQUNSLFVBQUksV0FBVyxRQUFRLEdBQUc7QUFDeEIsbUJBQVcsUUFBUTtBQUFBLE1BQ3JCO0FBQUEsSUFDRjtBQUVBLFFBQUksR0FBRyxTQUFTLE1BQU07QUFDcEIsY0FBUTtBQUFBLElBQ1YsQ0FBQztBQUVELE9BQUcsR0FBRyxRQUFRLENBQUMsU0FBUztBQUN0QixZQUFNQSxXQUFVLEtBQUssTUFBTSxJQUFJO0FBQy9CLFlBQU07QUFBQSxRQUNKO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRixJQUtJQTtBQUNKLFVBQUksYUFBYTtBQUNmLHdCQUFnQixLQUFLO0FBQUEsVUFDbkIsV0FBVztBQUFBLFVBQ1gsTUFBTSxFQUFFLFlBQVk7QUFBQSxRQUN0QixDQUFDO0FBQUEsTUFDSDtBQUNBLFVBQUksT0FBTztBQUNULHdCQUFnQixLQUFLO0FBQUEsVUFDbkIsV0FBVztBQUFBLFVBQ1gsTUFBTSxFQUFFLFNBQVMsTUFBTTtBQUFBLFFBQ3pCLENBQUM7QUFDRCxnQkFBUTtBQUNSO0FBQUEsTUFDRjtBQUNBLFVBQUksTUFBTTtBQUNSLDJCQUFtQixVQUFVLE1BQU0sSUFBSTtBQUV2Qyx3QkFBZ0IsS0FBSztBQUFBLFVBQ25CLFdBQVc7QUFBQSxVQUNYLE1BQU07QUFBQSxZQUNKO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNIO0FBQ0EsVUFBSSxDQUFDLEtBQU0sU0FBUSxJQUFJLGdCQUFnQkEsUUFBTztBQUFBLElBQ2hELENBQUM7QUFFRCxrQkFBYyxHQUFHLFNBQVMsQ0FBQyxTQUFTO0FBQ2xDLFVBQUksU0FBUyxHQUFHO0FBQ2Qsd0JBQWdCLEtBQUs7QUFBQSxVQUNuQixXQUFXO0FBQUEsVUFDWCxNQUFNLEVBQUUsU0FBUyxvQkFBb0I7QUFBQSxRQUN2QyxDQUFDO0FBQ0QsZ0JBQVE7QUFBQSxNQUNWLE9BQU87QUFDTCx3QkFBZ0IsS0FBSztBQUFBLFVBQ25CLFdBQVc7QUFBQSxVQUNYLE1BQU0sRUFBRSxTQUFTLDBEQUFvRCxRQUFRLEdBQUcsR0FBRztBQUFBLFFBQ3JGLENBQUM7QUFFRCxnQkFBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNILFNBQVMsT0FBWTtBQUNuQixvQkFBZ0IsS0FBSztBQUFBLE1BQ25CLFdBQVc7QUFBQSxNQUNYLE1BQU0sRUFBRSxTQUFTLE1BQU0sUUFBUTtBQUFBLElBQ2pDLENBQUM7QUFDRCxRQUFJLElBQUk7QUFDUixRQUFJLFdBQVcsUUFBUSxHQUFHO0FBQ3hCLGlCQUFXLFFBQVE7QUFBQSxJQUNyQjtBQUFBLEVBQ0Y7QUFDRjsiLAogICJuYW1lcyI6IFsicGF5bG9hZCJdCn0K
