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

// src/service/tokenizeBlocks.ts
var RE = {
  blockquote: /^".+?"[\.,]?(?:\s+[a-zA-Z0-9áéíóúÁÉÍÓÚÑÜç].*)?$/,
  titleAllCaps: /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s,;:'"()\-\–—]{8,}$/,
  titleWithNumber: /^[\s]*(CAP[ÍI]TULO|SECCI[ÓO]N|PARTE|UNIDAD|TEMA)\s+([IVXLCDM\d]+)\s*$/i,
  roman: /^[\s]*([IVXLCDM]+)(?:[.)\]-])\s+([A-ZÁÉÍÓÚÑ][^\n]{2,})$/,
  numbering: /^[\s]*(\d+(?:\.\d+)*)(?:[\.\)\]\-])\s+([A-ZÁÉÍÓÚÑ¿¡][A-ZÁÉÍÓÚÑa-záéíóúñü\s\-,;:.()?!¿¡]{3,})$/,
  subtitle: /^[A-ZÁÉÍÓÚÑ¿¡][A-ZÁÉÍÓÚÑ\s\-,;:.()?!¿¡]{5,}$/,
  bullet: /^[\s]*([●•\*◦\-–—])\s+(.+)$/,
  lettered: /^[\s]*([a-záéíóúñA-ZÁÉÍÓÚÑ])[\.)\]-]\s+(.{3,})$/,
  indexLine: /^(\d+(?:\.\d+)*[.)\]-]?)\s+(.+?)\.?\s*(\d+)?\s*$/
};
var makeBlock = (type, content) => ({
  type,
  inlineTokens: [{ type: "text", text: content.trim() }]
});
var makeList = (listType, indicator, content) => ({
  type: "list",
  inlineTokens: [
    {
      type: "list",
      text: content.replace(indicator.toString(), "").trim(),
      listType: listType ?? "bullet",
      listIndicator: indicator.toString()
    }
  ]
});
function isIndexLine(clean) {
  const m = clean.match(RE.indexLine);
  if (!m) return false;
  const [, , content = "", trailingNumber] = m;
  const words = content.trim().split(/\s+/);
  if (trailingNumber) return true;
  if (words.length <= 3 && content.length <= 30) return true;
  const alpha = content.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "");
  if (alpha && alpha === alpha.toUpperCase() && content.length > 20) return false;
  if (content.length > 20) return false;
  return true;
}
function looksLikeTitle(text) {
  const clean = text.trim();
  if (clean.length < 10) return false;
  if (RE.titleAllCaps.test(clean)) return true;
  return false;
}
function isValidRomanNumeral(value) {
  return /^(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))$/i.test(value.trim());
}
var isOnlySymbols = (t) => /^[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüç]+$/.test(t);
var isMostlyUppercase = (input, threshold = 0.8) => {
  const words = input.split(/\s+/).filter(Boolean);
  const upperCount = words.filter((w) => {
    const alpha = w.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "");
    return alpha && alpha === alpha.toUpperCase();
  }).length;
  return words.length > 0 && upperCount / words.length >= threshold;
};
function classifyLine(nextLine, linea, allCaps = false) {
  const clean = linea.trim();
  if (!clean) return false;
  if (RE.blockquote.test(clean)) return makeBlock("blockquote", clean);
  if (RE.titleWithNumber.test(clean)) return makeBlock("title", clean);
  const mRoman = clean.match(RE.roman);
  if (mRoman && mRoman[2] && isValidRomanNumeral(mRoman[1] ?? "")) {
    return RE.titleAllCaps.test(mRoman[2]) ? makeBlock("title", clean) : makeList("roman", mRoman[1] ?? "", mRoman[2]);
  }
  if (RE.titleAllCaps.test(clean) && !allCaps) {
    return makeBlock("title", clean);
  }
  const mNumbering = clean.match(RE.numbering);
  if (mNumbering) {
    const [, indicator = "", content = ""] = mNumbering;
    if (looksLikeTitle(content) && !looksLikeTitle(nextLine)) return makeBlock("subtitle", clean);
    return makeList("numbered", indicator, content);
  }
  if (RE.indexLine.test(clean) && isIndexLine(clean)) return makeList("indexLine", clean.split(" ")[0] ?? "", clean);
  if (RE.bullet.test(clean)) {
    const [, indicator = "", content = ""] = clean.match(RE.bullet);
    return makeList("bullet", indicator, content);
  }
  if (RE.lettered.test(clean)) {
    const [, indicator = "", content = ""] = clean.match(RE.lettered);
    return makeList("lettered", indicator, content);
  }
  if (RE.subtitle.test(clean) && !allCaps) return makeBlock("subtitle", clean);
  return makeBlock("paragraph", clean);
}
function shouldGroupWith(current, next, allCaps) {
  if (!current) return false;
  const sameType = current.type === next.type;
  if (allCaps && (sameType || ["title", "subtitle"].includes(next.type))) return false;
  if (["title", "subtitle"].includes(current.type) && ["title", "subtitle"].includes(next.type)) {
    const content = next.inlineTokens[0]?.text || "";
    const hasNumber = RE.numbering.test(content) || RE.roman.test(content);
    return !hasNumber && !allCaps;
  }
  const currentToken = current.inlineTokens[0];
  const nextToken = next.inlineTokens[0];
  if (current.type === "list" && next.type === "list" && currentToken?.type === "list" && nextToken?.type === "list") {
    return currentToken.listType === nextToken.listType;
  }
  if (current.type === "list" && next.type === "list" && current.inlineTokens[0]?.type === "list" && next.inlineTokens[0]?.type === "list") {
    return current.inlineTokens[0].listType === next.inlineTokens[0].listType;
  }
  return false;
}
function tokenizeBlocks(input) {
  const lines = input.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const allCaps = isMostlyUppercase(input);
  const blocks = [];
  let current = null;
  const push = () => {
    if (current) {
      current.inlineTokens = tokenizeInline(current.inlineTokens);
      blocks.push(current);
      current = null;
    }
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const nextLine = lines[i + 1] ?? "";
    if (isOnlySymbols(line)) continue;
    const classified = classifyLine(nextLine, line, allCaps);
    if (!classified) continue;
    const canGroup = shouldGroupWith(current, classified, allCaps);
    if (!canGroup) {
      push();
      current = classified;
    } else {
      if (classified.inlineTokens[0]) {
        current.inlineTokens.push(classified.inlineTokens[0]);
      }
    }
    if (["blockquote", "paragraph"].includes(classified.type)) push();
  }
  push();
  const textCleaned = blocks.map((b) => b.inlineTokens.map((t) => t.text).join(" ")).join(" ").replace(/\s+/g, " ").trim();
  return { blocks, textCleaned };
}
export {
  tokenizeBlocks
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3NlcnZpY2UvdG9rZW5pemVJbmxpbmUudHMiLCAiLi4vLi4vc3JjL3NlcnZpY2UvdG9rZW5pemVCbG9ja3MudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IHJlZ2V4ZXMgPSB7XHJcbiAgbGluazogL1xcYmh0dHBzPzpcXC9cXC9bXlxccy8kLj8jXS5bXlxcc10qL2dpLFxyXG4gIHd3d0xpbms6IC9cXGJ3d3dcXC5bXlxccy8kLj8jXS5bXlxcc10qL2dpLFxyXG4gIGVtYWlsOiAvXFxiW0EtWjAtOS5fJSstXStAW0EtWjAtOS4tXStcXC5bQS1aXXsyLH1cXGIvZ2ksXHJcbiAgcXVvdGU6IC8oXCJbXlwiXStcIltcXC4sXT8pL2csXHJcbiAgY29kZTogL2AoW15gXSspYC9nLFxyXG4gIGRhdGU6IC9cXGJcXGR7MSwyfShbLS9dKVxcZHsxLDJ9XFwxXFxkezIsNH1cXGIvZyxcclxuICBjdXJyZW5jeTogLyhcXCR8XHUyMEFDfFx1MDBBMylcXHM/XFxkKyg/OlsuLF1cXGQrKT8vZyxcclxuICBudW1iZXI6IC9cXGJcXHMoXFxkKylcXHNcXGIvZ1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdG9rZW5pemVJbmxpbmUgPSAoYmxvY2tJbmxpbmVUb2tlbnM6IElubGluZVRva2VuW10pOiBJbmxpbmVUb2tlbltdID0+IHtcclxuICBjb25zdCB0b2tlbnM6IElubGluZVRva2VuW10gPSBbXVxyXG5cclxuICBmb3IgKGNvbnN0IGJsb2NrIG9mIGJsb2NrSW5saW5lVG9rZW5zKSB7XHJcbiAgICBpZiAoYmxvY2sudHlwZSA9PT0gJ2xpc3QnKSB7XHJcbiAgICAgIHRva2Vucy5wdXNoKGJsb2NrKVxyXG4gICAgICBjb250aW51ZVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChibG9jay50eXBlICE9PSAndGV4dCcpIHtcclxuICAgICAgdG9rZW5zLnB1c2goYmxvY2spXHJcbiAgICAgIGNvbnRpbnVlXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGV4dCA9IGJsb2NrLnRleHRcclxuICAgIGxldCBwYXJ0czogSW5saW5lVG9rZW5bXSA9IFt7IHR5cGU6ICd0ZXh0JywgdGV4dCB9XVxyXG5cclxuICAgIC8vIGFwbGljYXIgY2FkYSByZWdleCBzb2JyZSBsb3MgdGV4dG9zIGFjdHVhbGVzXHJcbiAgICBmb3IgKGNvbnN0IFt0eXBlLCByZWdleF0gb2YgT2JqZWN0LmVudHJpZXMocmVnZXhlcykpIHtcclxuICAgICAgY29uc3QgbmV3UGFydHM6IElubGluZVRva2VuW10gPSBbXVxyXG4gICAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHBhcnRzKSB7XHJcbiAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09ICd0ZXh0Jykge1xyXG4gICAgICAgICAgbmV3UGFydHMucHVzaCh0b2tlbilcclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbGFzdEluZGV4ID0gMFxyXG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBbLi4udG9rZW4udGV4dC5tYXRjaEFsbChyZWdleCldXHJcbiAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBuZXdQYXJ0cy5wdXNoKHRva2VuKVxyXG4gICAgICAgICAgY29udGludWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgbWF0Y2hlcykge1xyXG4gICAgICAgICAgY29uc3QgbWF0Y2hlZCA9IG1hdGNoWzBdXHJcbiAgICAgICAgICBjb25zdCBzdGFydCA9IG1hdGNoLmluZGV4ID8/IDBcclxuICAgICAgICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgbWF0Y2hlZC5sZW5ndGhcclxuXHJcbiAgICAgICAgICBpZiAoc3RhcnQgPiBsYXN0SW5kZXgpIG5ld1BhcnRzLnB1c2goeyB0eXBlOiAndGV4dCcsIHRleHQ6IHRva2VuLnRleHQuc2xpY2UobGFzdEluZGV4LCBzdGFydCkudHJpbSgpIH0pXHJcblxyXG4gICAgICAgICAgY29uc3QgdHJpbW1lZCA9IG1hdGNoZWQudHJpbSgpXHJcbiAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnbGluayc6XHJcbiAgICAgICAgICAgICAgbmV3UGFydHMucHVzaCh7IHR5cGU6ICdsaW5rJywgaHJlZjogdHJpbW1lZCwgdGV4dDogdHJpbW1lZCB9KVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3d3d0xpbmsnOlxyXG4gICAgICAgICAgICAgIC8vIEFncmVnYXIgaHR0cHM6Ly8gc2kgZW1waWV6YSBjb24gd3d3LlxyXG4gICAgICAgICAgICAgIGNvbnN0IGhyZWYgPSBgaHR0cHM6Ly8ke3RyaW1tZWR9YFxyXG4gICAgICAgICAgICAgIG5ld1BhcnRzLnB1c2goeyB0eXBlOiAnbGluaycsIGhyZWYsIHRleHQ6IHRyaW1tZWQgfSlcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdlbWFpbCc6XHJcbiAgICAgICAgICAgICAgbmV3UGFydHMucHVzaCh7IHR5cGU6ICdlbWFpbCcsIGVtYWlsOiB0cmltbWVkLCB0ZXh0OiB0cmltbWVkIH0pXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAncXVvdGUnOlxyXG4gICAgICAgICAgICAgIG5ld1BhcnRzLnB1c2goeyB0eXBlOiAncXVvdGUnLCB0ZXh0OiB0cmltbWVkIH0pXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnY29kZSc6XHJcbiAgICAgICAgICAgICAgbmV3UGFydHMucHVzaCh7IHR5cGU6ICdjb2RlJywgdGV4dDogdHJpbW1lZCB9KVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgICAgICAgICAgbmV3UGFydHMucHVzaCh7IHR5cGU6ICdudW1iZXInLCB0ZXh0OiB0cmltbWVkIH0pXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnY3VycmVuY3knOlxyXG4gICAgICAgICAgICAgIG5ld1BhcnRzLnB1c2goeyB0eXBlOiAnY3VycmVuY3knLCB0ZXh0OiB0cmltbWVkIH0pXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnZGF0ZSc6XHJcbiAgICAgICAgICAgICAgbmV3UGFydHMucHVzaCh7IHR5cGU6ICdkYXRlJywgdGV4dDogdHJpbW1lZCB9KVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbGFzdEluZGV4ID0gZW5kXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobGFzdEluZGV4IDwgdG9rZW4udGV4dC5sZW5ndGgpIG5ld1BhcnRzLnB1c2goeyB0eXBlOiAndGV4dCcsIHRleHQ6IHRva2VuLnRleHQuc2xpY2UobGFzdEluZGV4KSB9KVxyXG4gICAgICB9XHJcbiAgICAgIHBhcnRzID0gbmV3UGFydHNcclxuICAgIH1cclxuXHJcbiAgICB0b2tlbnMucHVzaCguLi5wYXJ0cylcclxuICB9XHJcblxyXG4gIHJldHVybiB0b2tlbnMuZmlsdGVyKCh0KSA9PiB0LnRleHQudHJpbSgpLmxlbmd0aCA+IDApXHJcbn1cclxuIiwgImltcG9ydCB7IHRva2VuaXplSW5saW5lIH0gZnJvbSAnLi90b2tlbml6ZUlubGluZSdcclxuXHJcbi8vIFJFR0VYIFBBVFRFUk5TXHJcbmNvbnN0IFJFID0ge1xyXG4gIGJsb2NrcXVvdGU6IC9eXCIuKz9cIltcXC4sXT8oPzpcXHMrW2EtekEtWjAtOVx1MDBFMVx1MDBFOVx1MDBFRFx1MDBGM1x1MDBGQVx1MDBDMVx1MDBDOVx1MDBDRFx1MDBEM1x1MDBEQVx1MDBEMVx1MDBEQ1x1MDBFN10uKik/JC8sXHJcbiAgdGl0bGVBbGxDYXBzOiAvXltBLVpcdTAwQzFcdTAwQzlcdTAwQ0RcdTAwRDNcdTAwREFcdTAwRDFdW0EtWlx1MDBDMVx1MDBDOVx1MDBDRFx1MDBEM1x1MDBEQVx1MDBEMVxccyw7OidcIigpXFwtXFxcdTIwMTNcdTIwMTRdezgsfSQvLFxyXG4gIHRpdGxlV2l0aE51bWJlcjogL15bXFxzXSooQ0FQW1x1MDBDREldVFVMT3xTRUNDSVtcdTAwRDNPXU58UEFSVEV8VU5JREFEfFRFTUEpXFxzKyhbSVZYTENETVxcZF0rKVxccyokL2ksXHJcbiAgcm9tYW46IC9eW1xcc10qKFtJVlhMQ0RNXSspKD86Wy4pXFxdLV0pXFxzKyhbQS1aXHUwMEMxXHUwMEM5XHUwMENEXHUwMEQzXHUwMERBXHUwMEQxXVteXFxuXXsyLH0pJC8sXHJcbiAgbnVtYmVyaW5nOiAvXltcXHNdKihcXGQrKD86XFwuXFxkKykqKSg/OltcXC5cXClcXF1cXC1dKVxccysoW0EtWlx1MDBDMVx1MDBDOVx1MDBDRFx1MDBEM1x1MDBEQVx1MDBEMVx1MDBCRlx1MDBBMV1bQS1aXHUwMEMxXHUwMEM5XHUwMENEXHUwMEQzXHUwMERBXHUwMEQxYS16XHUwMEUxXHUwMEU5XHUwMEVEXHUwMEYzXHUwMEZBXHUwMEYxXHUwMEZDXFxzXFwtLDs6LigpPyFcdTAwQkZcdTAwQTFdezMsfSkkLyxcclxuICBzdWJ0aXRsZTogL15bQS1aXHUwMEMxXHUwMEM5XHUwMENEXHUwMEQzXHUwMERBXHUwMEQxXHUwMEJGXHUwMEExXVtBLVpcdTAwQzFcdTAwQzlcdTAwQ0RcdTAwRDNcdTAwREFcdTAwRDFcXHNcXC0sOzouKCk/IVx1MDBCRlx1MDBBMV17NSx9JC8sXHJcbiAgYnVsbGV0OiAvXltcXHNdKihbXHUyNUNGXHUyMDIyXFwqXHUyNUU2XFwtXHUyMDEzXHUyMDE0XSlcXHMrKC4rKSQvLFxyXG4gIGxldHRlcmVkOiAvXltcXHNdKihbYS16XHUwMEUxXHUwMEU5XHUwMEVEXHUwMEYzXHUwMEZBXHUwMEYxQS1aXHUwMEMxXHUwMEM5XHUwMENEXHUwMEQzXHUwMERBXHUwMEQxXSlbXFwuKVxcXS1dXFxzKyguezMsfSkkLyxcclxuICBpbmRleExpbmU6IC9eKFxcZCsoPzpcXC5cXGQrKSpbLilcXF0tXT8pXFxzKyguKz8pXFwuP1xccyooXFxkKyk/XFxzKiQvXHJcbn1cclxuXHJcbi8vICBIRUxQRVJTIERFIENSRUFDSVx1MDBEM04gREUgQkxPUVVFU1xyXG5cclxuY29uc3QgbWFrZUJsb2NrID0gKHR5cGU6ICd0aXRsZScgfCAnc3VidGl0bGUnIHwgJ2Jsb2NrcXVvdGUnIHwgJ3BhcmFncmFwaCcsIGNvbnRlbnQ6IHN0cmluZyk6IFJpY2hCbG9jayA9PiAoe1xyXG4gIHR5cGUsXHJcbiAgaW5saW5lVG9rZW5zOiBbeyB0eXBlOiAndGV4dCcsIHRleHQ6IGNvbnRlbnQudHJpbSgpIH1dXHJcbn0pXHJcblxyXG5jb25zdCBtYWtlTGlzdCA9IChsaXN0VHlwZTogTGlzdFR5cGUsIGluZGljYXRvcjogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpOiBSaWNoQmxvY2sgPT4gKHtcclxuICB0eXBlOiAnbGlzdCcsXHJcbiAgaW5saW5lVG9rZW5zOiBbXHJcbiAgICB7XHJcbiAgICAgIHR5cGU6ICdsaXN0JyxcclxuICAgICAgdGV4dDogY29udGVudC5yZXBsYWNlKGluZGljYXRvci50b1N0cmluZygpLCAnJykudHJpbSgpLFxyXG4gICAgICBsaXN0VHlwZTogbGlzdFR5cGUgPz8gJ2J1bGxldCcsXHJcbiAgICAgIGxpc3RJbmRpY2F0b3I6IGluZGljYXRvci50b1N0cmluZygpXHJcbiAgICB9XHJcbiAgXVxyXG59KVxyXG5cclxuLy8gREVURUNUT1JFUyBERSBUSVBPXHJcblxyXG5mdW5jdGlvbiBpc0luZGV4TGluZShjbGVhbjogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgY29uc3QgbSA9IGNsZWFuLm1hdGNoKFJFLmluZGV4TGluZSlcclxuICBpZiAoIW0pIHJldHVybiBmYWxzZVxyXG4gIGNvbnN0IFssICwgY29udGVudCA9ICcnLCB0cmFpbGluZ051bWJlcl0gPSBtXHJcbiAgY29uc3Qgd29yZHMgPSBjb250ZW50LnRyaW0oKS5zcGxpdCgvXFxzKy8pXHJcblxyXG4gIGlmICh0cmFpbGluZ051bWJlcikgcmV0dXJuIHRydWVcclxuICBpZiAod29yZHMubGVuZ3RoIDw9IDMgJiYgY29udGVudC5sZW5ndGggPD0gMzApIHJldHVybiB0cnVlXHJcbiAgY29uc3QgYWxwaGEgPSBjb250ZW50LnJlcGxhY2UoL1teQS1aYS16XHUwMEMxXHUwMEM5XHUwMENEXHUwMEQzXHUwMERBXHUwMERDXHUwMEQxXHUwMEUxXHUwMEU5XHUwMEVEXHUwMEYzXHUwMEZBXHUwMEZDXHUwMEYxXS9nLCAnJylcclxuICBpZiAoYWxwaGEgJiYgYWxwaGEgPT09IGFscGhhLnRvVXBwZXJDYXNlKCkgJiYgY29udGVudC5sZW5ndGggPiAyMCkgcmV0dXJuIGZhbHNlXHJcbiAgaWYgKGNvbnRlbnQubGVuZ3RoID4gMjApIHJldHVybiBmYWxzZVxyXG4gIHJldHVybiB0cnVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvb2tzTGlrZVRpdGxlKHRleHQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIGNvbnN0IGNsZWFuID0gdGV4dC50cmltKClcclxuICBpZiAoY2xlYW4ubGVuZ3RoIDwgMTApIHJldHVybiBmYWxzZVxyXG4gIGlmIChSRS50aXRsZUFsbENhcHMudGVzdChjbGVhbikpIHJldHVybiB0cnVlXHJcbiAgcmV0dXJuIGZhbHNlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzVmFsaWRSb21hbk51bWVyYWwodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAvXihNezAsNH0oQ018Q0R8RD9DezAsM30pKFhDfFhMfEw/WHswLDN9KShJWHxJVnxWP0l7MCwzfSkpJC9pLnRlc3QodmFsdWUudHJpbSgpKVxyXG59XHJcblxyXG5jb25zdCBpc09ubHlTeW1ib2xzID0gKHQ6IHN0cmluZykgPT4gL15bXmEtekEtWjAtOVx1MDBFMVx1MDBFOVx1MDBFRFx1MDBGM1x1MDBGQVx1MDBDMVx1MDBDOVx1MDBDRFx1MDBEM1x1MDBEQVx1MDBGMVx1MDBEMVx1MDBGQ1x1MDBFN10rJC8udGVzdCh0KVxyXG5cclxuY29uc3QgaXNNb3N0bHlVcHBlcmNhc2UgPSAoaW5wdXQ6IHN0cmluZywgdGhyZXNob2xkID0gMC44KSA9PiB7XHJcbiAgY29uc3Qgd29yZHMgPSBpbnB1dC5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKVxyXG4gIGNvbnN0IHVwcGVyQ291bnQgPSB3b3Jkcy5maWx0ZXIoKHcpID0+IHtcclxuICAgIGNvbnN0IGFscGhhID0gdy5yZXBsYWNlKC9bXkEtWmEtelx1MDBDMVx1MDBDOVx1MDBDRFx1MDBEM1x1MDBEQVx1MDBEQ1x1MDBEMVx1MDBFMVx1MDBFOVx1MDBFRFx1MDBGM1x1MDBGQVx1MDBGQ1x1MDBGMV0vZywgJycpXHJcbiAgICByZXR1cm4gYWxwaGEgJiYgYWxwaGEgPT09IGFscGhhLnRvVXBwZXJDYXNlKClcclxuICB9KS5sZW5ndGhcclxuICByZXR1cm4gd29yZHMubGVuZ3RoID4gMCAmJiB1cHBlckNvdW50IC8gd29yZHMubGVuZ3RoID49IHRocmVzaG9sZFxyXG59XHJcblxyXG4vLyBDTEFTSUZJQ0FET1IgREUgTFx1MDBDRE5FQVNcclxuXHJcbmZ1bmN0aW9uIGNsYXNzaWZ5TGluZShuZXh0TGluZTogc3RyaW5nLCBsaW5lYTogc3RyaW5nLCBhbGxDYXBzID0gZmFsc2UpOiBSaWNoQmxvY2sgfCBmYWxzZSB7XHJcbiAgY29uc3QgY2xlYW4gPSBsaW5lYS50cmltKClcclxuICBpZiAoIWNsZWFuKSByZXR1cm4gZmFsc2VcclxuXHJcbiAgLy8gT3JkZW4gZGUgcHJpb3JpZGFkIChzaW1wbGlmaWNhZG8geSBjbGFybylcclxuICBpZiAoUkUuYmxvY2txdW90ZS50ZXN0KGNsZWFuKSkgcmV0dXJuIG1ha2VCbG9jaygnYmxvY2txdW90ZScsIGNsZWFuKVxyXG4gIGlmIChSRS50aXRsZVdpdGhOdW1iZXIudGVzdChjbGVhbikpIHJldHVybiBtYWtlQmxvY2soJ3RpdGxlJywgY2xlYW4pXHJcblxyXG4gIGNvbnN0IG1Sb21hbiA9IGNsZWFuLm1hdGNoKFJFLnJvbWFuKVxyXG4gIGlmIChtUm9tYW4gJiYgbVJvbWFuWzJdICYmIGlzVmFsaWRSb21hbk51bWVyYWwobVJvbWFuWzFdID8/ICcnKSkge1xyXG4gICAgcmV0dXJuIFJFLnRpdGxlQWxsQ2Fwcy50ZXN0KG1Sb21hblsyXSkgPyBtYWtlQmxvY2soJ3RpdGxlJywgY2xlYW4pIDogbWFrZUxpc3QoJ3JvbWFuJywgbVJvbWFuWzFdID8/ICcnLCBtUm9tYW5bMl0pXHJcbiAgfVxyXG5cclxuICBpZiAoUkUudGl0bGVBbGxDYXBzLnRlc3QoY2xlYW4pICYmICFhbGxDYXBzKSB7XHJcbiAgICByZXR1cm4gbWFrZUJsb2NrKCd0aXRsZScsIGNsZWFuKVxyXG4gIH1cclxuXHJcbiAgY29uc3QgbU51bWJlcmluZyA9IGNsZWFuLm1hdGNoKFJFLm51bWJlcmluZylcclxuICBpZiAobU51bWJlcmluZykge1xyXG4gICAgY29uc3QgWywgaW5kaWNhdG9yID0gJycsIGNvbnRlbnQgPSAnJ10gPSBtTnVtYmVyaW5nXHJcbiAgICBpZiAobG9va3NMaWtlVGl0bGUoY29udGVudCkgJiYgIWxvb2tzTGlrZVRpdGxlKG5leHRMaW5lKSkgcmV0dXJuIG1ha2VCbG9jaygnc3VidGl0bGUnLCBjbGVhbilcclxuICAgIHJldHVybiBtYWtlTGlzdCgnbnVtYmVyZWQnLCBpbmRpY2F0b3IsIGNvbnRlbnQpXHJcbiAgfVxyXG5cclxuICBpZiAoUkUuaW5kZXhMaW5lLnRlc3QoY2xlYW4pICYmIGlzSW5kZXhMaW5lKGNsZWFuKSkgcmV0dXJuIG1ha2VMaXN0KCdpbmRleExpbmUnLCBjbGVhbi5zcGxpdCgnICcpWzBdID8/ICcnLCBjbGVhbilcclxuXHJcbiAgaWYgKFJFLmJ1bGxldC50ZXN0KGNsZWFuKSkge1xyXG4gICAgY29uc3QgWywgaW5kaWNhdG9yID0gJycsIGNvbnRlbnQgPSAnJ10gPSBjbGVhbi5tYXRjaChSRS5idWxsZXQpIVxyXG4gICAgcmV0dXJuIG1ha2VMaXN0KCdidWxsZXQnLCBpbmRpY2F0b3IsIGNvbnRlbnQpXHJcbiAgfVxyXG5cclxuICBpZiAoUkUubGV0dGVyZWQudGVzdChjbGVhbikpIHtcclxuICAgIGNvbnN0IFssIGluZGljYXRvciA9ICcnLCBjb250ZW50ID0gJyddID0gY2xlYW4ubWF0Y2goUkUubGV0dGVyZWQpIVxyXG4gICAgcmV0dXJuIG1ha2VMaXN0KCdsZXR0ZXJlZCcsIGluZGljYXRvciwgY29udGVudClcclxuICB9XHJcblxyXG4gIGlmIChSRS5zdWJ0aXRsZS50ZXN0KGNsZWFuKSAmJiAhYWxsQ2FwcykgcmV0dXJuIG1ha2VCbG9jaygnc3VidGl0bGUnLCBjbGVhbilcclxuXHJcbiAgcmV0dXJuIG1ha2VCbG9jaygncGFyYWdyYXBoJywgY2xlYW4pXHJcbn1cclxuXHJcbi8vIEFHUlVQQUNJXHUwMEQzTiBERSBCTE9RVUVTXHJcbmZ1bmN0aW9uIHNob3VsZEdyb3VwV2l0aChjdXJyZW50OiBSaWNoQmxvY2sgfCBudWxsLCBuZXh0OiBSaWNoQmxvY2ssIGFsbENhcHM6IGJvb2xlYW4pOiBib29sZWFuIHtcclxuICBpZiAoIWN1cnJlbnQpIHJldHVybiBmYWxzZVxyXG5cclxuICBjb25zdCBzYW1lVHlwZSA9IGN1cnJlbnQudHlwZSA9PT0gbmV4dC50eXBlXHJcblxyXG4gIC8vIFx1RDgzRFx1REQzOCBObyB1bmlyIHRcdTAwRUR0dWxvcy9zdWJ0XHUwMEVEdHVsb3Mgc2kgYWxsQ2FwcyAodG9kbyBlbiBtYXlcdTAwRkFzY3VsYXMpXHJcbiAgaWYgKGFsbENhcHMgJiYgKHNhbWVUeXBlIHx8IFsndGl0bGUnLCAnc3VidGl0bGUnXS5pbmNsdWRlcyhuZXh0LnR5cGUpKSkgcmV0dXJuIGZhbHNlXHJcblxyXG4gIC8vIFx1RDgzRFx1REQzOSBBZ3J1cGFyIHRcdTAwRUR0dWxvcyBjb25zZWN1dGl2b3MgcXVlIHBhcmVjZW4gY29udGludWFjaVx1MDBGM25cclxuICBpZiAoWyd0aXRsZScsICdzdWJ0aXRsZSddLmluY2x1ZGVzKGN1cnJlbnQudHlwZSkgJiYgWyd0aXRsZScsICdzdWJ0aXRsZSddLmluY2x1ZGVzKG5leHQudHlwZSkpIHtcclxuICAgIGNvbnN0IGNvbnRlbnQgPSBuZXh0LmlubGluZVRva2Vuc1swXT8udGV4dCB8fCAnJ1xyXG4gICAgY29uc3QgaGFzTnVtYmVyID0gUkUubnVtYmVyaW5nLnRlc3QoY29udGVudCkgfHwgUkUucm9tYW4udGVzdChjb250ZW50KVxyXG4gICAgcmV0dXJuICFoYXNOdW1iZXIgJiYgIWFsbENhcHNcclxuICB9XHJcblxyXG4gIC8vIFx1RDgzRFx1REQzOSBBZ3J1cGFyIGxpc3RhcyBkZWwgbWlzbW8gdGlwb1xyXG4gIGNvbnN0IGN1cnJlbnRUb2tlbiA9IGN1cnJlbnQuaW5saW5lVG9rZW5zWzBdXHJcbiAgY29uc3QgbmV4dFRva2VuID0gbmV4dC5pbmxpbmVUb2tlbnNbMF1cclxuXHJcbiAgaWYgKGN1cnJlbnQudHlwZSA9PT0gJ2xpc3QnICYmIG5leHQudHlwZSA9PT0gJ2xpc3QnICYmIGN1cnJlbnRUb2tlbj8udHlwZSA9PT0gJ2xpc3QnICYmIG5leHRUb2tlbj8udHlwZSA9PT0gJ2xpc3QnKSB7XHJcbiAgICByZXR1cm4gY3VycmVudFRva2VuLmxpc3RUeXBlID09PSBuZXh0VG9rZW4ubGlzdFR5cGVcclxuICB9XHJcblxyXG4gIGlmIChcclxuICAgIGN1cnJlbnQudHlwZSA9PT0gJ2xpc3QnICYmXHJcbiAgICBuZXh0LnR5cGUgPT09ICdsaXN0JyAmJlxyXG4gICAgY3VycmVudC5pbmxpbmVUb2tlbnNbMF0/LnR5cGUgPT09ICdsaXN0JyAmJlxyXG4gICAgbmV4dC5pbmxpbmVUb2tlbnNbMF0/LnR5cGUgPT09ICdsaXN0J1xyXG4gICkge1xyXG4gICAgcmV0dXJuIGN1cnJlbnQuaW5saW5lVG9rZW5zWzBdLmxpc3RUeXBlID09PSBuZXh0LmlubGluZVRva2Vuc1swXS5saXN0VHlwZVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZhbHNlXHJcbn1cclxuXHJcbi8vIEZ1bmNpXHUwMEYzbiBQUklOQ0lQQUxcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0b2tlbml6ZUJsb2NrcyhpbnB1dDogc3RyaW5nKSB7XHJcbiAgY29uc3QgbGluZXMgPSBpbnB1dFxyXG4gICAgLnNwbGl0KC9cXG4rLylcclxuICAgIC5tYXAoKGwpID0+IGwudHJpbSgpKVxyXG4gICAgLmZpbHRlcihCb29sZWFuKVxyXG4gIGNvbnN0IGFsbENhcHMgPSBpc01vc3RseVVwcGVyY2FzZShpbnB1dClcclxuICBjb25zdCBibG9ja3M6IFJpY2hCbG9ja1tdID0gW11cclxuICBsZXQgY3VycmVudDogUmljaEJsb2NrIHwgbnVsbCA9IG51bGxcclxuXHJcbiAgY29uc3QgcHVzaCA9ICgpID0+IHtcclxuICAgIGlmIChjdXJyZW50KSB7XHJcbiAgICAgIGN1cnJlbnQuaW5saW5lVG9rZW5zID0gdG9rZW5pemVJbmxpbmUoY3VycmVudC5pbmxpbmVUb2tlbnMpXHJcbiAgICAgIGJsb2Nrcy5wdXNoKGN1cnJlbnQpXHJcbiAgICAgIGN1cnJlbnQgPSBudWxsXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBsaW5lID0gbGluZXNbaV0gPz8gJydcclxuICAgIGNvbnN0IG5leHRMaW5lID0gbGluZXNbaSArIDFdID8/ICcnXHJcbiAgICBpZiAoaXNPbmx5U3ltYm9scyhsaW5lKSkgY29udGludWVcclxuXHJcbiAgICBjb25zdCBjbGFzc2lmaWVkID0gY2xhc3NpZnlMaW5lKG5leHRMaW5lLCBsaW5lLCBhbGxDYXBzKVxyXG4gICAgaWYgKCFjbGFzc2lmaWVkKSBjb250aW51ZVxyXG4gICAgY29uc3QgY2FuR3JvdXAgPSBzaG91bGRHcm91cFdpdGgoY3VycmVudCwgY2xhc3NpZmllZCwgYWxsQ2FwcylcclxuXHJcbiAgICBpZiAoIWNhbkdyb3VwKSB7XHJcbiAgICAgIHB1c2goKVxyXG4gICAgICBjdXJyZW50ID0gY2xhc3NpZmllZFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGNsYXNzaWZpZWQuaW5saW5lVG9rZW5zWzBdKSB7XHJcbiAgICAgICAgY3VycmVudCEuaW5saW5lVG9rZW5zLnB1c2goY2xhc3NpZmllZC5pbmxpbmVUb2tlbnNbMF0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoWydibG9ja3F1b3RlJywgJ3BhcmFncmFwaCddLmluY2x1ZGVzKGNsYXNzaWZpZWQudHlwZSkpIHB1c2goKVxyXG4gIH1cclxuXHJcbiAgcHVzaCgpXHJcbiAgY29uc3QgdGV4dENsZWFuZWQgPSBibG9ja3NcclxuICAgIC5tYXAoKGIpID0+IGIuaW5saW5lVG9rZW5zLm1hcCgodDogSW5saW5lVG9rZW4pID0+IHQudGV4dCkuam9pbignICcpKVxyXG4gICAgLmpvaW4oJyAnKVxyXG4gICAgLnJlcGxhY2UoL1xccysvZywgJyAnKVxyXG4gICAgLnRyaW0oKVxyXG5cclxuICByZXR1cm4geyBibG9ja3MsIHRleHRDbGVhbmVkIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7QUFBQSxJQUFNLFVBQVU7QUFBQSxFQUNkLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxFQUNULE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQSxFQUNOLFVBQVU7QUFBQSxFQUNWLFFBQVE7QUFDVjtBQUVPLElBQU0saUJBQWlCLENBQUMsc0JBQW9EO0FBQ2pGLFFBQU0sU0FBd0IsQ0FBQztBQUUvQixhQUFXLFNBQVMsbUJBQW1CO0FBQ3JDLFFBQUksTUFBTSxTQUFTLFFBQVE7QUFDekIsYUFBTyxLQUFLLEtBQUs7QUFDakI7QUFBQSxJQUNGO0FBRUEsUUFBSSxNQUFNLFNBQVMsUUFBUTtBQUN6QixhQUFPLEtBQUssS0FBSztBQUNqQjtBQUFBLElBQ0Y7QUFFQSxVQUFNLE9BQU8sTUFBTTtBQUNuQixRQUFJLFFBQXVCLENBQUMsRUFBRSxNQUFNLFFBQVEsS0FBSyxDQUFDO0FBR2xELGVBQVcsQ0FBQyxNQUFNLEtBQUssS0FBSyxPQUFPLFFBQVEsT0FBTyxHQUFHO0FBQ25ELFlBQU0sV0FBMEIsQ0FBQztB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
