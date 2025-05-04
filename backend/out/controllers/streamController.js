import { join } from "path";
import os from "node:os";
import { spawn } from "child_process";
import readline from "readline";
import { existsSync, unlinkSync } from "node:fs";
import { parseTextToRichBlocks } from "../utils/normalizeText.js";
const scriptPath = join(process.cwd(), "src", "scripts", "main.py");
const isWindows = os.platform() === "win32";
const pythonPath = isWindows ? join(process.cwd(), "venv", "Scripts", "python.exe") : "/opt/venv/bin/python";
const streamController = (req, res) => {
  const { filePath, payload } = req.body;
  try {
    const cleanup = () => {
      console.log("\u{1F6D1} Cliente desconectado.");
      rl.close();
      pythonProcess.kill();
      res.end();
      if (existsSync(filePath)) {
        console.log("streamController: ", { filePath, payload });
        unlinkSync(filePath);
      }
    };
    res.on("close", () => {
      cleanup();
    });
    const pythonProcess = spawn(pythonPath, [scriptPath, JSON.stringify(payload)]);
    const rl = readline.createInterface({ input: pythonProcess.stdout });
    rl.on("line", (line) => {
      const payload2 = JSON.parse(line);
      const { error, text, page } = payload2;
      if (error) {
        res.write(`event: error
data: ${JSON.stringify({ message: error })}

`);
        cleanup();
        return;
      }
      if (text) {
        const parsed = { ...parseTextToRichBlocks(text), page };
        res.write(`event: data
data: ${JSON.stringify(parsed)}

`);
      }
    });
    pythonProcess.on("close", () => {
      res.write(`event: done
data: ${JSON.stringify({ message: "Finished processing." })}

`);
      cleanup();
    });
  } catch (error) {
    res.write(`event: error
data: ${JSON.stringify({ message: error })}

`);
    res.end();
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
};
export {
  streamController
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2NvbnRyb2xsZXJzL3N0cmVhbUNvbnRyb2xsZXIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB0eXBlIHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xyXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCdcclxuaW1wb3J0IG9zIGZyb20gJ25vZGU6b3MnXHJcbmltcG9ydCB7IHNwYXduIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcclxuaW1wb3J0IHJlYWRsaW5lIGZyb20gJ3JlYWRsaW5lJ1xyXG5pbXBvcnQgeyBleGlzdHNTeW5jLCB1bmxpbmtTeW5jIH0gZnJvbSAnbm9kZTpmcydcclxuaW1wb3J0IHsgcGFyc2VUZXh0VG9SaWNoQmxvY2tzIH0gZnJvbSAnLi4vdXRpbHMvbm9ybWFsaXplVGV4dC5qcydcclxuXHJcbmNvbnN0IHNjcmlwdFBhdGggPSBqb2luKHByb2Nlc3MuY3dkKCksICdzcmMnLCAnc2NyaXB0cycsICdtYWluLnB5JylcclxuY29uc3QgaXNXaW5kb3dzID0gb3MucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJ1xyXG5jb25zdCBweXRob25QYXRoID0gaXNXaW5kb3dzXHJcbiAgPyBqb2luKHByb2Nlc3MuY3dkKCksICd2ZW52JywgJ1NjcmlwdHMnLCAncHl0aG9uLmV4ZScpXHJcbiAgOiAnL29wdC92ZW52L2Jpbi9weXRob24nXHJcblxyXG5leHBvcnQgY29uc3Qgc3RyZWFtQ29udHJvbGxlciA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICBjb25zdCB7IGZpbGVQYXRoLCBwYXlsb2FkIH0gPSByZXEuYm9keVxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnXHVEODNEXHVERUQxIENsaWVudGUgZGVzY29uZWN0YWRvLicpXHJcbiAgICAgIHJsLmNsb3NlKClcclxuICAgICAgcHl0aG9uUHJvY2Vzcy5raWxsKClcclxuICAgICAgcmVzLmVuZCgpXHJcbiAgICAgIGlmIChleGlzdHNTeW5jKGZpbGVQYXRoKSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzdHJlYW1Db250cm9sbGVyOiAnLCB7IGZpbGVQYXRoLCBwYXlsb2FkIH0pXHJcbiAgICAgICAgdW5saW5rU3luYyhmaWxlUGF0aClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlcy5vbignY2xvc2UnLCAoKSA9PiB7XHJcbiAgICAgIGNsZWFudXAoKVxyXG4gICAgfSlcclxuXHJcbiAgICBjb25zdCBweXRob25Qcm9jZXNzID0gc3Bhd24ocHl0aG9uUGF0aCwgW3NjcmlwdFBhdGgsIEpTT04uc3RyaW5naWZ5KHBheWxvYWQpXSlcclxuICAgIGNvbnN0IHJsID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHsgaW5wdXQ6IHB5dGhvblByb2Nlc3Muc3Rkb3V0IH0pXHJcblxyXG4gICAgcmwub24oJ2xpbmUnLCAobGluZSkgPT4ge1xyXG4gICAgICBjb25zdCBwYXlsb2FkID0gSlNPTi5wYXJzZShsaW5lKVxyXG4gICAgICAvLyBjb25zb2xlLmxvZygnXHVEODNEXHVEQzQ5IGxpbmUnLCB7IC4uLnBheWxvYWQsIHRleHQ6IHBheWxvYWQudGV4dD8uc2xpY2UoMCwgMTApIH0pXHJcblxyXG4gICAgICBjb25zdCB7IGVycm9yLCB0ZXh0LCBwYWdlIH0gPSBwYXlsb2FkXHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIHJlcy53cml0ZShgZXZlbnQ6IGVycm9yXFxuZGF0YTogJHtKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6IGVycm9yIH0pfVxcblxcbmApXHJcbiAgICAgICAgY2xlYW51cCgpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRleHQpIHtcclxuICAgICAgICBjb25zdCBwYXJzZWQgPSB7IC4uLnBhcnNlVGV4dFRvUmljaEJsb2Nrcyh0ZXh0KSwgcGFnZSB9XHJcbiAgICAgICAgcmVzLndyaXRlKGBldmVudDogZGF0YVxcbmRhdGE6ICR7SlNPTi5zdHJpbmdpZnkocGFyc2VkKX1cXG5cXG5gKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIHB5dGhvblByb2Nlc3Mub24oJ2Nsb3NlJywgKCkgPT4ge1xyXG4gICAgICByZXMud3JpdGUoYGV2ZW50OiBkb25lXFxuZGF0YTogJHtKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6ICdGaW5pc2hlZCBwcm9jZXNzaW5nLicgfSl9XFxuXFxuYClcclxuICAgICAgY2xlYW51cCgpXHJcbiAgICB9KVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMud3JpdGUoYGV2ZW50OiBlcnJvclxcbmRhdGE6ICR7SlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiBlcnJvciB9KX1cXG5cXG5gKVxyXG4gICAgcmVzLmVuZCgpXHJcbiAgICBpZiAoZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcclxuICAgICAgdW5saW5rU3luYyhmaWxlUGF0aClcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIkFBQ0EsU0FBUyxZQUFZO0FBQ3JCLE9BQU8sUUFBUTtBQUNmLFNBQVMsYUFBYTtBQUN0QixPQUFPLGNBQWM7QUFDckIsU0FBUyxZQUFZLGtCQUFrQjtBQUN2QyxTQUFTLDZCQUE2QjtBQUV0QyxNQUFNLGFBQWEsS0FBSyxRQUFRLElBQUksR0FBRyxPQUFPLFdBQVcsU0FBUztBQUNsRSxNQUFNLFlBQVksR0FBRyxTQUFTLE1BQU07QUFDcEMsTUFBTSxhQUFhLFlBQ2YsS0FBSyxRQUFRLElBQUksR0FBRyxRQUFRLFdBQVcsWUFBWSxJQUNuRDtBQUVHLE1BQU0sbUJBQW1CLENBQUMsS0FBYyxRQUFrQjtBQUMvRCxRQUFNLEVBQUUsVUFBVSxRQUFRLElBQUksSUFBSTtBQUNsQyxNQUFJO0FBQ0YsVUFBTSxVQUFVLE1BQU07QUFDcEIsY0FBUSxJQUFJLGlDQUEwQjtBQUN0QyxTQUFHLE1BQU07QUFDVCxvQkFBYyxLQUFLO0FBQ25CLFVBQUksSUFBSTtBQUNSLFVBQUksV0FBVyxRQUFRLEdBQUc7QUFDeEIsZ0JBQVEsSUFBSSxzQkFBc0IsRUFBRSxVQUFVLFFBQVEsQ0FBQztBQUN2RCxtQkFBVyxRQUFRO0FBQUEsTUFDckI7QUFBQSxJQUNGO0FBRUEsUUFBSSxHQUFHLFNBQVMsTUFBTTtBQUNwQixjQUFRO0FBQUEsSUFDVixDQUFDO0FBRUQsVUFBTSxnQkFBZ0IsTUFBTSxZQUFZLENBQUMsWUFBWSxLQUFLLFVBQVUsT0FBTyxDQUFDLENBQUM7QUFDN0UsVUFBTSxLQUFLLFNBQVMsZ0JBQWdCLEVBQUUsT0FBTyxjQUFjLE9BQU8sQ0FBQztBQUVuRSxPQUFHLEdBQUcsUUFBUSxDQUFDLFNBQVM7QUFDdEIsWUFBTUEsV0FBVSxLQUFLLE1BQU0sSUFBSTtBQUcvQixZQUFNLEVBQUUsT0FBTyxNQUFNLEtBQUssSUFBSUE7QUFDOUIsVUFBSSxPQUFPO0FBQ1QsWUFBSSxNQUFNO0FBQUEsUUFBdUIsS0FBSyxVQUFVLEVBQUUsU0FBUyxNQUFNLENBQUMsQ0FBQztBQUFBO0FBQUEsQ0FBTTtBQUN6RSxnQkFBUTtBQUNSO0FBQUEsTUFDRjtBQUNBLFVBQUksTUFBTTtBQUNSLGNBQU0sU0FBUyxFQUFFLEdBQUcsc0JBQXNCLElBQUksR0FBRyxLQUFLO0FBQ3RELFlBQUksTUFBTTtBQUFBLFFBQXNCLEtBQUssVUFBVSxNQUFNLENBQUM7QUFBQTtBQUFBLENBQU07QUFBQSxNQUM5RDtBQUFBLElBQ0YsQ0FBQztBQUVELGtCQUFjLEdBQUcsU0FBUyxNQUFNO0FBQzlCLFVBQUksTUFBTTtBQUFBLFFBQXNCLEtBQUssVUFBVSxFQUFFLFNBQVMsdUJBQXVCLENBQUMsQ0FBQztBQUFBO0FBQUEsQ0FBTTtBQUN6RixjQUFRO0FBQUEsSUFDVixDQUFDO0FBQUEsRUFDSCxTQUFTLE9BQU87QUFDZCxRQUFJLE1BQU07QUFBQSxRQUF1QixLQUFLLFVBQVUsRUFBRSxTQUFTLE1BQU0sQ0FBQyxDQUFDO0FBQUE7QUFBQSxDQUFNO0FBQ3pFLFFBQUksSUFBSTtBQUNSLFFBQUksV0FBVyxRQUFRLEdBQUc7QUFDeEIsaUJBQVcsUUFBUTtBQUFBLElBQ3JCO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogWyJwYXlsb2FkIl0KfQo=
