import { useState, useRef, useEffect } from "react";
import SettingsMenu from "./SettingsMenu";
import styles from "./Header.module.css";
import { Settings } from "../../icons/index";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: "bookmarks" | "search" | "uk";
  onTabChange: (tab: "bookmarks" | "search" | "uk") => void;
}

export default function Header({
  isDarkMode,
  onToggleDarkMode,
  activeTab,
  onTabChange,
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
          onClick={() => onTabChange("bookmarks")}
        >
          Bookmarks
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "search" ? styles.active : ""
          }`}
          onClick={() => onTabChange("search")}
        >
          NARA
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "uk" ? styles.active : ""
          }`}
          onClick={() => onTabChange("uk")}
        >
          UK NA
        </button>
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
