import { createRequire } from "node:module"; const require = createRequire(import.meta.url);

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
export {
  TextPaginator
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3NlcnZpY2UvVGV4dFBhZ2luYXRvci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZXhwb3J0IGNsYXNzIFRleHRQYWdpbmF0b3Ige1xyXG4gIHByaXZhdGUgcGFnZXM6IHN0cmluZ1tdID0gW11cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSB0ZXh0OiBzdHJpbmcsIHByaXZhdGUgbWF4Q2hhcnMgPSAyMDAwKSB7XHJcbiAgICB0aGlzLnBhZ2luYXRlKClcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcGFnaW5hdGUoKSB7XHJcbiAgICBsZXQgYnVmZmVyID0gJydcclxuICAgIGNvbnN0IHNlbnRlbmNlcyA9IHRoaXMudGV4dC5zcGxpdCgvKD88PVsuIT9dKVxccysvKVxyXG5cclxuICAgIGZvciAoY29uc3Qgc2VudGVuY2Ugb2Ygc2VudGVuY2VzKSB7XHJcbiAgICAgIGlmICgoYnVmZmVyICsgc2VudGVuY2UpLmxlbmd0aCA+IHRoaXMubWF4Q2hhcnMpIHtcclxuICAgICAgICB0aGlzLnBhZ2VzLnB1c2goYnVmZmVyLnRyaW0oKSlcclxuICAgICAgICBidWZmZXIgPSAnJ1xyXG4gICAgICB9XHJcbiAgICAgIGJ1ZmZlciArPSBzZW50ZW5jZSArICcgJ1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChidWZmZXIudHJpbSgpLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5wYWdlcy5wdXNoKGJ1ZmZlci50cmltKCkpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRQYWdlKHBhZ2VOdW1iZXI6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5wYWdlc1twYWdlTnVtYmVyIC0gMV0gfHwgJydcclxuICB9XHJcblxyXG4gIGdldFRvdGFsUGFnZXMoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLnBhZ2VzLmxlbmd0aFxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7QUFBTyxJQUFNLGdCQUFOLE1BQW9CO0FBQUEsRUFHekIsWUFBb0IsTUFBc0IsV0FBVyxLQUFNO0FBQXZDO0FBQXNCO0FBQ3hDLFNBQUssU0FBUztBQUFBLEVBQ2hCO0FBQUEsRUFKUSxRQUFrQixDQUFDO0FBQUEsRUFNbkIsV0FBVztBQUNqQixRQUFJLFNBQVM7QUFDYixVQUFNLFlBQVksS0FBSyxLQUFLLE1BQU0sZUFBZTtBQUVqRCxlQUFXLFlBQVksV0FBVztBQUNoQyxXQUFLLFNBQVMsVUFBVSxTQUFTLEtBQUssVUFBVTtBQUM5QyxhQUFLLE1BQU0sS0FBSyxPQUFPLEtBQUssQ0FBQztBQUM3QixpQkFBUztBQUFBLE1BQ1g7QUFDQSxnQkFBVSxXQUFXO0FBQUEsSUFDdkI7QUFFQSxRQUFJLE9BQU8sS0FBSyxFQUFFLFNBQVMsR0FBRztBQUM1QixXQUFLLE1BQU0sS0FBSyxPQUFPLEtBQUssQ0FBQztBQUFBLElBQy9CO0FBQUEsRUFDRjtBQUFBLEVBRUEsUUFBUSxZQUE0QjtBQUNsQyxXQUFPLEtBQUssTUFBTSxhQUFhLENBQUMsS0FBSztBQUFBLEVBQ3ZDO0FBQUEsRUFFQSxnQkFBd0I7QUFDdEIsV0FBTyxLQUFLLE1BQU07QUFBQSxFQUNwQjtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
