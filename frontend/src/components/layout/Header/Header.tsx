import { useState, useRef, useEffect } from "react";
import SettingsMenu from "./SettingsMenu";
import styles from "./Header.module.css";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: "bookmarks" | "nara" | "uk";
  onTabChange: (tab: "bookmarks" | "nara" | "uk") => void;
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
            activeTab === "nara" ? styles.active : ""
          }`}
          onClick={() => onTabChange("nara")}
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
          className={styles.hamburgerBtn}
          aria-label="Settings"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
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
