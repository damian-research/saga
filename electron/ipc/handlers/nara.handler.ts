// electron/ipc/handlers/nara.handler.ts

import { ipcMain } from "electron";
import { NaraClientService } from "../../../backend/services/nara-client.service";
import { SettingsService } from "../../../backend/services/settings.service";
import type { Database } from "better-sqlite3";

let naraClient: NaraClientService | null = null;

function getNaraClient(db: Database): NaraClientService {
  if (!naraClient) {
    const settingsService = new SettingsService(db);
    const settings = settingsService.load();

    if (!settings.naraApiKey && process.env.NODE_ENV === "production") {
      throw new Error("NARA API key not configured. Set it in Settings.");
    }

    naraClient = new NaraClientService({
      baseUrl: settings.naraAddress || "",
      apiKey: settings.naraApiKey || "",
      timeoutSeconds: 30,
      useMock: process.env.USE_MOCK === "false",
    });

    console.log("[NARA] Client initialized with:", {
      baseUrl: settings.naraAddress || "default",
      hasKey: !!settings.naraApiKey,
    });
  }
  return naraClient;
}

export function registerNaraHandlers(db: Database) {
  ipcMain.handle("nara:search", async (_, queryString: string) => {
    try {
      return await getNaraClient(db).searchAndMapToEad3(queryString);
    } catch (error) {
      console.error("[NARA] Search failed:", error);
      throw new Error(error instanceof Error ? error.message : "Search failed");
    }
  });

  ipcMain.handle("nara:getFull", async (_, naId: number) => {
    try {
      return await getNaraClient(db).getFullAndMapToEad3(naId);
    } catch (error) {
      console.error("[NARA] Full search failed:", error);
      throw new Error(
        error instanceof Error ? error.message : "Full search failed",
      );
    }
  });

  ipcMain.handle(
    "nara:getChildren",
    async (_, parentId: number, limit?: number) => {
      try {
        return await getNaraClient(db).getChildrenAndMapToEad3(
          parentId,
          limit || 50,
        );
      } catch (error) {
        console.error("[NARA] Children search failed:", error);
        throw new Error(
          error instanceof Error ? error.message : "Children search failed",
        );
      }
    },
  );

  ipcMain.on("nara:settings-updated", () => {
    console.log("[NARA] Settings updated, invalidating client cache");
    naraClient = null;
  });
}
