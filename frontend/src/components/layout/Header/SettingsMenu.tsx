interface SettingsMenuProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function SettingsMenu({
  isDarkMode,
  onToggleDarkMode,
}: SettingsMenuProps) {
  return (
    <div className="settings-panel">
      <div className="settings-section">
        <label className="settings-row">
          <span>Dark mode</span>
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={onToggleDarkMode}
          />
        </label>
      </div>
      <div className="settings-divider" />
      <div className="settings-section">
        <label className="settings-label">NARA API Key</label>
        <input type="password" placeholder="Not used yet" disabled />
      </div>

      <div className="settings-section">
        <label className="settings-label">Download location</label>
        <input type="text" placeholder="/path/to/downloads" />
      </div>

      <div className="settings-section">
        <label className="settings-label">Archive repository</label>
        <input type="text" placeholder="/path/to/archive" />
      </div>

      <div className="settings-section">
        <label className="settings-label">Database address</label>
        <input type="text" placeholder="localhost:5432" />
      </div>
    </div>
  );
}
