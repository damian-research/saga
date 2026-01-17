export interface AppSettings {
  darkMode: boolean;
  naraApiKey?: string;
  downloadPath: string;
  archivePath: string;
  databaseAddress: string;
}

const STORAGE_KEY = "saga.settings";

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  downloadPath: "",
  archivePath: "",
  databaseAddress: "",
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(raw),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
