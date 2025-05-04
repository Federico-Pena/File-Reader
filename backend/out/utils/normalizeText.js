function parseTextToRichBlocks(raw) {
  const sections = preprocessOCRText(raw).split(/\n\n/);
  const withLineBreaks = [];
  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;
    if (/^"/.test(trimmed) && /".*$/.test(trimmed)) {
      withLineBreaks.push({ type: "blockquote", content: parseInline(trimmed) });
      continue;
    }
    withLineBreaks.push({ type: "paragraph", content: parseInline(trimmed) });
  }
  const cleaned = sections.join("\n\n").replace(/\n+/gm, " ");
  return { withLineBreaks, cleaned };
}
function preprocessOCRText(text) {
  const normalizedText = text.replace(/["'»«“”]+/gm, '"').replace(/\r+/gm, "").replace(/-\s?\n/gm, "").replace(/(?<=[A-ZÁÉÍÓÚÑa-záéíóúñ,]|[0-9])\n+(?=[a-záéíóúñ])/gm, "\n").replace(/\n{2,}/gm, "\n\n").trim();
  return normalizedText;
}
function isLikelySubheading(text) {
  const trimmed = text.trim();
  if (trimmed.length > 80) return false;
  const numbered = /^(\d+\.|[a-zA-Z]\))\s+[A-ZÁÉÍÓÚÑ]/.test(trimmed);
  const wordCount = trimmed.split(" ").length;
  const endsWithPunct = /[.?!0-9]$/.test(trimmed);
  return numbered && wordCount <= 8 && !endsWithPunct;
}
function parseInline(text) {
  const inlines = [];
  const parts = text.split(/\n+/);
  const quotePattern = /"[^"]*?"[.,!?;:]?/gm;
  const linkPattern = /\b(?:https?:\/\/|www\.)[^\s]+/gm;
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/gi;
  const combinedPattern = new RegExp(
    `${quotePattern.source}|${linkPattern.source}|${emailPattern.source}`,
    "gmi"
  );
  for (const part of parts) {
    if (!part) continue;
    let lastIndex = 0;
    const matches = Array.from(part.matchAll(combinedPattern));
    for (const match of matches) {
      const matchText = match[0];
      const index = match.index ?? 0;
      if (index > lastIndex) {
        const before = part.slice(lastIndex, index);
        const clean = before.trim();
        if (clean) {
          inlines.push({ type: "text", text: clean });
        }
      }
      if (matchText.startsWith('"')) {
        const quote = matchText.match(/^"(.*?)"([.,!?;):]?)$/);
        const text2 = quote ? `"${quote[1]}"${quote[2] || ""}` : matchText;
        inlines.push({ type: "quote", text: text2 });
      } else if (matchText.includes("@")) {
        inlines.push({ type: "email", text: matchText });
      } else {
        inlines.push({ type: "link", text: matchText });
      }
      lastIndex = index + matchText.length;
    }
    if (lastIndex < part.length) {
      const after = part.slice(lastIndex).trim();
      if (after) {
        inlines.push({ type: "text", text: after });
      }
    }
  }
  return inlines;
}
export {
  parseTextToRichBlocks
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3V0aWxzL25vcm1hbGl6ZVRleHQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCBmdW5jdGlvbiBwYXJzZVRleHRUb1JpY2hCbG9ja3MocmF3OiBzdHJpbmcpIHtcclxuICBjb25zdCBzZWN0aW9ucyA9IHByZXByb2Nlc3NPQ1JUZXh0KHJhdykuc3BsaXQoL1xcblxcbi8pXHJcbiAgY29uc3Qgd2l0aExpbmVCcmVha3M6IFJpY2hCbG9ja1tdID0gW11cclxuICBmb3IgKGNvbnN0IHNlY3Rpb24gb2Ygc2VjdGlvbnMpIHtcclxuICAgIGNvbnN0IHRyaW1tZWQgPSBzZWN0aW9uLnRyaW0oKVxyXG4gICAgaWYgKCF0cmltbWVkKSBjb250aW51ZVxyXG4gICAgaWYgKC9eXCIvLnRlc3QodHJpbW1lZCkgJiYgL1wiLiokLy50ZXN0KHRyaW1tZWQpKSB7XHJcbiAgICAgIHdpdGhMaW5lQnJlYWtzLnB1c2goeyB0eXBlOiAnYmxvY2txdW90ZScsIGNvbnRlbnQ6IHBhcnNlSW5saW5lKHRyaW1tZWQpIH0pXHJcbiAgICAgIGNvbnRpbnVlXHJcbiAgICB9XHJcbiAgICB3aXRoTGluZUJyZWFrcy5wdXNoKHsgdHlwZTogJ3BhcmFncmFwaCcsIGNvbnRlbnQ6IHBhcnNlSW5saW5lKHRyaW1tZWQpIH0pXHJcbiAgfVxyXG4gIGNvbnN0IGNsZWFuZWQgPSBzZWN0aW9ucy5qb2luKCdcXG5cXG4nKS5yZXBsYWNlKC9cXG4rL2dtLCAnICcpXHJcbiAgcmV0dXJuIHsgd2l0aExpbmVCcmVha3MsIGNsZWFuZWQgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwcmVwcm9jZXNzT0NSVGV4dCh0ZXh0OiBzdHJpbmcpIHtcclxuICBjb25zdCBub3JtYWxpemVkVGV4dCA9IHRleHRcclxuICAgIC5yZXBsYWNlKC9bXCInXHUwMEJCXHUwMEFCXHUyMDFDXHUyMDFEXSsvZ20sICdcIicpXHJcbiAgICAucmVwbGFjZSgvXFxyKy9nbSwgJycpXHJcbiAgICAucmVwbGFjZSgvLVxccz9cXG4vZ20sICcnKVxyXG4gICAgLnJlcGxhY2UoLyg/PD1bQS1aXHUwMEMxXHUwMEM5XHUwMENEXHUwMEQzXHUwMERBXHUwMEQxYS16XHUwMEUxXHUwMEU5XHUwMEVEXHUwMEYzXHUwMEZBXHUwMEYxLF18WzAtOV0pXFxuKyg/PVthLXpcdTAwRTFcdTAwRTlcdTAwRURcdTAwRjNcdTAwRkFcdTAwRjFdKS9nbSwgJ1xcbicpXHJcbiAgICAucmVwbGFjZSgvXFxuezIsfS9nbSwgJ1xcblxcbicpXHJcbiAgICAudHJpbSgpXHJcbiAgcmV0dXJuIG5vcm1hbGl6ZWRUZXh0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzTGlrZWx5U3ViaGVhZGluZyh0ZXh0OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICBjb25zdCB0cmltbWVkID0gdGV4dC50cmltKClcclxuICBpZiAodHJpbW1lZC5sZW5ndGggPiA4MCkgcmV0dXJuIGZhbHNlXHJcbiAgY29uc3QgbnVtYmVyZWQgPSAvXihcXGQrXFwufFthLXpBLVpdXFwpKVxccytbQS1aXHUwMEMxXHUwMEM5XHUwMENEXHUwMEQzXHUwMERBXHUwMEQxXS8udGVzdCh0cmltbWVkKVxyXG4gIGNvbnN0IHdvcmRDb3VudCA9IHRyaW1tZWQuc3BsaXQoJyAnKS5sZW5ndGhcclxuICBjb25zdCBlbmRzV2l0aFB1bmN0ID0gL1suPyEwLTldJC8udGVzdCh0cmltbWVkKVxyXG4gIHJldHVybiBudW1iZXJlZCAmJiB3b3JkQ291bnQgPD0gOCAmJiAhZW5kc1dpdGhQdW5jdFxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUlubGluZSh0ZXh0OiBzdHJpbmcpOiBSaWNoSW5saW5lW10ge1xyXG4gIGNvbnN0IGlubGluZXM6IFJpY2hJbmxpbmVbXSA9IFtdXHJcbiAgY29uc3QgcGFydHMgPSB0ZXh0LnNwbGl0KC9cXG4rLylcclxuXHJcbiAgY29uc3QgcXVvdGVQYXR0ZXJuID0gL1wiW15cIl0qP1wiWy4sIT87Ol0/L2dtXHJcbiAgY29uc3QgbGlua1BhdHRlcm4gPSAvXFxiKD86aHR0cHM/OlxcL1xcL3x3d3dcXC4pW15cXHNdKy9nbVxyXG4gIGNvbnN0IGVtYWlsUGF0dGVybiA9IC9cXGJbQS1aYS16MC05Ll8lKy1dK0BbQS1aYS16MC05Li1dK1xcLltBLVpdezIsfVxcYi9naVxyXG4gIGNvbnN0IGNvbWJpbmVkUGF0dGVybiA9IG5ldyBSZWdFeHAoXHJcbiAgICBgJHtxdW90ZVBhdHRlcm4uc291cmNlfXwke2xpbmtQYXR0ZXJuLnNvdXJjZX18JHtlbWFpbFBhdHRlcm4uc291cmNlfWAsXHJcbiAgICAnZ21pJ1xyXG4gIClcclxuXHJcbiAgZm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XHJcbiAgICBpZiAoIXBhcnQpIGNvbnRpbnVlXHJcblxyXG4gICAgbGV0IGxhc3RJbmRleCA9IDBcclxuICAgIGNvbnN0IG1hdGNoZXMgPSBBcnJheS5mcm9tKHBhcnQubWF0Y2hBbGwoY29tYmluZWRQYXR0ZXJuKSlcclxuXHJcbiAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIG1hdGNoZXMpIHtcclxuICAgICAgY29uc3QgbWF0Y2hUZXh0ID0gbWF0Y2hbMF1cclxuICAgICAgY29uc3QgaW5kZXggPSBtYXRjaC5pbmRleCA/PyAwXHJcblxyXG4gICAgICBpZiAoaW5kZXggPiBsYXN0SW5kZXgpIHtcclxuICAgICAgICBjb25zdCBiZWZvcmUgPSBwYXJ0LnNsaWNlKGxhc3RJbmRleCwgaW5kZXgpXHJcbiAgICAgICAgY29uc3QgY2xlYW4gPSBiZWZvcmUudHJpbSgpXHJcbiAgICAgICAgaWYgKGNsZWFuKSB7XHJcbiAgICAgICAgICBpbmxpbmVzLnB1c2goeyB0eXBlOiAndGV4dCcsIHRleHQ6IGNsZWFuIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobWF0Y2hUZXh0LnN0YXJ0c1dpdGgoJ1wiJykpIHtcclxuICAgICAgICBjb25zdCBxdW90ZSA9IG1hdGNoVGV4dC5tYXRjaCgvXlwiKC4qPylcIihbLiwhPzspOl0/KSQvKVxyXG4gICAgICAgIGNvbnN0IHRleHQgPSBxdW90ZSA/IGBcIiR7cXVvdGVbMV19XCIke3F1b3RlWzJdIHx8ICcnfWAgOiBtYXRjaFRleHRcclxuICAgICAgICBpbmxpbmVzLnB1c2goeyB0eXBlOiAncXVvdGUnLCB0ZXh0IH0pXHJcbiAgICAgIH0gZWxzZSBpZiAobWF0Y2hUZXh0LmluY2x1ZGVzKCdAJykpIHtcclxuICAgICAgICBpbmxpbmVzLnB1c2goeyB0eXBlOiAnZW1haWwnLCB0ZXh0OiBtYXRjaFRleHQgfSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbmxpbmVzLnB1c2goeyB0eXBlOiAnbGluaycsIHRleHQ6IG1hdGNoVGV4dCB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsYXN0SW5kZXggPSBpbmRleCArIG1hdGNoVGV4dC5sZW5ndGhcclxuICAgIH1cclxuXHJcbiAgICBpZiAobGFzdEluZGV4IDwgcGFydC5sZW5ndGgpIHtcclxuICAgICAgY29uc3QgYWZ0ZXIgPSBwYXJ0LnNsaWNlKGxhc3RJbmRleCkudHJpbSgpXHJcbiAgICAgIGlmIChhZnRlcikge1xyXG4gICAgICAgIGlubGluZXMucHVzaCh7IHR5cGU6ICd0ZXh0JywgdGV4dDogYWZ0ZXIgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGlubGluZXNcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiQUFBTyxTQUFTLHNCQUFzQixLQUFhO0FBQ2pELFFBQU0sV0FBVyxrQkFBa0IsR0FBRyxFQUFFLE1BQU0sTUFBTTtBQUNwRCxRQUFNLGlCQUE4QixDQUFDO0FBQ3JDLGFBQVcsV0FBVyxVQUFVO0FBQzlCLFVBQU0sVUFBVSxRQUFRLEtBQUs7QUFDN0IsUUFBSSxDQUFDLFFBQVM7QUFDZCxRQUFJLEtBQUssS0FBSyxPQUFPLEtBQUssT0FBTyxLQUFLLE9BQU8sR0FBRztBQUM5QyxxQkFBZSxLQUFLLEVBQUUsTUFBTSxjQUFjLFNBQVMsWUFBWSxPQUFPLEVBQUUsQ0FBQztBQUN6RTtBQUFB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
