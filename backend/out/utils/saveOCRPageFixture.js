import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
function saveOCRPageFixture(fileName, text, page) {
  const fixturesRoot = join(process.cwd(), "../shared", "ocr-fixtures");
  const fileFolder = join(fixturesRoot, fileName);
  const fixtureFile = join(fileFolder, `${fileName}_pag_${page}.json`);
  try {
    if (!existsSync(fileFolder)) {
      mkdirSync(fileFolder, { recursive: true });
    }
    if (existsSync(fixtureFile)) {
      console.log(`\u{1F7E1} Fixture already exists: ${fixtureFile}`);
      return;
    }
    const fixtureContent = `{
    "input": ${JSON.stringify(text)},
    "expected": {
      "withLineBreaks": [],
      "cleaned": ""
    }
  }
`;
    writeFileSync(fixtureFile, fixtureContent, "utf-8");
    console.log(`\u2705 Fixture saved: ${fixtureFile}`);
  } catch (err) {
    console.error("\u274C Error saving fixture:", err);
  }
}
export {
  saveOCRPageFixture
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3V0aWxzL3NhdmVPQ1JQYWdlRml4dHVyZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgd3JpdGVGaWxlU3luYywgbWtkaXJTeW5jLCBleGlzdHNTeW5jIH0gZnJvbSAnZnMnXHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVPQ1JQYWdlRml4dHVyZShmaWxlTmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIHBhZ2U6IG51bWJlcik6IHZvaWQge1xyXG4gIGNvbnN0IGZpeHR1cmVzUm9vdCA9IGpvaW4ocHJvY2Vzcy5jd2QoKSwgJy4uL3NoYXJlZCcsICdvY3ItZml4dHVyZXMnKVxyXG4gIGNvbnN0IGZpbGVGb2xkZXIgPSBqb2luKGZpeHR1cmVzUm9vdCwgZmlsZU5hbWUpXHJcbiAgY29uc3QgZml4dHVyZUZpbGUgPSBqb2luKGZpbGVGb2xkZXIsIGAke2ZpbGVOYW1lfV9wYWdfJHtwYWdlfS5qc29uYClcclxuXHJcbiAgdHJ5IHtcclxuICAgIGlmICghZXhpc3RzU3luYyhmaWxlRm9sZGVyKSkge1xyXG4gICAgICBta2RpclN5bmMoZmlsZUZvbGRlciwgeyByZWN1cnNpdmU6IHRydWUgfSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZXhpc3RzU3luYyhmaXh0dXJlRmlsZSkpIHtcclxuICAgICAgY29uc29sZS5sb2coYFx1RDgzRFx1REZFMSBGaXh0dXJlIGFscmVhZHkgZXhpc3RzOiAke2ZpeHR1cmVGaWxlfWApXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZpeHR1cmVDb250ZW50ID0gYHtcclxuICAgIFwiaW5wdXRcIjogJHtKU09OLnN0cmluZ2lmeSh0ZXh0KX0sXHJcbiAgICBcImV4cGVjdGVkXCI6IHtcclxuICAgICAgXCJ3aXRoTGluZUJyZWFrc1wiOiBbXSxcclxuICAgICAgXCJjbGVhbmVkXCI6IFwiXCJcclxuICAgIH1cclxuICB9XHJcbmBcclxuXHJcbiAgICB3cml0ZUZpbGVTeW5jKGZpeHR1cmVGaWxlLCBmaXh0dXJlQ29udGVudCwgJ3V0Zi04JylcclxuICAgIGNvbnNvbGUubG9nKGBcdTI3MDUgRml4dHVyZSBzYXZlZDogJHtmaXh0dXJlRmlsZX1gKVxyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgY29uc29sZS5lcnJvcignXHUyNzRDIEVycm9yIHNhdmluZyBmaXh0dXJlOicsIGVycilcclxuICB9XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIkFBQUEsU0FBUyxlQUFlLFdBQVcsa0JBQWtCO0FBQ3JELFNBQVMsWUFBWTtBQUVkLFNBQVMsbUJBQW1CLFVBQWtCLE1BQWMsTUFBb0I7QUFDckYsUUFBTSxlQUFlLEtBQUssUUFBUSxJQUFJLEdBQUcsYUFBYSxjQUFjO0FBQ3BFLFFBQU0sYUFBYSxLQUFLLGNBQWMsUUFBUTtBQUM5QyxRQUFNLGNBQWMsS0FBSyxZQUFZLEdBQUcsUUFBUSxRQUFRLElBQUksT0FBTztBQUVuRSxNQUFJO0FBQ0YsUUFBSSxDQUFDLFdBQVcsVUFBVSxHQUFHO0FBQzNCLGdCQUFVLFlBQVksRUFBRSxXQUFXLEtBQUssQ0FBQztBQUFBLElBQzNDO0FBRUEsUUFBSSxXQUFXLFdBQVcsR0FBRztBQUMzQixjQUFRLElBQUkscUNBQThCLFdBQVcsRUFBRTtBQUN2RDtBQUFBLElBQ0Y7QUFFQSxVQUFNLGlCQUFpQjtBQUFBLGVBQ1osS0FBSyxVQUFVLElBQUksQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVEvQixrQkFBYyxhQUFhLGdCQUFnQixPQUFPO0FBQ2xELFlBQVEsSUFBSSx5QkFBb0IsV0FBVyxFQUFFO0FBQUEsRUFDL0MsU0FBUyxLQUFLO0FBQ1osWUFBUSxNQUFNLGdDQUEyQixHQUFHO0FBQUEsRUFDOUM7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
