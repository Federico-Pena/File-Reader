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
export {
  SseEmitter
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3NlcnZpY2UvU3NlRW1pdHRlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHR5cGUgeyBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnXHJcbmV4cG9ydCBjbGFzcyBTc2VFbWl0dGVyIHtcclxuICByZXM6IFJlc3BvbnNlXHJcbiAgY2xvc2VkID0gZmFsc2VcclxuICBjb25zdHJ1Y3RvcihyZXM6IFJlc3BvbnNlKSB7XHJcbiAgICB0aGlzLnJlcyA9IHJlc1xyXG4gIH1cclxuICBpbml0KGhlYWRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fSkge1xyXG4gICAgLy8gQ2FiZWNlcmFzIFNTRSByZWNvbWVuZGFkYXMgKHByb3h5LWZyaWVuZGx5KVxyXG4gICAgY29uc3QgZGVmYXVsdEhlYWRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XHJcbiAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9ldmVudC1zdHJlYW0nLFxyXG4gICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZSwgbm8tdHJhbnNmb3JtJyxcclxuICAgICAgQ29ubmVjdGlvbjogJ2tlZXAtYWxpdmUnLFxyXG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxyXG4gICAgICAnWC1BY2NlbC1CdWZmZXJpbmcnOiAnbm8nXHJcbiAgICB9XHJcbiAgICB0aGlzLnJlcy53cml0ZUhlYWQoMjAwLCB7IC4uLmRlZmF1bHRIZWFkZXJzLCAuLi5oZWFkZXJzIH0pXHJcbiAgICAvLyBHYXJhbnRpemEgcXVlIGxvcyBoZWFkZXJzIHNhbGdhbiBhbCBjbGllbnRlIGRlIGlubWVkaWF0b1xyXG4gICAgaWYgKHR5cGVvZiAodGhpcy5yZXMgYXMgYW55KS5mbHVzaEhlYWRlcnMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgOyh0aGlzLnJlcyBhcyBhbnkpLmZsdXNoSGVhZGVycygpXHJcbiAgICB9XHJcbiAgfVxyXG4gIHNlbmQoZXZlbnQ6IFNTRUV2ZW50KSB7XHJcbiAgICBpZiAodGhpcy5jbG9zZWQpIHJldHVyblxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5yZXMud3JpdGUoYGRhdGE6ICR7SlNPTi5zdHJpbmdpZnkoZXZlbnQpfVxcblxcbmApXHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdTU0Ugd3JpdGUgZmFpbGVkLCBtYXJraW5nIGNsb3NlZCcsIChlcnIgYXMgRXJyb3IpLm1lc3NhZ2UpXHJcbiAgICAgIHRoaXMuY2xvc2VkID0gdHJ1ZVxyXG4gICAgfVxyXG4gIH1cclxuICBlbmQoKSB7XHJcbiAgICBpZiAodGhpcy5jbG9zZWQpIHJldHVyblxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5yZXMuZW5kKClcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAvLyBpZ25vcmVcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMuY2xvc2VkID0gdHJ1ZVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7QUFDTyxJQUFNLGFBQU4sTUFBaUI7QUFBQSxFQUN0QjtBQUFBLEVBQ0EsU0FBUztBQUFBLEVBQ1QsWUFBWSxLQUFlO0FBQ3pCLFNBQUssTUFBTTtBQUFBLEVBQ2I7QUFBQSxFQUNBLEtBQUssVUFBa0MsQ0FBQyxHQUFHO0FBRXpDLFVBQU0saUJBQXlDO0FBQUEsTUFDN0MsZ0JBQWdCO0FBQUEsTUFDaEIsaUJBQWlCO0FBQUEsTUFDakIsWUFBWTtBQUFBLE1BQ1osK0JBQStCO0FBQUEsTUFDL0IscUJBQXFCO0FBQUEsSUFDdkI7QUFDQSxTQUFLLElBQUksVUFBVSxLQUFLLEVBQUUsR0FBRyxnQkFBZ0IsR0FBRyxRQUFRLENBQUM7QUFFekQsUUFBSSxPQUFRLEtBQUssSUFBWSxpQkFBaUIsWUFBWTtBQUN4RDtBQUFDLE1BQUMsS0FBSyxJQUFZLGFBQWE7QUFBQSxJQUNsQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLEtBQUssT0FBaUI7QUFDcEIsUUFBSSxLQUFLLE9BQVE7QUFDakIsUUFBSTtBQUNGLFdBQUssSUFBSSxNQUFNLFNBQVMsS0FBSyxVQUFVLEtBQUssQ0FBQztBQUFBO0FBQUEsQ0FBTTtBQUFBLElBQ3JELFNBQVMsS0FBSztBQUNaLGNBQVEsS0FBSyxvQ0FBcUMsSUFBYyxPQUFPO0FBQ3ZFLFdBQUssU0FBUztBQUFBLElBQ2hCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUNKLFFBQUksS0FBSyxPQUFRO0FBQ2pCLFFBQUk7QUFDRixXQUFLLElBQUksSUFBSTtBQUFBLElBQ2YsU0FBUyxLQUFLO0FBQUEsSUFFZCxVQUFFO0FBQ0EsV0FBSyxTQUFTO0FBQUEsSUFDaEI7QUFBQSxFQUNGO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
