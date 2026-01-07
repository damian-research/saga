import { useState } from "react";
import Header from "../components/layout/Header/Header";
import { SearchTab } from "../pages/search";

export default function MainWindow() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`app-root ${isDarkMode ? "dark-mode" : ""}`}>
      <Header isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      <div className="app-content">
        <SearchTab />
      </div>
    </div>
  );
}
