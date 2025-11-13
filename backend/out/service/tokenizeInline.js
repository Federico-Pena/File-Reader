import { createRequire } from "node:module"; const require = createRequire(import.meta.url);

// src/service/tokenizeInline.ts
var regexes = {
  link: /\bhttps?:\/\/[^\s/$.?#].[^\s]*/gi,
  email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  quote: /"(.*]+)"|'([^']+)'/g,
  code: /`([^`]+)`/g,
  date: /\b\d{1,2}([-/])\d{1,2}\1\d{2,4}\b/g,
  currency: /(\$|€|£)\s?\d+(?:[.,]\d+)?/g,
  number: /\b(\d+)\b/g
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
          const [matched] = match;
          const start = match.index ?? 0;
          const end = start + matched.length;
          if (start > lastIndex)
            newParts.push({ type: "text", text: token.text.slice(lastIndex, start) });
          switch (type) {
            case "link":
              newParts.push({ type: "link", href: matched, text: matched });
              break;
            case "email":
              newParts.push({ type: "email", email: matched, text: matched });
              break;
            case "quote":
              newParts.push({ type: "quote", text: matched });
              break;
            case "code":
              newParts.push({ type: "code", text: matched });
              break;
            case "number":
              newParts.push({ type: "number", text: matched });
              break;
            case "currency":
              newParts.push({ type: "currency", text: matched });
              break;
            case "date":
              newParts.push({ type: "date", text: matched });
              break;
          }
          lastIndex = end;
        }
        if (lastIndex < token.text.length)
          newParts.push({ type: "text", text: token.text.slice(lastIndex) });
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3NlcnZpY2UvdG9rZW5pemVJbmxpbmUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB0eXBlIHsgSW5saW5lVG9rZW4gfSBmcm9tICdAc2hhcmVkL3R5cGVzL3R5cGVzJ1xyXG5cclxuLy8gcGF0cm9uZXMgYlx1MDBFMXNpY29zIChwb2RcdTAwRTlzIGlyIGFtcGxpXHUwMEUxbmRvbG9zKVxyXG5jb25zdCByZWdleGVzID0ge1xyXG4gIGxpbms6IC9cXGJodHRwcz86XFwvXFwvW15cXHMvJC4/I10uW15cXHNdKi9naSxcclxuICBlbWFpbDogL1xcYltBLVowLTkuXyUrLV0rQFtBLVowLTkuLV0rXFwuW0EtWl17Mix9XFxiL2dpLFxyXG4gIHF1b3RlOiAvXCIoLipdKylcInwnKFteJ10rKScvZyxcclxuICBjb2RlOiAvYChbXmBdKylgL2csXHJcbiAgZGF0ZTogL1xcYlxcZHsxLDJ9KFstL10pXFxkezEsMn1cXDFcXGR7Miw0fVxcYi9nLFxyXG4gIGN1cnJlbmN5OiAvKFxcJHxcdTIwQUN8XHUwMEEzKVxccz9cXGQrKD86Wy4sXVxcZCspPy9nLFxyXG4gIG51bWJlcjogL1xcYihcXGQrKVxcYi9nXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB0b2tlbml6ZUlubGluZSA9IChibG9ja0lubGluZVRva2VuczogSW5saW5lVG9rZW5bXSk6IElubGluZVRva2VuW10gPT4ge1xyXG4gIGNvbnN0IHRva2VuczogSW5saW5lVG9rZW5bXSA9IFtdXHJcblxyXG4gIGZvciAoY29uc3QgYmxvY2sgb2YgYmxvY2tJbmxpbmVUb2tlbnMpIHtcclxuICAgIGlmIChibG9jay50eXBlID09PSAnbGlzdCcpIHtcclxuICAgICAgdG9rZW5zLnB1c2goYmxvY2spXHJcbiAgICAgIGNvbnRpbnVlXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGJsb2NrLnR5cGUgIT09ICd0ZXh0Jykge1xyXG4gICAgICB0b2tlbnMucHVzaChibG9jaylcclxuICAgICAgY29udGludWVcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0ZXh0ID0gYmxvY2sudGV4dFxyXG4gICAgbGV0IHBhcnRzOiBJbmxpbmVUb2tlbltdID0gW3sgdHlwZTogJ3RleHQnLCB0ZXh0IH1dXHJcblxyXG4gICAgLy8gYXBsaWNhciBjYWRhIHJlZ2V4IHNvYnJlIGxvcyB0ZXh0b3MgYWN0dWFsZXNcclxuICAgIGZvciAoY29uc3QgW3R5cGUsIHJlZ2V4XSBvZiBPYmplY3QuZW50cmllcyhyZWdleGVzKSkge1xyXG4gICAgICBjb25zdCBuZXdQYXJ0czogSW5saW5lVG9rZW5bXSA9IFtdXHJcbiAgICAgIGZvciAoY29uc3QgdG9rZW4gb2YgcGFydHMpIHtcclxuICAgICAgICBpZiAodG9rZW4udHlwZSAhPT0gJ3RleHQnKSB7XHJcbiAgICAgICAgICBuZXdQYXJ0cy5wdXNoKHRva2VuKVxyXG4gICAgICAgICAgY29udGludWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsYXN0SW5kZXggPSAwXHJcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IFsuLi50b2tlbi50ZXh0Lm1hdGNoQWxsKHJlZ2V4KV1cclxuICAgICAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIG5ld1BhcnRzLnB1c2godG9rZW4pXHJcbiAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBtYXRjaCBvZiBtYXRjaGVzKSB7XHJcbiAgICAgICAgICBjb25zdCBbbWF0Y2hlZF0gPSBtYXRjaFxyXG4gICAgICAgICAgY29uc3Qgc3RhcnQgPSBtYXRjaC5pbmRleCA/PyAwXHJcbiAgICAgICAgICBjb25zdCBlbmQgPSBzdGFydCArIG1hdGNoZWQubGVuZ3RoXHJcblxyXG4gICAgICAgICAgaWYgKHN0YXJ0ID4gbGFzdEluZGV4KVxyXG4gICAgICAgICAgICBuZXdQYXJ0cy5wdXNoKHsgdHlwZTogJ3RleHQnLCB0ZXh0OiB0b2tlbi50ZXh0LnNsaWNlKGxhc3RJbmRleCwgc3RhcnQpIH0pXHJcblxyXG4gICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2xpbmsnOlxyXG4gICAgICAgICAgICAgIG5ld1BhcnRzLnB1c2goeyB0eXBlOiAnbGluaycsIGhyZWY6IG1hdGNoZWQsIHRleHQ6IG1hdGNoZWQgfSlcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdlbWFpbCc6XHJcbiAgICAgICAgICAgICAgbmV3UGFydHMucHVzaCh7IHR5cGU6ICdlbWFpbCcsIGVtYWlsOiBtYXRjaGVkLCB0ZXh0OiBtYXRjaGVkIH0pXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAncXVvdGUnOlxyXG4gICAgICAgICAgICAgIG5ld1BhcnRzLnB1c2goeyB0eXBlOiAncXVvdGUnLCB0ZXh0OiBtYXRjaGVkIH0pXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnY29kZSc6XHJcbiAgICAgICAgICAgICAgbmV3UGFydHMucHVzaCh7IHR5cGU6ICdjb2RlJywgdGV4dDogbWF0Y2hlZCB9KVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgICAgICAgICAgbmV3UGFydHMucHVzaCh7IHR5cGU6ICdudW1iZXInLCB0ZXh0OiBtYXRjaGVkIH0pXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnY3VycmVuY3knOlxyXG4gICAgICAgICAgICAgIG5ld1BhcnRzLnB1c2goeyB0eXBlOiAnY3VycmVuY3knLCB0ZXh0OiBtYXRjaGVkIH0pXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnZGF0ZSc6XHJcbiAgICAgICAgICAgICAgbmV3UGFydHMucHVzaCh7IHR5cGU6ICdkYXRlJywgdGV4dDogbWF0Y2hlZCB9KVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbGFzdEluZGV4ID0gZW5kXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobGFzdEluZGV4IDwgdG9rZW4udGV4dC5sZW5ndGgpXHJcbiAgICAgICAgICBuZXdQYXJ0cy5wdXNoKHsgdHlwZTogJ3RleHQnLCB0ZXh0OiB0b2tlbi50ZXh0LnNsaWNlKGxhc3RJbmRleCkgfSlcclxuICAgICAgfVxyXG4gICAgICBwYXJ0cyA9IG5ld1BhcnRzXHJcbiAgICB9XHJcblxyXG4gICAgdG9rZW5zLnB1c2goLi4ucGFydHMpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gdG9rZW5zLmZpbHRlcigodCkgPT4gdC50ZXh0LnRyaW0oKS5sZW5ndGggPiAwKVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7OztBQUdBLElBQU0sVUFBVTtBQUFBLEVBQ2QsTUFBTTtBQUFBLEVBQ04sT0FBTztBQUFBLEVBQ1AsT0FBTztBQUFBLEVBQ1AsTUFBTTtBQUFBLEVBQ04sTUFBTTtBQUFBLEVBQ04sVUFBVTtBQUFBLEVBQ1YsUUFBUTtBQUNWO0FBRU8sSUFBTSxpQkFBaUIsQ0FBQyxzQkFBb0Q7QUFDakYsUUFBTSxTQUF3QixDQUFDO0FBRS9CLGFBQVcsU0FBUyxtQkFBbUI7QUFDckMsUUFBSSxNQUFNLFNBQVMsUUFBUTtBQUN6QixhQUFPLEtBQUssS0FBSztBQUNqQjtBQUFBLElBQ0Y7QUFFQSxRQUFJLE1BQU0sU0FBUyxRQUFRO0FBQ3pCLGFBQU8sS0FBSyxLQUFLO0FBQ2pCO0FBQUEsSUFDRjtBQUVBLFVBQU0sT0FBTyxNQUFNO0FBQ25CLFFBQUksUUFBdUIsQ0FBQyxFQUFFLE1BQU0sUUFBUSxLQUFLLENBQUM7QUFHbEQsZUFBVyxDQUFDLE1BQU0sS0FBSyxLQUFLLE9BQU8sUUFBUSxPQUFPLEdBQUc7QUFDbkQsWUFBTSxXQUEwQixDQUFDO0FBQ2pDLGlCQUFXLFNBQVMsT0FBTztBQUN6QixZQUFJLE1BQU0sU0FBUyxRQUFRO0FBQ3pCLG1CQUFTLEtBQUssS0FBSztBQUNuQjtBQUFBLFFBQ0Y7QUFFQSxZQUFJLFlBQVk7QUFDaEIsY0FBTSxVQUFVLENBQUMsR0FBRyxNQUFNLEtBQUssU0FBUyxLQUFLLENBQUM7QUFDOUMsWUFBSSxRQUFRLFdBQVcsR0FBRztBQUN4QixtQkFBUyxLQUFLLEtBQUs7QUFDbkI7QUFBQSxRQUNGO0FBRUEsbUJBQVcsU0FBUyxTQUFTO0FBQzNCLGdCQUFNLENBQUMsT0FBTyxJQUFJO0FBQ2xCLGdCQUFNLFFBQVEsTUFBTSxTQUFTO0FBQzdCLGdCQUFNLE1BQU0sUUFBUSxRQUFRO0FBRTVCLGNBQUksUUFBUTtBQUNWLHFCQUFTLEtBQUssRUFBRSxNQUFNLFFBQVEsTUFBTSxNQUFNLEtBQUssTUFBTSxXQUFXLEtBQUssRUFBRSxDQUFDO0FBRTFFLGtCQUFRLE1BQU07QUFBQSxZQUNaLEtBQUs7QUFDSCx1QkFBUyxLQUFLLEVBQUUsTUFBTSxRQUFRLE1BQU0sU0FBUyxNQUFNLFFBQVEsQ0FBQztBQUM1RDtBQUFBLFlBQ0YsS0FBSztBQUNILHVCQUFTLEtBQUssRUFBRSxNQUFNLFNBQVMsT0FBTyxTQUFTLE1BQU0sUUFBUSxDQUFDO0FBQzlEO0FBQUEsWUFDRixLQUFLO0FBQ0gsdUJBQVMsS0FBSyxFQUFFLE1BQU0sU0FBUyxNQUFNLFFBQVEsQ0FBQztBQUM5QztBQUFBLFlBQ0YsS0FBSztBQUNILHVCQUFTLEtBQUssRUFBRSxNQUFNLFFBQVEsTUFBTSxRQUFRLENBQUM7QUFDN0M7QUFBQSxZQUNGLEtBQUs7QUFDSCx1QkFBUyxLQUFLLEVBQUUsTUFBTSxVQUFVLE1BQU0sUUFBUSxDQUFDO0FBQy9DO0FBQUEsWUFDRixLQUFLO0FBQ0gsdUJBQVMsS0FBSyxFQUFFLE1BQU0sWUFBWSxNQUFNLFFBQVEsQ0FBQztBQUNqRDtBQUFBLFlBQ0YsS0FBSztBQUNILHVCQUFTLEtBQUssRUFBRSxNQUFNLFFBQVEsTUFBTSxRQUFRLENBQUM7QUFDN0M7QUFBQSxVQUNKO0FBRUEsc0JBQVk7QUFBQSxRQUNkO0FBRUEsWUFBSSxZQUFZLE1BQU0sS0FBSztBQUN6QixtQkFBUyxLQUFLLEVBQUUsTUFBTSxRQUFRLE1BQU0sTUFBTSxLQUFLLE1BQU0sU0FBUyxFQUFFLENBQUM7QUFBQSxNQUNyRTtBQUNBLGNBQVE7QUFBQSxJQUNWO0FBRUEsV0FBTyxLQUFLLEdBQUcsS0FBSztBQUFBLEVBQ3RCO0FBRUEsU0FBTyxPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxLQUFLLEVBQUUsU0FBUyxDQUFDO0FBQ3REOyIsCiAgIm5hbWVzIjogW10KfQo=
