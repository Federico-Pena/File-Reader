import { createRequire } from "node:module"; const require = createRequire(import.meta.url);

// src/service/tokenizeInline.ts
var regexes = {
  link: /\bhttps?:\/\/[^\s/$.?#].[^\s]*/gi,
  wwwLink: /\bwww\.[^\s/$.?#].[^\s]*/gi,
  email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  quote: /("[^"]+"[\.,]?)/g,
  code: /`([^`]+)`/g,
  date: /\b\d{1,2}([-/])\d{1,2}\1\d{2,4}\b/g,
  currency: /(\$|€|£)\s?\d+(?:[.,]\d+)?/g,
  number: /\b\s(\d+)\s\b/g
};
var tokenizeInline = (blockInlineTokens) => {
  const tokens = [];
  for (const block of blockInlineTokens) {
    if (block.type === "list") {
      tokens.push(block);
      continue;
    }
    if (block.type !== "text") {
      tokens.push(block);
      continue;
    }
    const text = block.text;
    let parts = [{ type: "text", text }];
    for (const [type, regex] of Object.entries(regexes)) {
      const newParts = [];
      for (const token of parts) {
        if (token.type !== "text") {
          newParts.push(token);
          continue;
        }
        let lastIndex = 0;
        const matches = [...token.text.matchAll(regex)];
        if (matches.length === 0) {
          newParts.push(token);
          continue;
        }
        for (const match of matches) {
          const matched = match[0];
          const start = match.index ?? 0;
          const end = start + matched.length;
          if (start > lastIndex) newParts.push({ type: "text", text: token.text.slice(lastIndex, start).trim() });
          const trimmed = matched.trim();
          switch (type) {
            case "link":
              newParts.push({ type: "link", href: trimmed, text: trimmed });
              break;
            case "wwwLink":
              const href = `https://${trimmed}`;
              newParts.push({ type: "link", href, text: trimmed });
              break;
            case "email":
              newParts.push({ type: "email", email: trimmed, text: trimmed });
              break;
            case "quote":
              newParts.push({ type: "quote", text: trimmed });
              break;
            case "code":
              newParts.push({ type: "code", text: trimmed });
              break;
            case "number":
              newParts.push({ type: "number", text: trimmed });
              break;
            case "currency":
              newParts.push({ type: "currency", text: trimmed });
              break;
            case "date":
              newParts.push({ type: "date", text: trimmed });
              break;
          }
          lastIndex = end;
        }
        if (lastIndex < token.text.length) newParts.push({ type: "text", text: token.text.slice(lastIndex) });
      }
      parts = newParts;
    }
    tokens.push(...parts);
  }
  return tokens.filter((t) => t.text.trim().length > 0);
};
export {
  tokenizeInline
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3NlcnZpY2UvdG9rZW5pemVJbmxpbmUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IHJlZ2V4ZXMgPSB7XHJcbiAgbGluazogL1xcYmh0dHBzPzpcXC9cXC9bXlxccy8kLj8jXS5bXlxcc10qL2dpLFxyXG4gIHd3d0xpbms6IC9cXGJ3d3dcXC5bXlxccy8kLj8jXS5bXlxcc10qL2dpLFxyXG4gIGVtYWlsOiAvXFxiW0EtWjAtOS5fJSstXStAW0EtWjAtOS4tXStcXC5bQS1aXXsyLH1cXGIvZ2ksXHJcbiAgcXVvdGU6IC8oXCJbXlwiXStcIltcXC4sXT8pL2csXHJcbiAgY29kZTogL2AoW15gXSspYC9nLFxyXG4gIGRhdGU6IC9cXGJcXGR7MSwyfShbLS9dKVxcZHsxLDJ9XFwxXFxkezIsNH1cXGIvZyxcclxuICBjdXJyZW5jeTogLyhcXCR8XHUyMEFDfFx1MDBBMylcXHM/XFxkKyg/OlsuLF1cXGQrKT8vZyxcclxuICBudW1iZXI6IC9cXGJcXHMoXFxkKylcXHNcXGIvZ1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdG9rZW5pemVJbmxpbmUgPSAoYmxvY2tJbmxpbmVUb2tlbnM6IElubGluZVRva2VuW10pOiBJbmxpbmVUb2tlbltdID0+IHtcclxuICBjb25zdCB0b2tlbnM6IElubGluZVRva2VuW10gPSBbXVxyXG5cclxuICBmb3IgKGNvbnN0IGJsb2NrIG9mIGJsb2NrSW5saW5lVG9rZW5zKSB7XHJcbiAgICBpZiAoYmxvY2sudHlwZSA9PT0gJ2xpc3QnKSB7XHJcbiAgICAgIHRva2Vucy5wdXNoKGJsb2NrKVxyXG4gICAgICBjb250aW51ZVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChibG9jay50eXBlICE9PSAndGV4dCcpIHtcclxuICAgICAgdG9rZW5zLnB1c2goYmxvY2spXHJcbiAgICAgIGNvbnRpbnVlXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGV4dCA9IGJsb2NrLnRleHRcclxuICAgIGxldCBwYXJ0czogSW5saW5lVG9rZW5bXSA9IFt7IHR5cGU6ICd0ZXh0JywgdGV4dCB9XVxyXG5cclxuICAgIC8vIGFwbGljYXIgY2FkYSByZWdleCBzb2JyZSBsb3MgdGV4dG9zIGFjdHVhbGVzXHJcbiAgICBmb3IgKGNvbnN0IFt0eXBlLCByZWdleF0gb2YgT2JqZWN0LmVudHJpZXMocmVnZXhlcykpIHtcclxuICAgICAgY29uc3QgbmV3UGFydHM6IElubGluZVRva2VuW10gPSBbXVxyXG4gICAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHBhcnRzKSB7XHJcbiAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09ICd0ZXh0Jykge1xyXG4gICAgICAgICAgbmV3UGFydHMucHVzaCh0b2tlbilcclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbGFzdEluZGV4ID0gMFxyXG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBbLi4udG9rZW4udGV4dC5tYXRjaEFsbChyZWdleCldXHJcbiAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBuZXdQYXJ0cy5wdXNoKHRva2VuKVxyXG4gICAgICAgICAgY29udGludWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgbWF0Y2hlcykge1xyXG4gICAgICAgICAgY29uc3QgbWF0Y2hlZCA9IG1hdGNoWzBdXHJcbiAgICAgICAgICBjb25zdCBzdGFydCA9IG1hdGNoLmluZGV4ID8/IDBcclxuICAgICAgICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgbWF0Y2hlZC5sZW5ndGhcclxuXHJcbiAgICAgICAgICBpZiAoc3RhcnQgPiBsYXN0SW5kZXgpIG5ld1BhcnRzLnB1c2goeyB0eXBlOiAndGV4dCcsIHRleHQ6IHRva2VuLnRleHQuc2xpY2UobGFzdEluZGV4LCBzdGFydCkudHJpbSgpIH0pXHJcblxyXG4gICAgICAgICAgY29uc3QgdHJpbW1lZCA9IG1hdGNoZWQudHJpbSgpXHJcbiAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnbGluayc6XHJcbiAgICAgICAgICAgICAgbmV3UGFydHMucHVzaCh7IHR5cGU6ICdsaW5rJywgaHJlZjogdHJpbW1lZCwgdGV4dDogdHJpbW1lZCB9KVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3d3d0xpbmsnOlxyXG4gICAgICAgICAgICAgIC8vIEFncmVnYXIgaHR0cHM6Ly8gc2kgZW1waWV6YSBjb24gd3d3LlxyXG4gICAgICAgICAgICAgIGNvbnN0IGhyZWYgPSBgaHR0cHM6Ly8ke3RyaW1tZWR9YFxyXG4gICAgICAgICAgICAgIG5ld1BhcnRzLnB1c2goeyB0eXBlOiAnbGluaycsIGhyZWYsIHRleHQ6IHRyaW1tZWQgfSlcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdlbWFpbCc6XHJcbiAgICAgICAgICAgICAgbmV3UGFydHMucHVzaCh7IHR5cGU6ICdlbWFpbCcsIGVtYWlsOiB0cmltbWVkLCB0ZXh0OiB0cmltbWVkIH0pXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAncXVvdGUnOlxyXG4gICAgICAgICAgICAgIG5ld1BhcnRzLnB1c2goeyB0eXBlOiAncXVvdGUnLCB0ZXh0OiB0cmltbWVkIH0pXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnY29kZSc6XHJcbiAgICAgICAgICAgICAgbmV3UGFydHMucHVzaCh7IHR5cGU6ICdjb2RlJywgdGV4dDogdHJpbW1lZCB9KVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgICAgICAgICAgbmV3UGFydHMucHVzaCh7IHR5cGU6ICdudW1iZXInLCB0ZXh0OiB0cmltbWVkIH0pXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnY3VycmVuY3knOlxyXG4gICAgICAgICAgICAgIG5ld1BhcnRzLnB1c2goeyB0eXBlOiAnY3VycmVuY3knLCB0ZXh0OiB0cmltbWVkIH0pXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnZGF0ZSc6XHJcbiAgICAgICAgICAgICAgbmV3UGFydHMucHVzaCh7IHR5cGU6ICdkYXRlJywgdGV4dDogdHJpbW1lZCB9KVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbGFzdEluZGV4ID0gZW5kXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobGFzdEluZGV4IDwgdG9rZW4udGV4dC5sZW5ndGgpIG5ld1BhcnRzLnB1c2goeyB0eXBlOiAndGV4dCcsIHRleHQ6IHRva2VuLnRleHQuc2xpY2UobGFzdEluZGV4KSB9KVxyXG4gICAgICB9XHJcbiAgICAgIHBhcnRzID0gbmV3UGFydHNcclxuICAgIH1cclxuXHJcbiAgICB0b2tlbnMucHVzaCguLi5wYXJ0cylcclxuICB9XHJcblxyXG4gIHJldHVybiB0b2tlbnMuZmlsdGVyKCh0KSA9PiB0LnRleHQudHJpbSgpLmxlbmd0aCA+IDApXHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7O0FBQUEsSUFBTSxVQUFVO0FBQUEsRUFDZCxNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsRUFDVCxPQUFPO0FBQUEsRUFDUCxPQUFPO0FBQUEsRUFDUCxNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixVQUFVO0FBQUEsRUFDVixRQUFRO0FBQ1Y7QUFFTyxJQUFNLGlCQUFpQixDQUFDLHNCQUFvRDtBQUNqRixRQUFNLFNBQXdCLENBQUM7QUFFL0IsYUFBVyxTQUFTLG1CQUFtQjtBQUNyQyxRQUFJLE1BQU0sU0FBUyxRQUFRO0FBQ3pCLGFBQU8sS0FBSyxLQUFLO0FBQ2pCO0FBQUEsSUFDRjtBQUVBLFFBQUksTUFBTSxTQUFTLFFBQVE7QUFDekIsYUFBTyxLQUFLLEtBQUs7QUFDakI7QUFBQSxJQUNGO0FBRUEsVUFBTSxPQUFPLE1BQU07QUFDbkIsUUFBSSxRQUF1QixDQUFDLEVBQUUsTUFBTSxRQUFRLEtBQUssQ0FBQztBQUdsRCxlQUFXLENBQUMsTUFBTSxLQUFLLEtBQUssT0FBTyxRQUFRLE9BQU8sR0FBRztBQUNuRCxZQUFNLFdBQTBCLENBQUM7QUFDakMsaUJBQVcsU0FBUyxPQUFPO0FBQ3pCLFlBQUksTUFBTSxTQUFTLFFBQVE7QUFDekIsbUJBQVMsS0FBSyxLQUFLO0FBQ25CO0FBQUEsUUFDRjtBQUVBLFlBQUksWUFBWTtBQUNoQixjQUFNLFVBQVUsQ0FBQyxHQUFHLE1BQU0sS0FBSyxTQUFTLEtBQUssQ0FBQztBQUM5QyxZQUFJLFFBQVEsV0FBVyxHQUFHO0FBQ3hCLG1CQUFTLEtBQUssS0FBSztBQUNuQjtBQUFBLFFBQ0Y7QUFFQSxtQkFBVyxTQUFTLFNBQVM7QUFDM0IsZ0JBQU0sVUFBVSxNQUFNLENBQUM7QUFDdkIsZ0JBQU0sUUFBUSxNQUFNLFNBQVM7QUFDN0IsZ0JBQU0sTUFBTSxRQUFRLFFBQVE7QUFFNUIsY0FBSSxRQUFRLFVBQVcsVUFBUyxLQUFLLEVBQUUsTUFBTSxRQUFRLE1BQU0sTUFBTSxLQUFLLE1BQU0sV0FBVyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFFdEcsZ0JBQU0sVUFBVSxRQUFRLEtBQUs7QUFDN0Isa0JBQVEsTUFBTTtBQUFBLFlBQ1osS0FBSztBQUNILHVCQUFTLEtBQUssRUFBRSxNQUFNLFFBQVEsTUFBTSxTQUFTLE1BQU0sUUFBUSxDQUFDO0FBQzVEO0FBQUEsWUFDRixLQUFLO0FBRUgsb0JBQU0sT0FBTyxXQUFXLE9BQU87QUFDL0IsdUJBQVMsS0FBSyxFQUFFLE1BQU0sUUFBUSxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQ25EO0FBQUEsWUFDRixLQUFLO0FBQ0gsdUJBQVMsS0FBSyxFQUFFLE1BQU0sU0FBUyxPQUFPLFNBQVMsTUFBTSxRQUFRLENBQUM7QUFDOUQ7QUFBQSxZQUNGLEtBQUs7QUFDSCx1QkFBUyxLQUFLLEVBQUUsTUFBTSxTQUFTLE1BQU0sUUFBUSxDQUFDO0FBQzlDO0FBQUEsWUFDRixLQUFLO0FBQ0gsdUJBQVMsS0FBSyxFQUFFLE1BQU0sUUFBUSxNQUFNLFFBQVEsQ0FBQztBQUM3QztBQUFBLFlBQ0YsS0FBSztBQUNILHVCQUFTLEtBQUssRUFBRSxNQUFNLFVBQVUsTUFBTSxRQUFRLENBQUM7QUFDL0M7QUFBQSxZQUNGLEtBQUs7QUFDSCx1QkFBUyxLQUFLLEVBQUUsTUFBTSxZQUFZLE1BQU0sUUFBUSxDQUFDO0FBQ2pEO0FBQUEsWUFDRixLQUFLO0FBQ0gsdUJBQVMsS0FBSyxFQUFFLE1BQU0sUUFBUSxNQUFNLFFBQVEsQ0FBQztBQUM3QztBQUFBLFVBQ0o7QUFFQSxzQkFBWTtBQUFBLFFBQ2Q7QUFFQSxZQUFJLFlBQVksTUFBTSxLQUFLLE9BQVEsVUFBUyxLQUFLLEVBQUUsTUFBTSxRQUFRLE1BQU0sTUFBTSxLQUFLLE1BQU0sU0FBUyxFQUFFLENBQUM7QUFBQSxNQUN0RztBQUNBLGNBQVE7QUFBQSxJQUNWO0FBRUEsV0FBTyxLQUFLLEdBQUcsS0FBSztBQUFBLEVBQ3RCO0FBRUEsU0FBTyxPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxLQUFLLEVBQUUsU0FBUyxDQUFDO0FBQ3REOyIsCiAgIm5hbWVzIjogW10KfQo=
