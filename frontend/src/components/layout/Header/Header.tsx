import { useState, useRef, useEffect } from "react";
import SettingsMenu from "./SettingsMenu";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({ isDarkMode, onToggleDarkMode }: HeaderProps) {
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
    <header className="app-header">
      <div className="header-logo">
        <img
          src={
            isDarkMode
              ? "/logo/saga_logo_small_dark.png"
              : "/logo/saga_logo_small.png"
          }
          alt="Saga"
          className="header-logo"
        />
        {/* <span>Saga</span> */}
      </div>
      <div className="header-actions" ref={containerRef}>
        <button
          className="hamburger-btn"
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
