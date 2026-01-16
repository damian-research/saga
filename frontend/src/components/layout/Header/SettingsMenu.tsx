// Settings.tsx
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
  const [draft, setDraft] = useState<AppSettings | null>(null);
  const [editable, setEditable] = useState<Record<string, boolean>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setDraft(loadSettings());
  }, []);

  function enableEdit(key: string) {
    setEditable((prev) => ({ ...prev, [key]: true }));
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
            onChange={(e) => {
              onToggleDarkMode();
              saveSettings({
                ...loadSettings(),
                darkMode: e.target.checked,
              });
            }}
          />
        </label>
      </div>
      {draft && (
        <>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Integration</h4>
            <label className={styles.label}>NARA API Key</label>
            <input
              type="password"
              value={draft.naraApiKey ?? ""}
              readOnly={!editable.naraApiKey}
              onDoubleClick={(e) => {
                e.stopPropagation();
                enableEdit("naraApiKey");
              }}
              onBlur={() => {
                setEditable((prev) => ({
                  ...prev,
                  naraApiKey: false,
                }));
              }}
              onChange={(e) => {
                setDraft({ ...draft, naraApiKey: e.target.value });
                setIsDirty(true);
              }}
              placeholder="Not used yet"
            />
          </div>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Storage</h4>
            <label className={styles.label}>Download location</label>
            <input
              type="text"
              value={draft.downloadPath}
              readOnly={!editable.downloadPath}
              onDoubleClick={(e) => {
                e.stopPropagation();
                enableEdit("downloadPath");
              }}
              onBlur={() => {
                setEditable((prev) => ({
                  ...prev,
                  downloadPath: false,
                }));
              }}
              onChange={(e) => {
                setDraft({ ...draft, downloadPath: e.target.value });
                setIsDirty(true);
              }}
              placeholder="/path/to/downloads"
            />
            <label className={styles.label}>Archive repository</label>
            <input
              type="text"
              value={draft.archivePath}
              readOnly={!editable.archivePath}
              onDoubleClick={(e) => {
                e.stopPropagation();
                enableEdit("archivePath");
              }}
              onBlur={() => {
                setEditable((prev) => ({
                  ...prev,
                  archivePath: false,
                }));
              }}
              onChange={(e) => {
                setDraft({ ...draft, archivePath: e.target.value });
                setIsDirty(true);
              }}
              placeholder="/path/to/archive"
            />
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Database</h4>
            <label className={styles.label}>Database address</label>
            <input
              type="text"
              value={draft.databaseAddress}
              readOnly={!editable.databaseAddress}
              onDoubleClick={(e) => {
                e.stopPropagation();
                enableEdit("databaseAddress");
              }}
              onBlur={() => {
                setEditable((prev) => ({
                  ...prev,
                  databaseAddress: false,
                }));
              }}
              onChange={(e) => {
                setDraft({ ...draft, databaseAddress: e.target.value });
                setIsDirty(true);
              }}
              placeholder="localhost:5432"
            />
          </div>

          <div className={styles.actions}>
            <button
              className={styles.applyButton}
              disabled={!isDirty}
              onClick={() => {
                saveSettings({
                  ...draft,
                  darkMode: loadSettings().darkMode,
                });
                setIsDirty(false);
                setEditable({});
              }}
            >
              <Save size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
