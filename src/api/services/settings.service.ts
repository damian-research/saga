export interface AppSettings {
  darkMode: boolean;
  naraApiKey?: string;
  downloadPath: string;
  archivePath: string;
  databaseAddress: string;
}

export async function loadSettings(): Promise<AppSettings> {
  return window.electronAPI.settings.get();
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await window.electronAPI.settings.save(settings);
}
