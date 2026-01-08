import styles from "./SettingsMenu.module.css";

interface SettingsMenuProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function SettingsMenu({
  isDarkMode,
  onToggleDarkMode,
}: SettingsMenuProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <label className={styles.row}>
          <span>Dark mode</span>
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={onToggleDarkMode}
          />
        </label>
      </div>
      <div className={styles.divider} />
      <div className={styles.section}>
        <label className={styles.label}>NARA API Key</label>
        <input type="password" placeholder="Not used yet" disabled />
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Download location</label>
        <input type="text" placeholder="/path/to/downloads" />
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Archive repository</label>
        <input type="text" placeholder="/path/to/archive" />
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Database address</label>
        <input type="text" placeholder="localhost:5432" />
      </div>
    </div>
  );
}
