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
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="app-content">
        {activeTab === "bookmarks" && <BookmarksTab />}
        {activeTab === "nara" && <SearchNARATab />}
        {activeTab === "uk" && <SearchNAUKTab />}
      </div>
    </div>
  );
}
