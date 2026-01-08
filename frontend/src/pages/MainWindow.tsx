import { useState } from "react";
import Header from "../components/layout/Header/Header";
import { SearchTab as SearchNARATab } from "./searchNARA";
import { SearchTab as SearchNAUKTab } from "./searchNAUK";
import { BookmarksTab } from "./bookmarks";

type TabId = "bookmarks" | "nara" | "uk";

export default function MainWindow() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("nara");

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`app-root ${isDarkMode ? "dark-mode" : ""}`}>
      <Header isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />

      {/* Simple tab switch (no refactor needed) */}
      <div className="app-tabs">
        <button
          className={activeTab === "bookmarks" ? "active" : ""}
          onClick={() => setActiveTab("bookmarks")}
        >
          Bookmarks
        </button>
        <button
          className={activeTab === "nara" ? "active" : ""}
          onClick={() => setActiveTab("nara")}
        >
          NARA
        </button>
        <button
          className={activeTab === "uk" ? "active" : ""}
          onClick={() => setActiveTab("uk")}
        >
          UK NA
        </button>
      </div>

      <div className="app-content">
        {activeTab === "bookmarks" && <BookmarksTab />}
        {activeTab === "nara" && <SearchNARATab />}
        {activeTab === "uk" && <SearchNAUKTab />}
      </div>
    </div>
  );
}
