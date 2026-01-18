// Header/SettingsMenu.tsx
import { useState, useEffect } from "react";
import { Save } from "../../icons/index";
import styles from "./SettingsMenu.module.css";
import {
  loadSettings,
  saveSettings,
  type AppSettings,
} from "../../../api/services/settings.service";

interface SettingsMenuProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function SettingsMenu({
  isDarkMode,
  onToggleDarkMode,
}: SettingsMenuProps) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState<Record<string, boolean>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<
    "pending" | "complete" | "error"
  >("pending");

  useEffect(() => {
    loadSettings()
      .then((loaded) => {
        setSettings(loaded);
      })
      .finally(() => setLoading(false));

    const migrated = localStorage.getItem("saga.migrated_to_sqlite");
    setMigrationStatus(migrated === "true" ? "complete" : "pending");
  }, []);

  async function handleMigration() {
    try {
      const categories = JSON.parse(
        localStorage.getItem("saga.categories.json") || "[]",
      );
      const tags = JSON.parse(localStorage.getItem("saga.tags.json") || "[]");
      const bookmarks = JSON.parse(
        localStorage.getItem("saga.bookmarks.json") || "[]",
      );

      await window.electronAPI.migration.fromLocalStorage({
        categories,
        tags,
        bookmarks,
      });

      localStorage.setItem("saga.migrated_to_sqlite", "true");
      setMigrationStatus("complete");
    } catch (err) {
      console.error("Migration failed:", err);
      setMigrationStatus("error");
    }
  }

  async function handleSave() {
    if (!settings) return;
    await saveSettings(settings);
    setIsDirty(false);
    setEditable({});
  }

  async function toggleDarkMode() {
    if (!settings) return;
    const updated = { ...settings, darkMode: !settings.darkMode };
    setSettings(updated);
    await saveSettings(updated);
    onToggleDarkMode();
  }

  function updateField(field: keyof AppSettings, value: string) {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
    setIsDirty(true);
  }

  function enableEdit(key: string) {
    setEditable((prev) => ({ ...prev, [key]: true }));
  }

  function disableEdit(key: string) {
    setEditable((prev) => ({ ...prev, [key]: false }));
  }

  if (loading || !settings) {
    return <div className={styles.panel}>Loading settings...</div>;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Appearance</h4>
        <label className={styles.row}>
          <span>Dark mode</span>
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
        </label>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Integration</h4>
        <label className={styles.label}>NARA API Key</label>
        <input
          type="password"
          value={settings.naraApiKey ?? ""}
          readOnly={!editable.naraApiKey}
          onDoubleClick={(e) => {
            e.stopPropagation();
            enableEdit("naraApiKey");
          }}
          onBlur={() => disableEdit("naraApiKey")}
          onChange={(e) => updateField("naraApiKey", e.target.value)}
          placeholder="Not used yet"
        />
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Storage</h4>
        <label className={styles.label}>Download location</label>
        <input
          type="text"
          value={settings.downloadPath}
          readOnly={!editable.downloadPath}
          onDoubleClick={(e) => {
            e.stopPropagation();
            enableEdit("downloadPath");
          }}
          onBlur={() => disableEdit("downloadPath")}
          onChange={(e) => updateField("downloadPath", e.target.value)}
          placeholder="/path/to/downloads"
        />
        <label className={styles.label}>Archive repository</label>
        <input
          type="text"
          value={settings.archivePath}
          readOnly={!editable.archivePath}
          onDoubleClick={(e) => {
            e.stopPropagation();
            enableEdit("archivePath");
          }}
          onBlur={() => disableEdit("archivePath")}
          onChange={(e) => updateField("archivePath", e.target.value)}
          placeholder="/path/to/archive"
        />
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Database</h4>
        <label className={styles.label}>Database address</label>
        <input
          type="text"
          value={settings.databaseAddress}
          readOnly={!editable.databaseAddress}
          onDoubleClick={(e) => {
            e.stopPropagation();
            enableEdit("databaseAddress");
          }}
          onBlur={() => disableEdit("databaseAddress")}
          onChange={(e) => updateField("databaseAddress", e.target.value)}
          placeholder="localhost:5432"
        />
      </div>

      <div className={styles.actions}>
        <button
          className={styles.applyButton}
          disabled={!isDirty}
          onClick={handleSave}
        >
          <Save size={18} />
        </button>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Data Migration</h4>
        {migrationStatus === "pending" && (
          <button onClick={handleMigration}>Migrate to SQLite</button>
        )}
        {migrationStatus === "complete" && <p>✓ Data migrated</p>}
        {migrationStatus === "error" && <p>✗ Migration failed</p>}
      </div>

      <div className={styles.settingsFooter}>
        <div>Project Saga - Damian Kurgan</div>
        <div>
          Contact: <a href="mailto:saga.dk@pm.me">saga.dk@pm.me</a>
        </div>
      </div>
    </div>
  );
}
