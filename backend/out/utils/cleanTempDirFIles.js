import { readdir, rm, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
const cleanTempDirFIles = async (tempDir) => {
  try {
    if (!existsSync(tempDir)) {
      console.log("Temp dir does not exist");
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
    console.log("Temp dir cleaned");
  } catch (err) {
    console.error("Error cleaning temp dir:", err);
  }
};
export {
  cleanTempDirFIles
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3V0aWxzL2NsZWFuVGVtcERpckZJbGVzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyByZWFkZGlyLCBybSwgc3RhdCwgdW5saW5rIH0gZnJvbSAnbm9kZTpmcy9wcm9taXNlcydcclxuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xyXG5pbXBvcnQgeyBleGlzdHNTeW5jIH0gZnJvbSAnbm9kZTpmcydcclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhblRlbXBEaXJGSWxlcyA9IGFzeW5jICh0ZW1wRGlyOiBzdHJpbmcpID0+IHtcclxuICB0cnkge1xyXG4gICAgaWYgKCFleGlzdHNTeW5jKHRlbXBEaXIpKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdUZW1wIGRpciBkb2VzIG5vdCBleGlzdCcpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgY29uc3QgZmlsZXMgPSBhd2FpdCByZWFkZGlyKHRlbXBEaXIsIHtcclxuICAgICAgZW5jb2Rpbmc6ICd1dGY4JyxcclxuICAgICAgd2l0aEZpbGVUeXBlczogdHJ1ZSxcclxuICAgICAgcmVjdXJzaXZlOiB0cnVlXHJcbiAgICB9KVxyXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XHJcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKHRlbXBEaXIsIGZpbGUubmFtZSlcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBmc3N0YXQgPSBhd2FpdCBzdGF0KGZpbGVQYXRoKVxyXG4gICAgICAgIGlmIChmc3N0YXQuaXNEaXJlY3RvcnkoKSkge1xyXG4gICAgICAgICAgYXdhaXQgcm0oZmlsZVBhdGgsIHsgcmVjdXJzaXZlOiB0cnVlLCBmb3JjZTogdHJ1ZSB9KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhd2FpdCB1bmxpbmsoZmlsZVBhdGgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oYENhbm5vdCBkZWxldGUgZmlsZSAke2ZpbGVQYXRofTogJHtlcnJ9YClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2coJ1RlbXAgZGlyIGNsZWFuZWQnKVxyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgY2xlYW5pbmcgdGVtcCBkaXI6JywgZXJyKVxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiQUFBQSxTQUFTLFNBQVMsSUFBSSxNQUFNLGNBQWM7QUFDMUMsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsa0JBQWtCO0FBRXBCLE1BQU0sb0JBQW9CLE9BQU8sWUFBb0I7QUFDMUQsTUFBSTtBQUNGLFFBQUksQ0FBQyxXQUFXLE9BQU8sR0FBRztBQUN4QixjQUFRLElBQUkseUJBQXlCO0FBQ3JDO0FBQUEsSUFDRjtBQUNBLFVBQU0sUUFBUSxNQUFNLFFBQVEsU0FBUztBQUFBLE1BQ25DLFVBQVU7QUFBQSxNQUNWLGVBQWU7QUFBQSxNQUNmLFdBQVc7QUFBQSxJQUNiLENBQUM7QUFDRCxlQUFXLFFBQVEsT0FBTztBQUN4QixZQUFNLFdBQVcsS0FBSyxLQUFLLFNBQVMsS0FBSyxJQUFJO0FBQzdDLFVBQUk7QUFDRixjQUFNLFNBQVMsTUFBTSxLQUFLLFFBQVE7QUFDbEMsWUFBSSxPQUFPLFlBQVksR0FBRztBQUN4QixnQkFBTSxHQUFHLFVBQVUsRUFBRSxXQUFXLE1BQU0sT0FBTyxLQUFLLENBQUM7QUFBQSxRQUNyRCxPQUFPO0FBQ0wsZ0JBQU0sT0FBTyxRQUFRO0FBQUEsUUFDdkI7QUFBQSxNQUNGLFNBQVMsS0FBSztBQUNaLGdCQUFRLEtBQUssc0JBQXNCLFFBQVEsS0FBSyxHQUFHLEVBQUU7QUFBQSxNQUN2RDtBQUFBLElBQ0Y7QUFDQSxZQUFRLElBQUksa0JBQWtCO0FBQUEsRUFDaEMsU0FBUyxLQUFLO0FBQ1osWUFBUSxNQUFNLDRCQUE0QixHQUFHO0FBQUEsRUFDL0M7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
