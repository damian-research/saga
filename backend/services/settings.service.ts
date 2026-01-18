// backend/services/settings.service.ts

import { Database } from "better-sqlite3";
import { AppSetting } from "../models/settings.types";

interface SettingRow {
  key: string;
  value: string;
}

const DEFAULT_SETTINGS: AppSetting = {
  darkMode: false,
  naraApiKey: "",
  naraAddress: "",
  downloadPath: "",
  archivePath: "",
  databaseAddress: "",
};

export class SettingsService {
  private cache: AppSetting | null = null;

  constructor(private db: Database) {}

  load(): AppSetting {
    if (this.cache) return this.cache;

    const rows = this.db
      .prepare("SELECT key, value FROM settings")
      .all() as SettingRow[];

    const result: AppSetting = { ...DEFAULT_SETTINGS };

    for (const row of rows) {
      try {
        (result as any)[row.key] = JSON.parse(row.value);
      } catch {
        (result as any)[row.key] = row.value;
      }
    }

    this.cache = result;
    return result;
  }

  save(settings: AppSetting): void {
    // Validate URL format
    if (settings.naraAddress && !settings.naraAddress.startsWith("http")) {
      throw new Error("Invalid NARA address - must start with http/https");
    }

    const stmt = this.db.prepare(
      "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
    );

    const tx = this.db.transaction(() => {
      for (const [key, value] of Object.entries(settings)) {
        stmt.run(key, JSON.stringify(value));
      }
    });

    tx();
    this.cache = settings;
  }

  get<K extends keyof AppSetting>(key: K): AppSetting[K] | undefined {
    const row = this.db
      .prepare("SELECT value FROM settings WHERE key = ?")
      .get(key) as SettingRow | undefined;

    if (!row) return undefined;

    try {
      return JSON.parse(row.value);
    } catch {
      return row.value as any;
    }
  }
}
