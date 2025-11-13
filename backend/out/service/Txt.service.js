import { createRequire } from "node:module"; const require = createRequire(import.meta.url);

// src/service/Txt.service.ts
import fs from "node:fs/promises";

// src/service/TextPaginator.ts
var TextPaginator = class {
  constructor(text, maxChars = 2e3) {
    this.text = text;
    this.maxChars = maxChars;
    this.paginate();
  }
  pages = [];
  paginate() {
    let buffer = "";
    const sentences = this.text.split(/(?<=[.!?])\s+/);
    for (const sentence of sentences) {
      if ((buffer + sentence).length > this.maxChars) {
        this.pages.push(buffer.trim());
        buffer = "";
      }
      buffer += sentence + " ";
    }
    if (buffer.trim().length > 0) {
      this.pages.push(buffer.trim());
    }
  }
  getPage(pageNumber) {
    return this.pages[pageNumber - 1] || "";
  }
  getTotalPages() {
    return this.pages.length;
  }
};

// src/service/Txt.service.ts
var TxtService = class {
  constructor(filePath) {
    this.filePath = filePath;
  }
  paginator = null;
  async ensurePaginator() {
    if (!this.paginator) {
      const content = await fs.readFile(this.filePath, "utf8");
      this.paginator = new TextPaginator(content, 2e3);
    }
  }
  async getTotalPages() {
    await this.ensurePaginator();
    return this.paginator.getTotalPages();
  }
  async extractPageText(pageNumber) {
    await this.ensurePaginator();
    return this.paginator.getPage(pageNumber);
  }
};
export {
  TxtService
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3NlcnZpY2UvVHh0LnNlcnZpY2UudHMiLCAiLi4vLi4vc3JjL3NlcnZpY2UvVGV4dFBhZ2luYXRvci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMvcHJvbWlzZXMnXHJcbmltcG9ydCB7IFRleHRQYWdpbmF0b3IgfSBmcm9tICcuL1RleHRQYWdpbmF0b3InXHJcblxyXG5leHBvcnQgY2xhc3MgVHh0U2VydmljZSBpbXBsZW1lbnRzIElGaWxlUHJvY2Vzc29yIHtcclxuICBwcml2YXRlIHBhZ2luYXRvcjogVGV4dFBhZ2luYXRvciB8IG51bGwgPSBudWxsXHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZmlsZVBhdGg6IHN0cmluZykge31cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBlbnN1cmVQYWdpbmF0b3IoKSB7XHJcbiAgICBpZiAoIXRoaXMucGFnaW5hdG9yKSB7XHJcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBmcy5yZWFkRmlsZSh0aGlzLmZpbGVQYXRoLCAndXRmOCcpXHJcbiAgICAgIHRoaXMucGFnaW5hdG9yID0gbmV3IFRleHRQYWdpbmF0b3IoY29udGVudCwgMjAwMCkgLy8gMjAwMCBjaGFycyBwb3IgcFx1MDBFMWdpbmFcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGdldFRvdGFsUGFnZXMoKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICAgIGF3YWl0IHRoaXMuZW5zdXJlUGFnaW5hdG9yKClcclxuICAgIHJldHVybiB0aGlzLnBhZ2luYXRvciEuZ2V0VG90YWxQYWdlcygpXHJcbiAgfVxyXG5cclxuICBhc3luYyBleHRyYWN0UGFnZVRleHQocGFnZU51bWJlcjogbnVtYmVyKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGF3YWl0IHRoaXMuZW5zdXJlUGFnaW5hdG9yKClcclxuICAgIHJldHVybiB0aGlzLnBhZ2luYXRvciEuZ2V0UGFnZShwYWdlTnVtYmVyKVxyXG4gIH1cclxufVxyXG4iLCAiZXhwb3J0IGNsYXNzIFRleHRQYWdpbmF0b3Ige1xyXG4gIHByaXZhdGUgcGFnZXM6IHN0cmluZ1tdID0gW11cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSB0ZXh0OiBzdHJpbmcsIHByaXZhdGUgbWF4Q2hhcnMgPSAyMDAwKSB7XHJcbiAgICB0aGlzLnBhZ2luYXRlKClcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcGFnaW5hdGUoKSB7XHJcbiAgICBsZXQgYnVmZmVyID0gJydcclxuICAgIGNvbnN0IHNlbnRlbmNlcyA9IHRoaXMudGV4dC5zcGxpdCgvKD88PVsuIT9dKVxccysvKVxyXG5cclxuICAgIGZvciAoY29uc3Qgc2VudGVuY2Ugb2Ygc2VudGVuY2VzKSB7XHJcbiAgICAgIGlmICgoYnVmZmVyICsgc2VudGVuY2UpLmxlbmd0aCA+IHRoaXMubWF4Q2hhcnMpIHtcclxuICAgICAgICB0aGlzLnBhZ2VzLnB1c2goYnVmZmVyLnRyaW0oKSlcclxuICAgICAgICBidWZmZXIgPSAnJ1xyXG4gICAgICB9XHJcbiAgICAgIGJ1ZmZlciArPSBzZW50ZW5jZSArICcgJ1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChidWZmZXIudHJpbSgpLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5wYWdlcy5wdXNoKGJ1ZmZlci50cmltKCkpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRQYWdlKHBhZ2VOdW1iZXI6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5wYWdlc1twYWdlTnVtYmVyIC0gMV0gfHwgJydcclxuICB9XHJcblxyXG4gIGdldFRvdGFsUGFnZXMoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLnBhZ2VzLmxlbmd0aFxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7QUFBQSxPQUFPLFFBQVE7OztBQ0FSLElBQU0sZ0JBQU4sTUFBb0I7QUFBQSxFQUd6QixZQUFvQixNQUFzQixXQUFXLEtBQU07QUFBdkM7QUFBc0I7QUFDeEMsU0FBSyxTQUFTO0FBQUEsRUFDaEI7QUFBQSxFQUpRLFFBQWtCLENBQUM7QUFBQSxFQU1uQixXQUFXO0FBQ2pCLFFBQUksU0FBUztBQUNiLFVBQU0sWUFBWSxLQUFLLEtBQUssTUFBTSxlQUFlO0FBRWpELGVBQVcsWUFBWSxXQUFXO0FBQ2hDLFdBQUssU0FBUyxVQUFVLFNBQVMsS0FBSyxVQUFVO0FBQzlDLGFBQUssTUFBTSxLQUFLLE9BQU8sS0FBSyxDQUFDO0FBQzdCLGlCQUFTO0FBQUEsTUFDWDtBQUNBLGdCQUFVLFdBQVc7QUFBQSxJQUN2QjtBQUVBLFFBQUksT0FBTyxLQUFLLEVBQUUsU0FBUyxHQUFHO0FBQzVCLFdBQUssTUFBTSxLQUFLLE9BQU8sS0FBSyxDQUFDO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFFQSxRQUFRLFlBQTRCO0FBQ2xDLFdBQU8sS0FBSyxNQUFNLGFBQWEsQ0FBQyxLQUFLO0FBQUEsRUFDdkM7QUFBQSxFQUVBLGdCQUF3QjtBQUN0QixXQUFPLEtBQUssTUFBTTtBQUFBLEVBQ3BCO0FBQ0Y7OztBRDVCTyxJQUFNLGFBQU4sTUFBMkM7QUFBQSxFQUdoRCxZQUFvQixVQUFrQjtBQUFsQjtBQUFBLEVBQW1CO0FBQUEsRUFGL0IsWUFBa0M7QUFBQSxFQUkxQyxNQUFjLGtCQUFrQjtBQUM5QixRQUFJLENBQUMsS0FBSyxXQUFXO0FBQ25CLFlBQU0sVUFBVSxNQUFNLEdBQUcsU0FBUyxLQUFLLFVBQVUsTUFBTTtBQUN2RCxXQUFLLFlBQVksSUFBSSxjQUFjLFNBQVMsR0FBSTtBQUFBLElBQ2xEO0FBQUEsRUFDRjtBQUFBLEVBRUEsTUFBTSxnQkFBaUM7QUFDckMsVUFBTSxLQUFLLGdCQUFnQjtBQUMzQixXQUFPLEtBQUssVUFBVyxjQUFjO0FBQUEsRUFDdkM7QUFBQSxFQUVBLE1BQU0sZ0JBQWdCLFlBQXFDO0FBQ3pELFVBQU0sS0FBSyxnQkFBZ0I7QUFDM0IsV0FBTyxLQUFLLFVBQVcsUUFBUSxVQUFVO0FBQUEsRUFDM0M7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
