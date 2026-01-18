import type { AppSetting } from "../../../backend/models/settings.types";

export async function loadSettings(): Promise<AppSetting> {
  return window.electronAPI.settings.get();
}

export async function saveSettings(settings: AppSetting): Promise<void> {
  await window.electronAPI.settings.save(settings);
}
