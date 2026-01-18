import { app, BrowserWindow } from "electron";
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

const isDev = process.env.NODE_ENV === "development";

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

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  const db = initDatabase();
  createTables(db);

  const categoriesService = new CategoriesService(db);
  const tagsService = new TagsService(db);
  const bookmarksService = new BookmarksService(db, tagsService);

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
