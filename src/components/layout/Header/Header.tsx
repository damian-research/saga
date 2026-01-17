// Header.tsx
import { useState, useRef, useEffect } from "react";
import SettingsMenu from "./SettingsMenu";
import styles from "./Header.module.css";
import { Settings } from "../../icons/index";
import { type SagaTabId } from "../../../api/models/search.types";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: SagaTabId;
  onSearchTab: () => void;
  onBookmarksTab: () => void;
}

export default function Header({
  isDarkMode,
  onToggleDarkMode,
  activeTab,
  onSearchTab,
  onBookmarksTab,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        open &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img
          src={
            isDarkMode
              ? "/logo/saga_logo_small_dark.png"
              : "/logo/saga_logo_small.png"
          }
          alt="Saga"
          className="styled-logo"
        />
        {/* <span>Saga</span> */}
      </div>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "bookmarks" ? styles.active : ""
          }`}
          onClick={onBookmarksTab}
        >
          Bookmarks
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "search" ? styles.active : ""
          }`}
          onClick={onSearchTab}
        >
          Search
        </button>
        {/* <button
          className={`${styles.tabButton} ${
            activeTab === "uk" ? styles.active : ""
          }`}
          onClick={() => onTabChange("uk")}
        >
          UK NA
        </button> */}
      </nav>

      <div className={styles.actions} ref={containerRef}>
        <button
          className={styles.settingsBtn}
          aria-label="Settings"
          onClick={() => setOpen((v) => !v)}
          title="Application settings"
        >
          <Settings size={18} />
        </button>

        {open && (
          <SettingsMenu
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
          />
        )}
      </div>
    </header>
  );
}
