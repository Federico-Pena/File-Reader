import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { apiConfig } from "../config/apiConfig.js";
const fileUploadController = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      res.status(400).json({ error: "Can't find file" });
      return;
    }
    const { lang, initPage, endPage } = req.body;
    const { buffer, originalname } = req.file;
    const fileExt = originalname.split(".").pop()?.toLowerCase() || "";
    const mimeTypes = apiConfig.ACCEPTED_MIME_TYPES;
    if (!mimeTypes.includes(fileExt)) {
      const clientMimeTypes = mimeTypes.map((type) => `"${type}"`).join(", ");
      res.status(400).json({ error: `Formats allowed are: ${clientMimeTypes}.` });
      return;
    }
    const fileId = await saveTempFile(fileExt, buffer);
    const baseUrl = `${apiConfig.API_BASE_URL}${apiConfig.API_ROUTES.streamingFile}`;
    const url = `${baseUrl}?fileId=${fileId}&ext=${fileExt}&lang=${lang}&initPage=${initPage}&endPage=${endPage}&fileName=${originalname}`;
    res.status(200).json({ url });
  } catch (error) {
    console.error("fileUploadController error", error);
    res.status(500).json({ error: "Can't upload file" });
  }
};
var fileUploadController_default = fileUploadController;
const saveTempFile = async (fileExt, buffer) => {
  try {
    const dirPath = apiConfig.PATH_DIR_TEMP_FILES;
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    const files = await readdir(dirPath);
    const ids = files.map((f) => f.split(".")[0]).filter((s) => !!s).map((s) => parseInt(s, 10)).filter((n) => !isNaN(n)).sort((a, b) => a - b);
    const fileId = (ids.pop() ?? 0) + 1;
    const fileName = `${fileId}.${fileExt}`;
    const tempPath = join(dirPath, fileName);
    await writeFile(tempPath, buffer);
    return fileId;
  } catch (error) {
    throw new Error(`Error saving temp file: ${error}`);
  }
};
export {
  fileUploadController_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2NvbnRyb2xsZXJzL2ZpbGVVcGxvYWRDb250cm9sbGVyLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgdHlwZSB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcydcclxuaW1wb3J0IHsgcmVhZGRpciwgd3JpdGVGaWxlIH0gZnJvbSAnbm9kZTpmcy9wcm9taXNlcydcclxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ25vZGU6cGF0aCdcclxuaW1wb3J0IHsgZXhpc3RzU3luYywgbWtkaXJTeW5jIH0gZnJvbSAnbm9kZTpmcydcclxuaW1wb3J0IHsgYXBpQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2FwaUNvbmZpZy5qcydcclxuXHJcbmNvbnN0IGZpbGVVcGxvYWRDb250cm9sbGVyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBpZiAoIXJlcS5maWxlIHx8ICFyZXEuZmlsZS5idWZmZXIpIHtcclxuICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJDYW4ndCBmaW5kIGZpbGVcIiB9KVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IHsgbGFuZywgaW5pdFBhZ2UsIGVuZFBhZ2UgfSA9IHJlcS5ib2R5XHJcbiAgICBjb25zdCB7IGJ1ZmZlciwgb3JpZ2luYWxuYW1lIH0gPSByZXEuZmlsZVxyXG4gICAgY29uc3QgZmlsZUV4dCA9IG9yaWdpbmFsbmFtZS5zcGxpdCgnLicpLnBvcCgpPy50b0xvd2VyQ2FzZSgpIHx8ICcnXHJcbiAgICBjb25zdCBtaW1lVHlwZXMgPSBhcGlDb25maWcuQUNDRVBURURfTUlNRV9UWVBFU1xyXG5cclxuICAgIGlmICghbWltZVR5cGVzLmluY2x1ZGVzKGZpbGVFeHQpKSB7XHJcbiAgICAgIGNvbnN0IGNsaWVudE1pbWVUeXBlcyA9IG1pbWVUeXBlcy5tYXAoKHR5cGUpID0+IGBcIiR7dHlwZX1cImApLmpvaW4oJywgJylcclxuICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogYEZvcm1hdHMgYWxsb3dlZCBhcmU6ICR7Y2xpZW50TWltZVR5cGVzfS5gIH0pXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZpbGVJZCA9IGF3YWl0IHNhdmVUZW1wRmlsZShmaWxlRXh0LCBidWZmZXIpXHJcbiAgICBjb25zdCBiYXNlVXJsID0gYCR7YXBpQ29uZmlnLkFQSV9CQVNFX1VSTH0ke2FwaUNvbmZpZy5BUElfUk9VVEVTLnN0cmVhbWluZ0ZpbGV9YFxyXG4gICAgY29uc3QgdXJsID0gYCR7YmFzZVVybH0/ZmlsZUlkPSR7ZmlsZUlkfSZleHQ9JHtmaWxlRXh0fSZsYW5nPSR7bGFuZ30maW5pdFBhZ2U9JHtpbml0UGFnZX0mZW5kUGFnZT0ke2VuZFBhZ2V9JmZpbGVOYW1lPSR7b3JpZ2luYWxuYW1lfWBcclxuXHJcbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHVybCB9KVxyXG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ2ZpbGVVcGxvYWRDb250cm9sbGVyIGVycm9yJywgZXJyb3IpXHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIkNhbid0IHVwbG9hZCBmaWxlXCIgfSlcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZpbGVVcGxvYWRDb250cm9sbGVyXHJcblxyXG5jb25zdCBzYXZlVGVtcEZpbGUgPSBhc3luYyAoZmlsZUV4dDogc3RyaW5nLCBidWZmZXI6IEJ1ZmZlcikgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBkaXJQYXRoID0gYXBpQ29uZmlnLlBBVEhfRElSX1RFTVBfRklMRVNcclxuICAgIGlmICghZXhpc3RzU3luYyhkaXJQYXRoKSkge1xyXG4gICAgICBta2RpclN5bmMoZGlyUGF0aCwgeyByZWN1cnNpdmU6IHRydWUgfSlcclxuICAgIH1cclxuICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgcmVhZGRpcihkaXJQYXRoKVxyXG4gICAgY29uc3QgaWRzID0gZmlsZXNcclxuICAgICAgLm1hcCgoZikgPT4gZi5zcGxpdCgnLicpWzBdKVxyXG4gICAgICAuZmlsdGVyKChzKTogcyBpcyBzdHJpbmcgPT4gISFzKVxyXG4gICAgICAubWFwKChzKSA9PiBwYXJzZUludChzLCAxMCkpXHJcbiAgICAgIC5maWx0ZXIoKG4pID0+ICFpc05hTihuKSlcclxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEgLSBiKVxyXG5cclxuICAgIGNvbnN0IGZpbGVJZCA9IChpZHMucG9wKCkgPz8gMCkgKyAxXHJcblxyXG4gICAgY29uc3QgZmlsZU5hbWUgPSBgJHtmaWxlSWR9LiR7ZmlsZUV4dH1gXHJcbiAgICBjb25zdCB0ZW1wUGF0aCA9IGpvaW4oZGlyUGF0aCwgZmlsZU5hbWUpXHJcblxyXG4gICAgYXdhaXQgd3JpdGVGaWxlKHRlbXBQYXRoLCBidWZmZXIpXHJcbiAgICByZXR1cm4gZmlsZUlkXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3Igc2F2aW5nIHRlbXAgZmlsZTogJHtlcnJvcn1gKVxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiQUFDQSxTQUFTLFNBQVMsaUJBQWlCO0FBQ25DLFNBQVMsWUFBWTtBQUNyQixTQUFTLFlBQVksaUJBQWlCO0FBQ3RDLFNBQVMsaUJBQWlCO0FBRTFCLE1BQU0sdUJBQXVCLE9BQU8sS0FBYyxRQUFrQjtBQUNsRSxNQUFJO0FBQ0YsUUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxRQUFRO0FBQ2pDLFVBQUksT0FBTyxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sa0JBQWtCLENBQUM7QUFDakQ7QUFBQSxJQUNGO0FBQ0EsVUFBTSxFQUFFLE1BQU0sVUFBVSxRQUFRLElBQUksSUFBSTtBQUN4QyxVQUFNLEVBQUUsUUFBUSxhQUFhLElBQUksSUFBSTtBQUNyQyxVQUFNLFVBQVUsYUFBYSxNQUFNLEdBQUcsRUFBRSxJQUFJLEdBQUcsWUFBWSxLQUFLO0FBQ2hFLFVBQU0sWUFBWSxVQUFVO0FBRTVCLFFBQUksQ0FBQyxVQUFVLFNBQVMsT0FBTyxHQUFHO0FBQ2hDLFlBQU0sa0JBQWtCLFVBQVUsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEdBQUcsRUFBRSxLQUFLLElBQUk7QUFDdEUsVUFBSSxPQUFPLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyx3QkFBd0IsZUFBZSxJQUFJLENBQUM7QUFDMUU7QUFBQSxJQUNGO0FBRUEsVUFBTSxTQUFTLE1BQU0sYUFBYSxTQUFTLE1BQU07QUFDakQsVUFBTSxVQUFVLEdBQUcsVUFBVSxZQUFZLEdBQUcsVUFBVSxXQUFXLGFBQWE7QUFDOUUsVUFBTSxNQUFNLEdBQUcsT0FBTyxXQUFXLE1BQU0sUUFBUSxPQUFPLFNBQVMsSUFBSSxhQUFhLFFBQVEsWUFBWSxPQUFPLGFBQWEsWUFBWTtBQUVwSSxRQUFJLE9BQU8sR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUM7QUFBQSxFQUM5QixTQUFTLE9BQVk7QUFDbkIsWUFBUSxNQUFNLDhCQUE4QixLQUFLO0FBQ2pELFFBQUksT0FBTyxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sb0JBQW9CLENBQUM7QUFBQSxFQUNyRDtBQUNGO0FBRUEsSUFBTywrQkFBUTtBQUVmLE1BQU0sZUFBZSxPQUFPLFNBQWlCLFdBQW1CO0FBQzlELE1BQUk7QUFDRixVQUFNLFVBQVUsVUFBVTtBQUMxQixRQUFJLENBQUMsV0FBVyxPQUFPLEdBQUc7QUFDeEIsZ0JBQVUsU0FBUyxFQUFFLFdBQVcsS0FBSyxDQUFDO0FBQUEsSUFDeEM7QUFDQSxVQUFNLFFBQVEsTUFBTSxRQUFRLE9BQU87QUFDbkMsVUFBTSxNQUFNLE1BQ1QsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFDMUIsT0FBTyxDQUFDLE1BQW1CLENBQUMsQ0FBQyxDQUFDLEVBQzlCLElBQUksQ0FBQyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFDMUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUN2QixLQUFLLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQztBQUV2QixVQUFNLFVBQVUsSUFBSSxJQUFJLEtBQUssS0FBSztBQUVsQyxVQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksT0FBTztBQUNyQyxVQUFNLFdBQVcsS0FBSyxTQUFTLFFBQVE7QUFFdkMsVUFBTSxVQUFVLFVBQVUsTUFBTTtBQUNoQyxXQUFPO0FBQUEsRUFDVCxTQUFTLE9BQU87QUFDZCxVQUFNLElBQUksTUFBTSwyQkFBMkIsS0FBSyxFQUFFO0FBQUEsRUFDcEQ7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
