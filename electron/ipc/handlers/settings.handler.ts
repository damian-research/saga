import { ipcMain, app } from "electron";
import { IPC_CHANNELS } from "../channels";
import fs from "fs";
import path from "path";

interface AppSettings {
  darkMode: boolean;
  naraApiKey?: string;
  downloadPath: string;
  archivePath: string;
  databaseAddress: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  downloadPath: "",
  archivePath: "",
  databaseAddress: "",
};

function getSettingsPath(): string {
  return path.join(app.getPath("userData"), "settings.json");
}

export function registerSettingsHandlers() {
  ipcMain.handle(IPC_CHANNELS.SETTINGS_GET, (): AppSettings => {
    try {
      const data = fs.readFileSync(getSettingsPath(), "utf-8");
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.SETTINGS_SAVE,
    (_event, settings: AppSettings) => {
      fs.writeFileSync(getSettingsPath(), JSON.stringify(settings, null, 2));
    },
  );
}
