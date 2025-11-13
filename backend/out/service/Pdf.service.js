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
        if (signal)
          return reject(new Error(`Process killed with signal ${signal}`));
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
      const stdout = await this.runCommand("pdftotext", [
        "-f",
        "1",
        "-l",
        "1",
        this.filePath,
        "-"
      ]);
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
      this.filePath,
      "-"
    ]);
  }
  async extractTextFromScannedPdfPage(pageNumber) {
    const imagePath = path.join(this.tempDir, `page_${pageNumber}.tiff`);
    try {
      await this.runCommand("pdftocairo", [
        "-r",
        "300",
        "-tiff",
        "-antialias",
        "best",
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
      const stdout = await this.runCommand("tesseract", [
        imagePath,
        "stdout",
        "-l",
        "spa+eng",
        "--oem",
        "1"
      ]);
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
      const stdout = await this.runCommand("tesseract", [
        imagePath,
        "stdout",
        "-l",
        "spa+eng",
        "--psm",
        "3"
      ]);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3NlcnZpY2UvUGRmLnNlcnZpY2UudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IHNwYXduLCB0eXBlIENoaWxkUHJvY2VzcyB9IGZyb20gJ25vZGU6Y2hpbGRfcHJvY2VzcydcclxuaW1wb3J0IHsgcmFuZG9tVVVJRCB9IGZyb20gJ25vZGU6Y3J5cHRvJ1xyXG5pbXBvcnQgeyBleGlzdHNTeW5jLCBta2RpclN5bmMgfSBmcm9tICdub2RlOmZzJ1xyXG5pbXBvcnQgeyB0bXBkaXIgfSBmcm9tICdub2RlOm9zJ1xyXG5pbXBvcnQgcGF0aCwgeyBqb2luIH0gZnJvbSAnbm9kZTpwYXRoJ1xyXG5pbXBvcnQgZnMgZnJvbSAnbm9kZTpmcydcclxuXHJcbmV4cG9ydCBjbGFzcyBQZGZTZXJ2aWNlIHtcclxuICBmaWxlUGF0aDogc3RyaW5nXHJcbiAgdGVtcERpcjogc3RyaW5nXHJcbiAgcHJvY2Vzc2VzOiBTZXQ8Q2hpbGRQcm9jZXNzPlxyXG5cclxuICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGhcclxuICAgIHRoaXMudGVtcERpciA9IGpvaW4odG1wZGlyKCksIGBwZGZfam9iXyR7cmFuZG9tVVVJRCgpfWApXHJcbiAgICBpZiAoIWV4aXN0c1N5bmModGhpcy50ZW1wRGlyKSkge1xyXG4gICAgICBta2RpclN5bmModGhpcy50ZW1wRGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxyXG4gICAgfVxyXG4gICAgdGhpcy5wcm9jZXNzZXMgPSBuZXcgU2V0KClcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcnVuQ29tbWFuZChjbWQ6IHN0cmluZywgYXJnczogc3RyaW5nW10pOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgY2hpbGQgPSBzcGF3bihjbWQsIGFyZ3MpXHJcbiAgICAgIHRoaXMucHJvY2Vzc2VzLmFkZChjaGlsZClcclxuXHJcbiAgICAgIGxldCBzdGRvdXQgPSAnJ1xyXG4gICAgICBsZXQgc3RkZXJyID0gJydcclxuXHJcbiAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIChjaHVuaykgPT4gKHN0ZG91dCArPSBjaHVuaykpXHJcbiAgICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIChjaHVuaykgPT4gKHN0ZGVyciArPSBjaHVuaykpXHJcblxyXG4gICAgICBjaGlsZC5vbignY2xvc2UnLCAoY29kZSwgc2lnbmFsKSA9PiB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZXMuZGVsZXRlKGNoaWxkKVxyXG4gICAgICAgIGlmIChzaWduYWwpXHJcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihgUHJvY2VzcyBraWxsZWQgd2l0aCBzaWduYWwgJHtzaWduYWx9YCkpXHJcbiAgICAgICAgaWYgKGNvZGUgPT09IDApIHJlc29sdmUoc3Rkb3V0LnRyaW0oKSlcclxuICAgICAgICBlbHNlIHJlamVjdChuZXcgRXJyb3Ioc3RkZXJyIHx8IGBQcm9jZXNzIGV4aXRlZCB3aXRoIGNvZGUgJHtjb2RlfWApKVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9XHJcbiAgY2FuY2VsQWxsKCkge1xyXG4gICAgZm9yIChjb25zdCBwcm9jIG9mIHRoaXMucHJvY2Vzc2VzKSB7XHJcbiAgICAgIGlmICghcHJvYy5raWxsZWQpIHByb2Mua2lsbCgnU0lHS0lMTCcpXHJcbiAgICB9XHJcbiAgICB0aGlzLnByb2Nlc3Nlcy5jbGVhcigpXHJcbiAgfVxyXG4gIHByaXZhdGUgYXN5bmMgaXNQZGZTY2FubmVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3Rkb3V0ID0gYXdhaXQgdGhpcy5ydW5Db21tYW5kKCdwZGZ0b3RleHQnLCBbXHJcbiAgICAgICAgJy1mJyxcclxuICAgICAgICAnMScsXHJcbiAgICAgICAgJy1sJyxcclxuICAgICAgICAnMScsXHJcbiAgICAgICAgdGhpcy5maWxlUGF0aCxcclxuICAgICAgICAnLSdcclxuICAgICAgXSlcclxuICAgICAgcmV0dXJuIHN0ZG91dC5sZW5ndGggPCA1MFxyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcbiAgfVxyXG4gIHByaXZhdGUgYXN5bmMgZXh0cmFjdFRleHRGcm9tUGRmUGFnZShwYWdlTnVtYmVyOiBudW1iZXIpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIHRoaXMucnVuQ29tbWFuZCgncGRmdG90ZXh0JywgW1xyXG4gICAgICAnLWYnLFxyXG4gICAgICBTdHJpbmcocGFnZU51bWJlciksXHJcbiAgICAgICctbCcsXHJcbiAgICAgIFN0cmluZyhwYWdlTnVtYmVyKSxcclxuICAgICAgdGhpcy5maWxlUGF0aCxcclxuICAgICAgJy0nXHJcbiAgICBdKVxyXG4gIH1cclxuICBwcml2YXRlIGFzeW5jIGV4dHJhY3RUZXh0RnJvbVNjYW5uZWRQZGZQYWdlKFxyXG4gICAgcGFnZU51bWJlcjogbnVtYmVyXHJcbiAgKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGNvbnN0IGltYWdlUGF0aCA9IHBhdGguam9pbih0aGlzLnRlbXBEaXIsIGBwYWdlXyR7cGFnZU51bWJlcn0udGlmZmApXHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCB0aGlzLnJ1bkNvbW1hbmQoJ3BkZnRvY2Fpcm8nLCBbXHJcbiAgICAgICAgJy1yJyxcclxuICAgICAgICAnMzAwJyxcclxuICAgICAgICAnLXRpZmYnLFxyXG4gICAgICAgICctYW50aWFsaWFzJyxcclxuICAgICAgICAnYmVzdCcsXHJcbiAgICAgICAgJy1mJyxcclxuICAgICAgICBTdHJpbmcocGFnZU51bWJlciksXHJcbiAgICAgICAgJy1sJyxcclxuICAgICAgICBTdHJpbmcocGFnZU51bWJlciksXHJcbiAgICAgICAgdGhpcy5maWxlUGF0aCxcclxuICAgICAgICBgJHt0aGlzLnRlbXBEaXJ9L3BhZ2VgXHJcbiAgICAgIF0pXHJcbiAgICAgIGNvbnN0IGdlbmVyYXRlZEZpbGVzID0gZnNcclxuICAgICAgICAucmVhZGRpclN5bmModGhpcy50ZW1wRGlyKVxyXG4gICAgICAgIC5maWx0ZXIoKGYpID0+IGYuc3RhcnRzV2l0aCgncGFnZS0nKSAmJiBmLmVuZHNXaXRoKCcudGlmJykpXHJcbiAgICAgIGlmIChnZW5lcmF0ZWRGaWxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgY29uc3QgZ2VuZXJhdGVkUGF0aCA9IHBhdGguam9pbih0aGlzLnRlbXBEaXIsIGdlbmVyYXRlZEZpbGVzWzBdID8/ICcnKVxyXG4gICAgICAgIGZzLnJlbmFtZVN5bmMoZ2VuZXJhdGVkUGF0aCwgaW1hZ2VQYXRoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBzdGRvdXQgPSBhd2FpdCB0aGlzLnJ1bkNvbW1hbmQoJ3Rlc3NlcmFjdCcsIFtcclxuICAgICAgICBpbWFnZVBhdGgsXHJcbiAgICAgICAgJ3N0ZG91dCcsXHJcbiAgICAgICAgJy1sJyxcclxuICAgICAgICAnc3BhK2VuZycsXHJcbiAgICAgICAgJy0tb2VtJyxcclxuICAgICAgICAnMSdcclxuICAgICAgXSlcclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoaW1hZ2VQYXRoKSkgZnMudW5saW5rU3luYyhpbWFnZVBhdGgpXHJcbiAgICAgIHJldHVybiBzdGRvdXQudHJpbSgpXHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlcnIpXHJcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGltYWdlUGF0aCkpIGZzLnVubGlua1N5bmMoaW1hZ2VQYXRoKVxyXG4gICAgICB0aHJvdyBlcnJcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGdldFRvdGFsUGFnZXMoKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICAgIGNvbnN0IHN0ZG91dCA9IGF3YWl0IHRoaXMucnVuQ29tbWFuZCgncGRmaW5mbycsIFt0aGlzLmZpbGVQYXRoXSlcclxuICAgIGNvbnN0IG1hdGNoID0gc3Rkb3V0Lm1hdGNoKC9QYWdlczpcXHMrKFxcZCspLylcclxuICAgIHJldHVybiBtYXRjaCA/IHBhcnNlSW50KG1hdGNoWzFdID8/ICcxJykgOiAxXHJcbiAgfVxyXG4gIHByaXZhdGUgYXN5bmMgZXh0cmFjdEltYWdlVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgY29uc3QgaW1hZ2VQYXRoID0gdGhpcy5maWxlUGF0aFxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3Rkb3V0ID0gYXdhaXQgdGhpcy5ydW5Db21tYW5kKCd0ZXNzZXJhY3QnLCBbXHJcbiAgICAgICAgaW1hZ2VQYXRoLFxyXG4gICAgICAgICdzdGRvdXQnLFxyXG4gICAgICAgICctbCcsXHJcbiAgICAgICAgJ3NwYStlbmcnLFxyXG4gICAgICAgICctLXBzbScsXHJcbiAgICAgICAgJzMnXHJcbiAgICAgIF0pXHJcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGltYWdlUGF0aCkpIGZzLnVubGlua1N5bmMoaW1hZ2VQYXRoKVxyXG4gICAgICByZXR1cm4gc3Rkb3V0XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoaW1hZ2VQYXRoKSkgZnMudW5saW5rU3luYyhpbWFnZVBhdGgpXHJcbiAgICAgIHRocm93IGVyclxyXG4gICAgfVxyXG4gIH1cclxuICBhc3luYyBleHRyYWN0UGFnZVRleHQocGFnZU51bWJlcjogbnVtYmVyKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGlmIChpc0ltYWdlKHRoaXMuZmlsZVBhdGgpKSB7XHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmV4dHJhY3RJbWFnZVRleHQoKVxyXG4gICAgfVxyXG4gICAgaWYgKGF3YWl0IHRoaXMuaXNQZGZTY2FubmVkKCkpIHtcclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZXh0cmFjdFRleHRGcm9tU2Nhbm5lZFBkZlBhZ2UocGFnZU51bWJlcilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmV4dHJhY3RUZXh0RnJvbVBkZlBhZ2UocGFnZU51bWJlcilcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGlzSW1hZ2UgPSAoZmlsZVBhdGg6IHN0cmluZykgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBmaWxlUGF0aC5lbmRzV2l0aCgnLnBuZycpIHx8XHJcbiAgICBmaWxlUGF0aC5lbmRzV2l0aCgnLmpwZycpIHx8XHJcbiAgICBmaWxlUGF0aC5lbmRzV2l0aCgnLmpwZWcnKSB8fFxyXG4gICAgZmlsZVBhdGguZW5kc1dpdGgoJy50aWZmJylcclxuICApXHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7O0FBQUEsU0FBUyxhQUFnQztBQUN6QyxTQUFTLGtCQUFrQjtBQUMzQixTQUFTLFlBQVksaUJBQWlCO0FBQ3RDLFNBQVMsY0FBYztBQUN2QixPQUFPLFFBQVEsWUFBWTtBQUMzQixPQUFPLFFBQVE7QUFFUixJQUFNLGFBQU4sTUFBaUI7QUFBQSxFQUN0QjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQSxZQUFZLFVBQWtCO0FBQzVCLFNBQUssV0FBVztBQUNoQixTQUFLLFVBQVUsS0FBSyxPQUFPLEdBQUcsV0FBVyxXQUFXLENBQUMsRUFBRTtBQUN2RCxRQUFJLENBQUMsV0FBVyxLQUFLLE9BQU8sR0FBRztBQUM3QixnQkFBVSxLQUFLLFNBQVMsRUFBRSxXQUFXLEtBQUssQ0FBQztBQUFBLElBQzdDO0FBQ0EsU0FBSyxZQUFZLG9CQUFJLElBQUk7QUFBQSxFQUMzQjtBQUFBLEVBRVEsV0FBVyxLQUFhLE1BQWlDO0FBQy9ELFdBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQ3RDLFlBQU0sUUFBUSxNQUFNLEtBQUssSUFBSTtBQUM3QixXQUFLLFVBQVUsSUFBSSxLQUFLO0FBRXhCLFVBQUksU0FBUztBQUNiLFVBQUksU0FBUztBQUViLFlBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxVQUFXLFVBQVUsS0FBTTtBQUNwRCxZQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsVUFBVyxVQUFVLEtBQU07QUFFcEQsWUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLFdBQVc7QUFDbEMsYUFBSyxVQUFVLE9BQU8sS0FBSztBQUMzQixZQUFJO0FBQ0YsaUJBQU8sT0FBTyxJQUFJLE1BQU0sOEJBQThCLE1BQU0sRUFBRSxDQUFDO0FBQ2pFLFlBQUksU0FBUyxFQUFHLFNBQVEsT0FBTyxLQUFLLENBQUM7QUFBQSxZQUNoQyxRQUFPLElBQUksTUFBTSxVQUFVLDRCQUE0QixJQUFJLEVBQUUsQ0FBQztBQUFBLE1BQ3JFLENBQUM7QUFBQSxJQUNILENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxZQUFZO0FBQ1YsZUFBVyxRQUFRLEtBQUssV0FBVztBQUNqQyxVQUFJLENBQUMsS0FBSyxPQUFRLE1BQUssS0FBSyxTQUFTO0FBQUEsSUFDdkM7QUFDQSxTQUFLLFVBQVUsTUFBTTtBQUFBLEVBQ3ZCO0FBQUEsRUFDQSxNQUFjLGVBQWlDO0FBQzdDLFFBQUk7QUFDRixZQUFNLFNBQVMsTUFBTSxLQUFLLFdBQVcsYUFBYTtBQUFBLFFBQ2hEO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQSxLQUFLO0FBQUEsUUFDTDtBQUFBLE1BQ0YsQ0FBQztBQUNELGFBQU8sT0FBTyxTQUFTO0FBQUEsSUFDekIsUUFBUTtBQUNOLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBYyx1QkFBdUIsWUFBcUM7QUFDeEUsV0FBTyxLQUFLLFdBQVcsYUFBYTtBQUFBLE1BQ2xDO0FBQUEsTUFDQSxPQUFPLFVBQVU7QUFBQSxNQUNqQjtBQUFBLE1BQ0EsT0FBTyxVQUFVO0FBQUEsTUFDakIsS0FBSztBQUFBLE1BQ0w7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxNQUFjLDhCQUNaLFlBQ2lCO0FBQ2pCLFVBQU0sWUFBWSxLQUFLLEtBQUssS0FBSyxTQUFTLFFBQVEsVUFBVSxPQUFPO0FBQ25FLFFBQUk7QUFDRixZQUFNLEtBQUssV0FBVyxjQUFjO0FBQUEsUUFDbEM7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0EsT0FBTyxVQUFVO0FBQUEsUUFDakI7QUFBQSxRQUNBLE9BQU8sVUFBVTtBQUFBLFFBQ2pCLEtBQUs7QUFBQSxRQUNMLEdBQUcsS0FBSyxPQUFPO0FBQUEsTUFDakIsQ0FBQztBQUNELFlBQU0saUJBQWlCLEdBQ3BCLFlBQVksS0FBSyxPQUFPLEVBQ3hCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsV0FBVyxPQUFPLEtBQUssRUFBRSxTQUFTLE1BQU0sQ0FBQztBQUM1RCxVQUFJLGVBQWUsU0FBUyxHQUFHO0FBQzdCLGNBQU0sZ0JBQWdCLEtBQUssS0FBSyxLQUFLLFNBQVMsZUFBZSxDQUFDLEtBQUssRUFBRTtBQUNyRSxXQUFHLFdBQVcsZUFBZSxTQUFTO0FBQUEsTUFDeEM7QUFFQSxZQUFNLFNBQVMsTUFBTSxLQUFLLFdBQVcsYUFBYTtBQUFBLFFBQ2hEO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGLENBQUM7QUFDRCxVQUFJLEdBQUcsV0FBVyxTQUFTLEVBQUcsSUFBRyxXQUFXLFNBQVM7QUFDckQsYUFBTyxPQUFPLEtBQUs7QUFBQSxJQUNyQixTQUFTLEtBQUs7QUFDWixjQUFRLE1BQU0sR0FBRztBQUNqQixVQUFJLEdBQUcsV0FBVyxTQUFTLEVBQUcsSUFBRyxXQUFXLFNBQVM7QUFDckQsWUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUEsRUFFQSxNQUFNLGdCQUFpQztBQUNyQyxVQUFNLFNBQVMsTUFBTSxLQUFLLFdBQVcsV0FBVyxDQUFDLEtBQUssUUFBUSxDQUFDO0FBQy9ELFVBQU0sUUFBUSxPQUFPLE1BQU0sZ0JBQWdCO0FBQzNDLFdBQU8sUUFBUSxTQUFTLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSTtBQUFBLEVBQzdDO0FBQUEsRUFDQSxNQUFjLG1CQUFvQztBQUNoRCxVQUFNLFlBQVksS0FBSztBQUN2QixRQUFJO0FBQ0YsWUFBTSxTQUFTLE1BQU0sS0FBSyxXQUFXLGFBQWE7QUFBQSxRQUNoRDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRixDQUFDO0FBQ0QsVUFBSSxHQUFHLFdBQVcsU0FBUyxFQUFHLElBQUcsV0FBVyxTQUFTO0FBQ3JELGFBQU87QUFBQSxJQUNULFNBQVMsS0FBSztBQUNaLFVBQUksR0FBRyxXQUFXLFNBQVMsRUFBRyxJQUFHLFdBQVcsU0FBUztBQUNyRCxZQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU0sZ0JBQWdCLFlBQXFDO0FBQ3pELFFBQUksUUFBUSxLQUFLLFFBQVEsR0FBRztBQUMxQixhQUFPLE1BQU0sS0FBSyxpQkFBaUI7QUFBQSxJQUNyQztBQUNBLFFBQUksTUFBTSxLQUFLLGFBQWEsR0FBRztBQUM3QixhQUFPLE1BQU0sS0FBSyw4QkFBOEIsVUFBVTtBQUFBLElBQzVELE9BQU87QUFDTCxhQUFPLE1BQU0sS0FBSyx1QkFBdUIsVUFBVTtBQUFBLElBQ3JEO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTSxVQUFVLENBQUMsYUFBcUI7QUFDcEMsU0FDRSxTQUFTLFNBQVMsTUFBTSxLQUN4QixTQUFTLFNBQVMsTUFBTSxLQUN4QixTQUFTLFNBQVMsT0FBTyxLQUN6QixTQUFTLFNBQVMsT0FBTztBQUU3QjsiLAogICJuYW1lcyI6IFtdCn0K
