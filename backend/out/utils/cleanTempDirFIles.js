import { readdir, rm, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
const cleanTempDirFIles = async (tempDir) => {
  try {
    if (!existsSync(tempDir)) {
      return;
    }
    const files = await readdir(tempDir, {
      encoding: "utf8",
      withFileTypes: true,
      recursive: true
    });
    for (const file of files) {
      const filePath = path.join(tempDir, file.name);
      try {
        const fsstat = await stat(filePath);
        if (fsstat.isDirectory()) {
          await rm(filePath, { recursive: true, force: true });
        } else {
          await unlink(filePath);
        }
      } catch (err) {
        console.warn(`Cannot delete file ${filePath}: ${err}`);
      }
    }
  } catch (err) {
    console.error("Error cleaning temp dir:", err);
  }
};
export {
  cleanTempDirFIles
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3V0aWxzL2NsZWFuVGVtcERpckZJbGVzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyByZWFkZGlyLCBybSwgc3RhdCwgdW5saW5rIH0gZnJvbSAnbm9kZTpmcy9wcm9taXNlcydcclxuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xyXG5pbXBvcnQgeyBleGlzdHNTeW5jIH0gZnJvbSAnbm9kZTpmcydcclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhblRlbXBEaXJGSWxlcyA9IGFzeW5jICh0ZW1wRGlyOiBzdHJpbmcpID0+IHtcclxuICB0cnkge1xyXG4gICAgaWYgKCFleGlzdHNTeW5jKHRlbXBEaXIpKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgY29uc3QgZmlsZXMgPSBhd2FpdCByZWFkZGlyKHRlbXBEaXIsIHtcclxuICAgICAgZW5jb2Rpbmc6ICd1dGY4JyxcclxuICAgICAgd2l0aEZpbGVUeXBlczogdHJ1ZSxcclxuICAgICAgcmVjdXJzaXZlOiB0cnVlXHJcbiAgICB9KVxyXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XHJcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKHRlbXBEaXIsIGZpbGUubmFtZSlcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBmc3N0YXQgPSBhd2FpdCBzdGF0KGZpbGVQYXRoKVxyXG4gICAgICAgIGlmIChmc3N0YXQuaXNEaXJlY3RvcnkoKSkge1xyXG4gICAgICAgICAgYXdhaXQgcm0oZmlsZVBhdGgsIHsgcmVjdXJzaXZlOiB0cnVlLCBmb3JjZTogdHJ1ZSB9KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhd2FpdCB1bmxpbmsoZmlsZVBhdGgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oYENhbm5vdCBkZWxldGUgZmlsZSAke2ZpbGVQYXRofTogJHtlcnJ9YClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgY2xlYW5pbmcgdGVtcCBkaXI6JywgZXJyKVxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiQUFBQSxTQUFTLFNBQVMsSUFBSSxNQUFNLGNBQWM7QUFDMUMsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsa0JBQWtCO0FBRXBCLE1BQU0sb0JBQW9CLE9BQU8sWUFBb0I7QUFDMUQsTUFBSTtBQUNGLFFBQUksQ0FBQyxXQUFXLE9BQU8sR0FBRztBQUN4QjtBQUFBLElBQ0Y7QUFDQSxVQUFNLFFBQVEsTUFBTSxRQUFRLFNBQVM7QUFBQSxNQUNuQyxVQUFVO0FBQUEsTUFDVixlQUFlO0FBQUEsTUFDZixXQUFXO0FBQUEsSUFDYixDQUFDO0FBQ0QsZUFBVyxRQUFRLE9BQU87QUFDeEIsWUFBTSxXQUFXLEtBQUssS0FBSyxTQUFTLEtBQUssSUFBSTtBQUM3QyxVQUFJO0FBQ0YsY0FBTSxTQUFTLE1BQU0sS0FBSyxRQUFRO0FBQ2xDLFlBQUksT0FBTyxZQUFZLEdBQUc7QUFDeEIsZ0JBQU0sR0FBRyxVQUFVLEVBQUUsV0FBVyxNQUFNLE9BQU8sS0FBSyxDQUFDO0FBQUEsUUFDckQsT0FBTztBQUNMLGdCQUFNLE9BQU8sUUFBUTtBQUFBLFFBQ3ZCO0FBQUEsTUFDRixTQUFTLEtBQUs7QUFDWixnQkFBUSxLQUFLLHNCQUFzQixRQUFRLEtBQUssR0FBRyxFQUFFO0FBQUEsTUFDdkQ7QUFBQSxJQUNGO0FBQUEsRUFDRixTQUFTLEtBQUs7QUFDWixZQUFRLE1BQU0sNEJBQTRCLEdBQUc7QUFBQSxFQUMvQztBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
