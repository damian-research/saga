// electron/ipc/handlers/settings.handler.ts

import { ipcMain } from "electron";
import { IPC_CHANNELS } from "../channels";
import { SettingsService } from "../../../backend/services/settings.service";
import { AppSetting } from "../../../backend/models/settings.types";
import type { Database } from "better-sqlite3";

export function registerSettingsHandlers(db: Database) {
  const settingsService = new SettingsService(db);

  ipcMain.handle(IPC_CHANNELS.SETTINGS_GET, (): AppSetting => {
    try {
      return settingsService.load();
    } catch (error) {
      console.error("[NARA] Settings load failed:", error);
      throw new Error(
        error instanceof Error ? error.message : "Settings load failed",
      );
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.SETTINGS_SAVE,
    (event, settings: AppSetting): void => {
      try {
        settingsService.save(settings);

        // Invalidate NARA client
        event.sender.send("nara:settings-updated");
      } catch (error) {
        console.error("[NARA] Settings save failed:", error);
        throw new Error(
          error instanceof Error ? error.message : "Settings save failed",
        );
      }
    },
  );
}
