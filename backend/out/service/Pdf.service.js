import { createRequire } from "node:module"; const require = createRequire(import.meta.url);

// src/service/Pdf.service.ts
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path, { join } from "node:path";
import fs from "node:fs";
var PdfService = class {
  filePath;
  tempDir;
  processes;
  constructor(filePath) {
    this.filePath = filePath;
    this.tempDir = join(tmpdir(), `pdf_job_${randomUUID()}`);
    if (!existsSync(this.tempDir)) {
      mkdirSync(this.tempDir, { recursive: true });
    }
    this.processes = /* @__PURE__ */ new Set();
  }
  runCommand(cmd, args) {
    return new Promise((resolve, reject) => {
      const child = spawn(cmd, args);
      this.processes.add(child);
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (chunk) => stdout += chunk);
      child.stderr.on("data", (chunk) => stderr += chunk);
      child.on("close", (code, signal) => {
        this.processes.delete(child);
        if (signal) return reject(new Error(`Process killed with signal ${signal}`));
        if (code === 0) resolve(stdout.trim());
        else reject(new Error(stderr || `Process exited with code ${code}`));
      });
    });
  }
  cancelAll() {
    for (const proc of this.processes) {
      if (!proc.killed) proc.kill("SIGKILL");
    }
    this.processes.clear();
  }
  async isPdfScanned() {
    try {
      const stdout = await this.runCommand("pdftotext", ["-f", "1", "-l", "1", this.filePath, "-"]);
      return stdout.length < 50;
    } catch {
      return true;
    }
  }
  async extractTextFromPdfPage(pageNumber) {
    return this.runCommand("pdftotext", [
      "-f",
      String(pageNumber),
      "-l",
      String(pageNumber),
      "-raw",
      this.filePath,
      "-"
    ]);
  }
  async extractTextFromScannedPdfPage(pageNumber) {
    const imagePath = path.join(this.tempDir, `page_${pageNumber}.tiff`);
    try {
      await this.runCommand("pdftocairo", [
        "-tiff",
        "-f",
        String(pageNumber),
        "-l",
        String(pageNumber),
        this.filePath,
        `${this.tempDir}/page`
      ]);
      const generatedFiles = fs.readdirSync(this.tempDir).filter((f) => f.startsWith("page-") && f.endsWith(".tif"));
      if (generatedFiles.length > 0) {
        const generatedPath = path.join(this.tempDir, generatedFiles[0] ?? "");
        fs.renameSync(generatedPath, imagePath);
      }
      const stdout = await this.runCommand("tesseract", [imagePath, "stdout", "-l", "spa+eng"]);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      return stdout.trim();
    } catch (err) {
      console.error(err);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      throw err;
    }
  }
  async getTotalPages() {
    const stdout = await this.runCommand("pdfinfo", [this.filePath]);
    const match = stdout.match(/Pages:\s+(\d+)/);
    return match ? parseInt(match[1] ?? "1") : 1;
  }
  async extractImageText() {
    const imagePath = this.filePath;
    try {
      const stdout = await this.runCommand("tesseract", [imagePath, "stdout", "-l", "spa+eng"]);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      return stdout;
    } catch (err) {
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      throw err;
    }
  }
  async extractPageText(pageNumber) {
    if (isImage(this.filePath)) {
      return await this.extractImageText();
    }
    if (await this.isPdfScanned()) {
      return await this.extractTextFromScannedPdfPage(pageNumber);
    } else {
      return await this.extractTextFromPdfPage(pageNumber);
    }
  }
};
var isImage = (filePath) => {
  return filePath.endsWith(".png") || filePath.endsWith(".jpg") || filePath.endsWith(".jpeg") || filePath.endsWith(".tiff");
};
export {
  PdfService
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3NlcnZpY2UvUGRmLnNlcnZpY2UudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IHNwYXduLCB0eXBlIENoaWxkUHJvY2VzcyB9IGZyb20gJ25vZGU6Y2hpbGRfcHJvY2VzcydcclxuaW1wb3J0IHsgcmFuZG9tVVVJRCB9IGZyb20gJ25vZGU6Y3J5cHRvJ1xyXG5pbXBvcnQgeyBleGlzdHNTeW5jLCBta2RpclN5bmMgfSBmcm9tICdub2RlOmZzJ1xyXG5pbXBvcnQgeyB0bXBkaXIgfSBmcm9tICdub2RlOm9zJ1xyXG5pbXBvcnQgcGF0aCwgeyBqb2luIH0gZnJvbSAnbm9kZTpwYXRoJ1xyXG5pbXBvcnQgZnMgZnJvbSAnbm9kZTpmcydcclxuXHJcbmV4cG9ydCBjbGFzcyBQZGZTZXJ2aWNlIHtcclxuICBmaWxlUGF0aDogc3RyaW5nXHJcbiAgdGVtcERpcjogc3RyaW5nXHJcbiAgcHJvY2Vzc2VzOiBTZXQ8Q2hpbGRQcm9jZXNzPlxyXG5cclxuICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGhcclxuICAgIHRoaXMudGVtcERpciA9IGpvaW4odG1wZGlyKCksIGBwZGZfam9iXyR7cmFuZG9tVVVJRCgpfWApXHJcbiAgICBpZiAoIWV4aXN0c1N5bmModGhpcy50ZW1wRGlyKSkge1xyXG4gICAgICBta2RpclN5bmModGhpcy50ZW1wRGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxyXG4gICAgfVxyXG4gICAgdGhpcy5wcm9jZXNzZXMgPSBuZXcgU2V0KClcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcnVuQ29tbWFuZChjbWQ6IHN0cmluZywgYXJnczogc3RyaW5nW10pOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgY2hpbGQgPSBzcGF3bihjbWQsIGFyZ3MpXHJcbiAgICAgIHRoaXMucHJvY2Vzc2VzLmFkZChjaGlsZClcclxuXHJcbiAgICAgIGxldCBzdGRvdXQgPSAnJ1xyXG4gICAgICBsZXQgc3RkZXJyID0gJydcclxuXHJcbiAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIChjaHVuaykgPT4gKHN0ZG91dCArPSBjaHVuaykpXHJcbiAgICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIChjaHVuaykgPT4gKHN0ZGVyciArPSBjaHVuaykpXHJcblxyXG4gICAgICBjaGlsZC5vbignY2xvc2UnLCAoY29kZSwgc2lnbmFsKSA9PiB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZXMuZGVsZXRlKGNoaWxkKVxyXG4gICAgICAgIGlmIChzaWduYWwpIHJldHVybiByZWplY3QobmV3IEVycm9yKGBQcm9jZXNzIGtpbGxlZCB3aXRoIHNpZ25hbCAke3NpZ25hbH1gKSlcclxuICAgICAgICBpZiAoY29kZSA9PT0gMCkgcmVzb2x2ZShzdGRvdXQudHJpbSgpKVxyXG4gICAgICAgIGVsc2UgcmVqZWN0KG5ldyBFcnJvcihzdGRlcnIgfHwgYFByb2Nlc3MgZXhpdGVkIHdpdGggY29kZSAke2NvZGV9YCkpXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgY2FuY2VsQWxsKCkge1xyXG4gICAgZm9yIChjb25zdCBwcm9jIG9mIHRoaXMucHJvY2Vzc2VzKSB7XHJcbiAgICAgIGlmICghcHJvYy5raWxsZWQpIHByb2Mua2lsbCgnU0lHS0lMTCcpXHJcbiAgICB9XHJcbiAgICB0aGlzLnByb2Nlc3Nlcy5jbGVhcigpXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGlzUGRmU2Nhbm5lZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHN0ZG91dCA9IGF3YWl0IHRoaXMucnVuQ29tbWFuZCgncGRmdG90ZXh0JywgWyctZicsICcxJywgJy1sJywgJzEnLCB0aGlzLmZpbGVQYXRoLCAnLSddKVxyXG4gICAgICByZXR1cm4gc3Rkb3V0Lmxlbmd0aCA8IDUwXHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgZXh0cmFjdFRleHRGcm9tUGRmUGFnZShwYWdlTnVtYmVyOiBudW1iZXIpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIHRoaXMucnVuQ29tbWFuZCgncGRmdG90ZXh0JywgW1xyXG4gICAgICAnLWYnLFxyXG4gICAgICBTdHJpbmcocGFnZU51bWJlciksXHJcbiAgICAgICctbCcsXHJcbiAgICAgIFN0cmluZyhwYWdlTnVtYmVyKSxcclxuICAgICAgJy1yYXcnLFxyXG4gICAgICB0aGlzLmZpbGVQYXRoLFxyXG4gICAgICAnLSdcclxuICAgIF0pXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGV4dHJhY3RUZXh0RnJvbVNjYW5uZWRQZGZQYWdlKHBhZ2VOdW1iZXI6IG51bWJlcik6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICBjb25zdCBpbWFnZVBhdGggPSBwYXRoLmpvaW4odGhpcy50ZW1wRGlyLCBgcGFnZV8ke3BhZ2VOdW1iZXJ9LnRpZmZgKVxyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgdGhpcy5ydW5Db21tYW5kKCdwZGZ0b2NhaXJvJywgW1xyXG4gICAgICAgICctdGlmZicsXHJcbiAgICAgICAgJy1mJyxcclxuICAgICAgICBTdHJpbmcocGFnZU51bWJlciksXHJcbiAgICAgICAgJy1sJyxcclxuICAgICAgICBTdHJpbmcocGFnZU51bWJlciksXHJcbiAgICAgICAgdGhpcy5maWxlUGF0aCxcclxuICAgICAgICBgJHt0aGlzLnRlbXBEaXJ9L3BhZ2VgXHJcbiAgICAgIF0pXHJcbiAgICAgIGNvbnN0IGdlbmVyYXRlZEZpbGVzID0gZnMucmVhZGRpclN5bmModGhpcy50ZW1wRGlyKS5maWx0ZXIoKGYpID0+IGYuc3RhcnRzV2l0aCgncGFnZS0nKSAmJiBmLmVuZHNXaXRoKCcudGlmJykpXHJcbiAgICAgIGlmIChnZW5lcmF0ZWRGaWxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgY29uc3QgZ2VuZXJhdGVkUGF0aCA9IHBhdGguam9pbih0aGlzLnRlbXBEaXIsIGdlbmVyYXRlZEZpbGVzWzBdID8/ICcnKVxyXG4gICAgICAgIGZzLnJlbmFtZVN5bmMoZ2VuZXJhdGVkUGF0aCwgaW1hZ2VQYXRoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBzdGRvdXQgPSBhd2FpdCB0aGlzLnJ1bkNvbW1hbmQoJ3Rlc3NlcmFjdCcsIFtpbWFnZVBhdGgsICdzdGRvdXQnLCAnLWwnLCAnc3BhK2VuZyddKVxyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhpbWFnZVBhdGgpKSBmcy51bmxpbmtTeW5jKGltYWdlUGF0aClcclxuICAgICAgcmV0dXJuIHN0ZG91dC50cmltKClcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGVycilcclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoaW1hZ2VQYXRoKSkgZnMudW5saW5rU3luYyhpbWFnZVBhdGgpXHJcbiAgICAgIHRocm93IGVyclxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0VG90YWxQYWdlcygpOiBQcm9taXNlPG51bWJlcj4ge1xyXG4gICAgY29uc3Qgc3Rkb3V0ID0gYXdhaXQgdGhpcy5ydW5Db21tYW5kKCdwZGZpbmZvJywgW3RoaXMuZmlsZVBhdGhdKVxyXG4gICAgY29uc3QgbWF0Y2ggPSBzdGRvdXQubWF0Y2goL1BhZ2VzOlxccysoXFxkKykvKVxyXG4gICAgcmV0dXJuIG1hdGNoID8gcGFyc2VJbnQobWF0Y2hbMV0gPz8gJzEnKSA6IDFcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgZXh0cmFjdEltYWdlVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgY29uc3QgaW1hZ2VQYXRoID0gdGhpcy5maWxlUGF0aFxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3Rkb3V0ID0gYXdhaXQgdGhpcy5ydW5Db21tYW5kKCd0ZXNzZXJhY3QnLCBbaW1hZ2VQYXRoLCAnc3Rkb3V0JywgJy1sJywgJ3NwYStlbmcnXSlcclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoaW1hZ2VQYXRoKSkgZnMudW5saW5rU3luYyhpbWFnZVBhdGgpXHJcbiAgICAgIHJldHVybiBzdGRvdXRcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhpbWFnZVBhdGgpKSBmcy51bmxpbmtTeW5jKGltYWdlUGF0aClcclxuICAgICAgdGhyb3cgZXJyXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBleHRyYWN0UGFnZVRleHQocGFnZU51bWJlcjogbnVtYmVyKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGlmIChpc0ltYWdlKHRoaXMuZmlsZVBhdGgpKSB7XHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmV4dHJhY3RJbWFnZVRleHQoKVxyXG4gICAgfVxyXG4gICAgaWYgKGF3YWl0IHRoaXMuaXNQZGZTY2FubmVkKCkpIHtcclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZXh0cmFjdFRleHRGcm9tU2Nhbm5lZFBkZlBhZ2UocGFnZU51bWJlcilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmV4dHJhY3RUZXh0RnJvbVBkZlBhZ2UocGFnZU51bWJlcilcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGlzSW1hZ2UgPSAoZmlsZVBhdGg6IHN0cmluZykgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBmaWxlUGF0aC5lbmRzV2l0aCgnLnBuZycpIHx8IGZpbGVQYXRoLmVuZHNXaXRoKCcuanBnJykgfHwgZmlsZVBhdGguZW5kc1dpdGgoJy5qcGVnJykgfHwgZmlsZVBhdGguZW5kc1dpdGgoJy50aWZmJylcclxuICApXHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7O0FBQUEsU0FBUyxhQUFnQztBQUN6QyxTQUFTLGtCQUFrQjtBQUMzQixTQUFTLFlBQVksaUJBQWlCO0FBQ3RDLFNBQVMsY0FBYztBQUN2QixPQUFPLFFBQVEsWUFBWTtBQUMzQixPQUFPLFFBQVE7QUFFUixJQUFNLGFBQU4sTUFBaUI7QUFBQSxFQUN0QjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQSxZQUFZLFVBQWtCO0FBQzVCLFNBQUssV0FBVztBQUNoQixTQUFLLFVBQVUsS0FBSyxPQUFPLEdBQUcsV0FBVyxXQUFXLENBQUMsRUFBRTtBQUN2RCxRQUFJLENBQUMsV0FBVyxLQUFLLE9BQU8sR0FBRztBQUM3QixnQkFBVSxLQUFLLFNBQVMsRUFBRSxXQUFXLEtBQUssQ0FBQztBQUFBLElBQzdDO0FBQ0EsU0FBSyxZQUFZLG9CQUFJLElBQUk7QUFBQSxFQUMzQjtBQUFBLEVBRVEsV0FBVyxLQUFhLE1BQWlDO0FBQy9ELFdBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQ3RDLFlBQU0sUUFBUSxNQUFNLEtBQUssSUFBSTtBQUM3QixXQUFLLFVBQVUsSUFBSSxLQUFLO0FBRXhCLFVBQUksU0FBUztBQUNiLFVBQUksU0FBUztBQUViLFlBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxVQUFXLFVBQVUsS0FBTTtBQUNwRCxZQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsVUFBVyxVQUFVLEtBQU07QUFFcEQsWUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLFdBQVc7QUFDbEMsYUFBSyxVQUFVLE9BQU8sS0FBSztBQUMzQixZQUFJLE9BQVEsUUFBTyxPQUFPLElBQUksTUFBTSw4QkFBOEIsTUFBTSxFQUFFLENBQUM7QUFDM0UsWUFBSSxTQUFTLEVBQUcsU0FBUSxPQUFPLEtBQUssQ0FBQztBQUFBLFlBQ2hDLFFBQU8sSUFBSSxNQUFNLFVBQVUsNEJBQTRCLElBQUksRUFBRSxDQUFDO0FBQUEsTUFDckUsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVBLFlBQVk7QUFDVixlQUFXLFFBQVEsS0FBSyxXQUFXO0FBQ2pDLFVBQUksQ0FBQyxLQUFLLE9BQVEsTUFBSyxLQUFLLFNBQVM7QUFBQSxJQUN2QztBQUNBLFNBQUssVUFBVSxNQUFNO0FBQUEsRUFDdkI7QUFBQSxFQUVBLE1BQWMsZUFBaUM7QUFDN0MsUUFBSTtBQUNGLFlBQU0sU0FBUyxNQUFNLEtBQUssV0FBVyxhQUFhLENBQUMsTUFBTSxLQUFLLE1BQU0sS0FBSyxLQUFLLFVBQVUsR0FBRyxDQUFDO0FBQzVGLGFBQU8sT0FBTyxTQUFTO0FBQUEsSUFDekIsUUFBUTtBQUNOLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUFBLEVBRUEsTUFBYyx1QkFBdUIsWUFBcUM7QUFDeEUsV0FBTyxLQUFLLFdBQVcsYUFBYTtBQUFBLE1BQ2xDO0FBQUEsTUFDQSxPQUFPLFVBQVU7QUFBQSxNQUNqQjtBQUFBLE1BQ0EsT0FBTyxVQUFVO0FBQUEsTUFDakI7QUFBQSxNQUNBLEtBQUs7QUFBQSxNQUNMO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRUEsTUFBYyw4QkFBOEIsWUFBcUM7QUFDL0UsVUFBTSxZQUFZLEtBQUssS0FBSyxLQUFLLFNBQVMsUUFBUSxVQUFVLE9BQU87QUFDbkUsUUFBSTtBQUNGLFlBQU0sS0FBSyxXQUFXLGNBQWM7QUFBQSxRQUNsQztBQUFBLFFBQ0E7QUFBQSxRQUNBLE9BQU8sVUFBVTtBQUFBLFFBQ2pCO0FBQUEsUUFDQSxPQUFPLFVBQVU7QUFBQSxRQUNqQixLQUFLO0FBQUEsUUFDTCxHQUFHLEtBQUssT0FBTztBQUFBLE1BQ2pCLENBQUM7QUFDRCxZQUFNLGlCQUFpQixHQUFHLFlBQVksS0FBSyxPQUFPLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxXQUFXLE9BQU8sS0FBSyxFQUFFLFNBQVMsTUFBTSxDQUFDO0FBQzdHLFVBQUksZUFBZSxTQUFTLEdBQUc7QUFDN0IsY0FBTSxnQkFBZ0IsS0FBSyxLQUFLLEtBQUssU0FBUyxlQUFlLENBQUMsS0FBSyxFQUFFO0FBQ3JFLFdBQUcsV0FBVyxlQUFlLFNBQVM7QUFBQSxNQUN4QztBQUVBLFlBQU0sU0FBUyxNQUFNLEtBQUssV0FBVyxhQUFhLENBQUMsV0FBVyxVQUFVLE1BQU0sU0FBUyxDQUFDO0FBQ3hGLFVBQUksR0FBRyxXQUFXLFNBQVMsRUFBRyxJQUFHLFdBQVcsU0FBUztBQUNyRCxhQUFPLE9BQU8sS0FBSztBQUFBLElBQ3JCLFNBQVMsS0FBSztBQUNaLGNBQVEsTUFBTSxHQUFHO0FBQ2pCLFVBQUksR0FBRyxXQUFXLFNBQVMsRUFBRyxJQUFHLFdBQVcsU0FBUztBQUNyRCxZQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLE1BQU0sZ0JBQWlDO0FBQ3JDLFVBQU0sU0FBUyxNQUFNLEtBQUssV0FBVyxXQUFXLENBQUMsS0FBSyxRQUFRLENBQUM7QUFDL0QsVUFBTSxRQUFRLE9BQU8sTUFBTSxnQkFBZ0I7QUFDM0MsV0FBTyxRQUFRLFNBQVMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJO0FBQUEsRUFDN0M7QUFBQSxFQUVBLE1BQWMsbUJBQW9DO0FBQ2hELFVBQU0sWUFBWSxLQUFLO0FBQ3ZCLFFBQUk7QUFDRixZQUFNLFNBQVMsTUFBTSxLQUFLLFdBQVcsYUFBYSxDQUFDLFdBQVcsVUFBVSxNQUFNLFNBQVMsQ0FBQztBQUN4RixVQUFJLEdBQUcsV0FBVyxTQUFTLEVBQUcsSUFBRyxXQUFXLFNBQVM7QUFDckQsYUFBTztBQUFBLElBQ1QsU0FBUyxLQUFLO0FBQ1osVUFBSSxHQUFHLFdBQVcsU0FBUyxFQUFHLElBQUcsV0FBVyxTQUFTO0FBQ3JELFlBQU07QUFBQSxJQUNSO0FBQUEsRUFDRjtBQUFBLEVBRUEsTUFBTSxnQkFBZ0IsWUFBcUM7QUFDekQsUUFBSSxRQUFRLEtBQUssUUFBUSxHQUFHO0FBQzFCLGFBQU8sTUFBTSxLQUFLLGlCQUFpQjtBQUFBLElBQ3JDO0FBQ0EsUUFBSSxNQUFNLEtBQUssYUFBYSxHQUFHO0FBQzdCLGFBQU8sTUFBTSxLQUFLLDhCQUE4QixVQUFVO0FBQUEsSUFDNUQsT0FBTztBQUNMLGFBQU8sTUFBTSxLQUFLLHVCQUF1QixVQUFVO0FBQUEsSUFDckQ7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFNLFVBQVUsQ0FBQyxhQUFxQjtBQUNwQyxTQUNFLFNBQVMsU0FBUyxNQUFNLEtBQUssU0FBUyxTQUFTLE1BQU0sS0FBSyxTQUFTLFNBQVMsT0FBTyxLQUFLLFNBQVMsU0FBUyxPQUFPO0FBRXJIOyIsCiAgIm5hbWVzIjogW10KfQo=
