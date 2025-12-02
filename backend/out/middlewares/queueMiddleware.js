import { createRequire } from "node:module"; const require = createRequire(import.meta.url);

// src/service/SseEmitter.ts
var SseEmitter = class {
  res;
  closed = false;
  constructor(res) {
    this.res = res;
  }
  init(headers = {}) {
    const defaultHeaders = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "X-Accel-Buffering": "no"
    };
    this.res.writeHead(200, { ...defaultHeaders, ...headers });
    if (typeof this.res.flushHeaders === "function") {
      ;
      this.res.flushHeaders();
    }
  }
  send(event) {
    if (this.closed) return;
    try {
      this.res.write(`data: ${JSON.stringify(event)}

`);
    } catch (err) {
      console.warn("SSE write failed, marking closed", err.message);
      this.closed = true;
    }
  }
  end() {
    if (this.closed) return;
    try {
      this.res.end();
    } catch (err) {
    } finally {
      this.closed = true;
    }
  }
};

// src/middlewares/queueMiddleware.ts
var ProcessQueue = class {
  queue = [];
  running = 0;
  maxConcurrent;
  maxQueue;
  constructor(maxConcurrent, maxQueue) {
    this.maxConcurrent = maxConcurrent;
    this.maxQueue = maxQueue;
  }
  add(req, res, next) {
    const emitter = new SseEmitter(res);
    emitter.init();
    if (this.queue.length >= this.maxQueue) {
      emitter.send({
        type: "error",
        error: "El sistema est\xE1 ocupado. Por favor, intente nuevamente m\xE1s tarde."
      });
      emitter.end();
      return;
    }
    const task = { req, res, next, emitter };
    this.queue.push(task);
    const position = this.getPosition(task);
    if (position > 0) {
      emitter.send({
        type: "queue",
        status: "waiting",
        position
      });
      task.interval = setInterval(() => {
        const currentPos = this.getPosition(task);
        if (currentPos > 0 && !emitter.closed) {
          emitter.send({
            type: "queue",
            status: "waiting",
            position: currentPos
          });
        }
      }, 3e3);
    }
    this.runNext();
  }
  runNext() {
    if (this.running >= this.maxConcurrent) return;
    const task = this.queue.shift();
    if (!task) return;
    if (task.interval) clearInterval(task.interval);
    this.running++;
    const { req, res, next, emitter } = task;
    emitter.send({
      type: "queue",
      status: "started",
      position: 0
    });
    const release = () => {
      this.running--;
      res.removeListener("close", release);
      res.removeListener("finish", release);
      this.runNext();
    };
    res.on("close", release);
    res.on("finish", release);
    next();
  }
  // 🔹 Calcula la posición actual de un cliente en la cola
  getPosition(task) {
    const index = this.queue.indexOf(task);
    if (index === -1) return 0;
    return index + 1;
  }
};
var sseQueue = new ProcessQueue(2, 2);
var queueMiddleware = (req, res, next) => {
  sseQueue.add(req, res, next);
};
export {
  ProcessQueue,
  queueMiddleware
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3NlcnZpY2UvU3NlRW1pdHRlci50cyIsICIuLi8uLi9zcmMvbWlkZGxld2FyZXMvcXVldWVNaWRkbGV3YXJlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgdHlwZSB7IFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcydcclxuZXhwb3J0IGNsYXNzIFNzZUVtaXR0ZXIge1xyXG4gIHJlczogUmVzcG9uc2VcclxuICBjbG9zZWQgPSBmYWxzZVxyXG4gIGNvbnN0cnVjdG9yKHJlczogUmVzcG9uc2UpIHtcclxuICAgIHRoaXMucmVzID0gcmVzXHJcbiAgfVxyXG4gIGluaXQoaGVhZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9KSB7XHJcbiAgICAvLyBDYWJlY2VyYXMgU1NFIHJlY29tZW5kYWRhcyAocHJveHktZnJpZW5kbHkpXHJcbiAgICBjb25zdCBkZWZhdWx0SGVhZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcclxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L2V2ZW50LXN0cmVhbScsXHJcbiAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlLCBuby10cmFuc2Zvcm0nLFxyXG4gICAgICBDb25uZWN0aW9uOiAna2VlcC1hbGl2ZScsXHJcbiAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXHJcbiAgICAgICdYLUFjY2VsLUJ1ZmZlcmluZyc6ICdubydcclxuICAgIH1cclxuICAgIHRoaXMucmVzLndyaXRlSGVhZCgyMDAsIHsgLi4uZGVmYXVsdEhlYWRlcnMsIC4uLmhlYWRlcnMgfSlcclxuICAgIC8vIEdhcmFudGl6YSBxdWUgbG9zIGhlYWRlcnMgc2FsZ2FuIGFsIGNsaWVudGUgZGUgaW5tZWRpYXRvXHJcbiAgICBpZiAodHlwZW9mICh0aGlzLnJlcyBhcyBhbnkpLmZsdXNoSGVhZGVycyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICA7KHRoaXMucmVzIGFzIGFueSkuZmx1c2hIZWFkZXJzKClcclxuICAgIH1cclxuICB9XHJcbiAgc2VuZChldmVudDogU1NFRXZlbnQpIHtcclxuICAgIGlmICh0aGlzLmNsb3NlZCkgcmV0dXJuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLnJlcy53cml0ZShgZGF0YTogJHtKU09OLnN0cmluZ2lmeShldmVudCl9XFxuXFxuYClcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1NTRSB3cml0ZSBmYWlsZWQsIG1hcmtpbmcgY2xvc2VkJywgKGVyciBhcyBFcnJvcikubWVzc2FnZSlcclxuICAgICAgdGhpcy5jbG9zZWQgPSB0cnVlXHJcbiAgICB9XHJcbiAgfVxyXG4gIGVuZCgpIHtcclxuICAgIGlmICh0aGlzLmNsb3NlZCkgcmV0dXJuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLnJlcy5lbmQoKVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIC8vIGlnbm9yZVxyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5jbG9zZWQgPSB0cnVlXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsICJpbXBvcnQgdHlwZSB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdleHByZXNzJ1xyXG5pbXBvcnQgeyBTc2VFbWl0dGVyIH0gZnJvbSAnLi4vc2VydmljZS9Tc2VFbWl0dGVyLmpzJ1xyXG5cclxudHlwZSBUYXNrID0ge1xyXG4gIHJlcTogUmVxdWVzdFxyXG4gIHJlczogUmVzcG9uc2VcclxuICBuZXh0OiBOZXh0RnVuY3Rpb25cclxuICBlbWl0dGVyOiBTc2VFbWl0dGVyXHJcbiAgaW50ZXJ2YWw/OiBOb2RlSlMuVGltZW91dFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvY2Vzc1F1ZXVlIHtcclxuICBwcml2YXRlIHF1ZXVlOiBUYXNrW10gPSBbXVxyXG4gIHByaXZhdGUgcnVubmluZyA9IDBcclxuICBwcml2YXRlIHJlYWRvbmx5IG1heENvbmN1cnJlbnQ6IG51bWJlclxyXG4gIHByaXZhdGUgcmVhZG9ubHkgbWF4UXVldWU6IG51bWJlclxyXG5cclxuICBjb25zdHJ1Y3RvcihtYXhDb25jdXJyZW50OiBudW1iZXIsIG1heFF1ZXVlOiBudW1iZXIpIHtcclxuICAgIHRoaXMubWF4Q29uY3VycmVudCA9IG1heENvbmN1cnJlbnRcclxuICAgIHRoaXMubWF4UXVldWUgPSBtYXhRdWV1ZVxyXG4gIH1cclxuXHJcbiAgYWRkKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICBjb25zdCBlbWl0dGVyID0gbmV3IFNzZUVtaXR0ZXIocmVzKVxyXG4gICAgZW1pdHRlci5pbml0KClcclxuXHJcbiAgICAvLyBcdUQ4M0RcdUREMzkgU2kgeWEgaGF5IGRlbWFzaWFkb3MgZW4gZXNwZXJhLCByZWNoYXphbW9zIGVsIGluZ3Jlc29cclxuICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA+PSB0aGlzLm1heFF1ZXVlKSB7XHJcbiAgICAgIGVtaXR0ZXIuc2VuZCh7XHJcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcclxuICAgICAgICBlcnJvcjogJ0VsIHNpc3RlbWEgZXN0XHUwMEUxIG9jdXBhZG8uIFBvciBmYXZvciwgaW50ZW50ZSBudWV2YW1lbnRlIG1cdTAwRTFzIHRhcmRlLidcclxuICAgICAgfSlcclxuICAgICAgZW1pdHRlci5lbmQoKVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0YXNrOiBUYXNrID0geyByZXEsIHJlcywgbmV4dCwgZW1pdHRlciB9XHJcbiAgICB0aGlzLnF1ZXVlLnB1c2godGFzaylcclxuXHJcbiAgICAvLyBcdUQ4M0RcdUREMzkgU2kgZXN0XHUwMEUxIGVuIGVzcGVyYSwgbm90aWZpY2FyIHBvc2ljaVx1MDBGM24gZGluXHUwMEUxbWljYVxyXG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uKHRhc2spXHJcbiAgICBpZiAocG9zaXRpb24gPiAwKSB7XHJcbiAgICAgIGVtaXR0ZXIuc2VuZCh7XHJcbiAgICAgICAgdHlwZTogJ3F1ZXVlJyxcclxuICAgICAgICBzdGF0dXM6ICd3YWl0aW5nJyxcclxuICAgICAgICBwb3NpdGlvblxyXG4gICAgICB9KVxyXG5cclxuICAgICAgLy8gSW50ZXJ2YWxvIGluZGl2aWR1YWw6IGFjdHVhbGl6YSBwb3NpY2lcdTAwRjNuIGNhZGEgMyBzZWd1bmRvc1xyXG4gICAgICB0YXNrLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRQb3MgPSB0aGlzLmdldFBvc2l0aW9uKHRhc2spXHJcbiAgICAgICAgaWYgKGN1cnJlbnRQb3MgPiAwICYmICFlbWl0dGVyLmNsb3NlZCkge1xyXG4gICAgICAgICAgZW1pdHRlci5zZW5kKHtcclxuICAgICAgICAgICAgdHlwZTogJ3F1ZXVlJyxcclxuICAgICAgICAgICAgc3RhdHVzOiAnd2FpdGluZycsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBjdXJyZW50UG9zXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgMzAwMClcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJ1bk5leHQoKVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBydW5OZXh0KCkge1xyXG4gICAgLy8gU2kgbm8gaGF5IHNsb3RzIGxpYnJlcywgbm8gaGFjZW1vcyBuYWRhXHJcbiAgICBpZiAodGhpcy5ydW5uaW5nID49IHRoaXMubWF4Q29uY3VycmVudCkgcmV0dXJuXHJcbiAgICBjb25zdCB0YXNrID0gdGhpcy5xdWV1ZS5zaGlmdCgpXHJcbiAgICBpZiAoIXRhc2spIHJldHVyblxyXG5cclxuICAgIC8vIFx1RDgzRFx1REQzOSBEZXRlbmVyIHN1IGludGVydmFsbyBkZSBlc3BlcmFcclxuICAgIGlmICh0YXNrLmludGVydmFsKSBjbGVhckludGVydmFsKHRhc2suaW50ZXJ2YWwpXHJcblxyXG4gICAgdGhpcy5ydW5uaW5nKytcclxuICAgIGNvbnN0IHsgcmVxLCByZXMsIG5leHQsIGVtaXR0ZXIgfSA9IHRhc2tcclxuXHJcbiAgICBlbWl0dGVyLnNlbmQoe1xyXG4gICAgICB0eXBlOiAncXVldWUnLFxyXG4gICAgICBzdGF0dXM6ICdzdGFydGVkJyxcclxuICAgICAgcG9zaXRpb246IDBcclxuICAgIH0pXHJcblxyXG4gICAgLy8gXHVEODNEXHVERDM5IEN1YW5kbyB0ZXJtaW5hIG8gc2UgY2llcnJhIGxhIGNvbmV4aVx1MDBGM24sIGxpYmVyYW1vcyBlbCBzbG90XHJcbiAgICBjb25zdCByZWxlYXNlID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLnJ1bm5pbmctLVxyXG4gICAgICByZXMucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgcmVsZWFzZSlcclxuICAgICAgcmVzLnJlbW92ZUxpc3RlbmVyKCdmaW5pc2gnLCByZWxlYXNlKVxyXG4gICAgICB0aGlzLnJ1bk5leHQoKVxyXG4gICAgfVxyXG5cclxuICAgIHJlcy5vbignY2xvc2UnLCByZWxlYXNlKVxyXG4gICAgcmVzLm9uKCdmaW5pc2gnLCByZWxlYXNlKVxyXG5cclxuICAgIG5leHQoKVxyXG4gIH1cclxuXHJcbiAgLy8gXHVEODNEXHVERDM5IENhbGN1bGEgbGEgcG9zaWNpXHUwMEYzbiBhY3R1YWwgZGUgdW4gY2xpZW50ZSBlbiBsYSBjb2xhXHJcbiAgcHJpdmF0ZSBnZXRQb3NpdGlvbih0YXNrOiBUYXNrKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5xdWV1ZS5pbmRleE9mKHRhc2spXHJcbiAgICAvLyBTaSBlc3RcdTAwRTEgZW4gZWplY3VjaVx1MDBGM24sIHBvc2ljaVx1MDBGM24gMFxyXG4gICAgaWYgKGluZGV4ID09PSAtMSkgcmV0dXJuIDBcclxuICAgIC8vIFNpIGVzdFx1MDBFMSBlbiBjb2xhLCBzdSBwb3NpY2lcdTAwRjNuIGVzIChpbmRleCArIDEpXHJcbiAgICByZXR1cm4gaW5kZXggKyAxXHJcbiAgfVxyXG59XHJcblxyXG4vLyBDb25maWd1cmFjaVx1MDBGM246IG1cdTAwRTF4aW1vIDIgZW4gcHJvY2VzbywgbVx1MDBFMXhpbW8gMiBlc3BlcmFuZG9cclxuY29uc3Qgc3NlUXVldWUgPSBuZXcgUHJvY2Vzc1F1ZXVlKDIsIDIpXHJcblxyXG5leHBvcnQgY29uc3QgcXVldWVNaWRkbGV3YXJlID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgc3NlUXVldWUuYWRkKHJlcSwgcmVzLCBuZXh0KVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7OztBQUNPLElBQU0sYUFBTixNQUFpQjtBQUFBLEVBQ3RCO0FBQUEsRUFDQSxTQUFTO0FBQUEsRUFDVCxZQUFZLEtBQWU7QUFDekIsU0FBSyxNQUFNO0FBQUEsRUFDYjtBQUFBLEVBQ0EsS0FBSyxVQUFrQyxDQUFDLEdBQUc7QUFFekMsVUFBTSxpQkFBeUM7QUFBQSxNQUM3QyxnQkFBZ0I7QUFBQSxNQUNoQixpQkFBaUI7QUFBQSxNQUNqQixZQUFZO0FBQUEsTUFDWiwrQkFBK0I7QUFBQSxNQUMvQixxQkFBcUI7QUFBQSxJQUN2QjtBQUNBLFNBQUssSUFBSSxVQUFVLEtBQUssRUFBRSxHQUFHLGdCQUFnQixHQUFHLFFBQVEsQ0FBQztBQUV6RCxRQUFJLE9BQVEsS0FBSyxJQUFZLGlCQUFpQixZQUFZO0FBQ3hEO0FBQUMsTUFBQyxLQUFLLElBQVksYUFBYTtBQUFBLElBQ2xDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsS0FBSyxPQUFpQjtBQUNwQixRQUFJLEtBQUssT0FBUTtBQUNqQixRQUFJO0FBQ0YsV0FBSyxJQUFJLE1BQU0sU0FBUyxLQUFLLFVBQVUsS0FBSyxDQUFDO0FBQUE7QUFBQSxDQUFNO0FBQUEsSUFDckQsU0FBUyxLQUFLO0FBQ1osY0FBUSxLQUFLLG9DQUFxQyxJQUFjLE9BQU87QUFDdkUsV0FBSyxTQUFTO0FBQUEsSUFDaEI7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQ0os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
