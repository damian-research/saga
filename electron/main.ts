import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { initDatabase, closeDatabase, getDatabase } from "../backend/db/client";
import { createTables } from "../backend/db/schema";
import { BookmarksService } from "../backend/services/bookmarks.service";
import { CategoriesService } from "../backend/services/categories.service";
import { TagsService } from "../backend/services/tags.service";
import { registerBookmarksHandlers } from "./ipc/handlers/bookmark.handler";
import { registerCategoriesHandlers } from "./ipc/handlers/categories.handler";
import { registerTagsHandlers } from "./ipc/handlers/tags.handler";
import { registerSettingsHandlers } from "./ipc/handlers/settings.handler";
import { registerMigrationHandlers } from "./ipc/handlers/migration.handler";
import { shell } from "electron";
import fs from "fs";
import https from "https";


const isDev = process.env.NODE_ENV === "development";

const ALLOWED_EXTERNAL_DOMAINS = [
  "https://catalog.archives.gov",
  "https://www.archives.gov",
];

const ALLOWED_DOWNLOAD_PREFIXES = [
  "https://s3.amazonaws.com/",
];

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 10,
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (ALLOWED_EXTERNAL_DOMAINS.some((d) => url.startsWith(d))) {
      shell.openExternal(url);
    }

    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    const currentUrl = win.webContents.getURL();

    if (url !== currentUrl) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

function downloadToFile(url: string, targetPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(targetPath);

    https
      .get(url, { agent: httpsAgent }, (response) => {
        if (response.statusCode && response.statusCode >= 400) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(targetPath, () => reject(err));
      });
  });
}

app.whenReady().then(() => {
  ipcMain.handle(
    "downloads:downloadFile",
    async (_, { url, filename }: { url: string; filename: string }) => {
      const downloadsDir = app.getPath("downloads");
      const targetPath = path.join(downloadsDir, filename);

      if (!ALLOWED_DOWNLOAD_PREFIXES.some((p) => url.startsWith(p))) {
        throw new Error("Invalid download source");
      }

      await downloadToFile(url, targetPath);
    },
  );

  const db = initDatabase();
  createTables(db);

  const categoriesService = new CategoriesService(db);
  const tagsService = new TagsService(db);
  const bookmarksService = new BookmarksService(db, tagsService);
  // main.ts (Electron)

  registerBookmarksHandlers(bookmarksService);
  registerCategoriesHandlers(categoriesService);
  registerTagsHandlers(tagsService);
  registerSettingsHandlers();
  registerMigrationHandlers(bookmarksService, categoriesService, tagsService);

  createWindow();
});

app.on("window-all-closed", () => {
  closeDatabase();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
