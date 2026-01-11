import { useState } from "react";
import Header from "../components/layout/Header/Header";
import { SearchTab as SearchTab } from "./search";
import { BookmarksTab } from "./bookmarks";
import type { Bookmark } from "../api/models/bookmarks.types";
import AddBookmark from "../components/bookmarks/AddBookmark";
import { BookmarkContext } from "../context/BookmarkContext";

type TabId = "bookmarks" | "nara" | "uk";

export default function MainWindow() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("bookmarks");
  const [addBookmarkState, setAddBookmarkState] = useState<{
    mode: "add" | "edit";
    bookmark: Bookmark;
  } | null>(null);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const TEMP_CATEGORIES = [
    "General",
    "Research",
    "WWII",
    "Intelligence",
    "Operations",
    "Technology",
  ];

  function openAddBookmark(bookmark: Bookmark) {
    setAddBookmarkState({
      mode: "add",
      bookmark,
    });
  }

  function submitBookmarkFromMain(
    base: Bookmark,
    data: { category: string; customName: string }
  ) {
    const record: Bookmark = {
      ...base,
      category: data.category,
      customName: data.customName,
    };

    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === record.id);
      return exists
        ? prev.map((b) => (b.id === record.id ? record : b))
        : [...prev, record];
    });
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <BookmarkContext.Provider value={{ openAddBookmark }}>
      <div className={`app-root ${isDarkMode ? "dark-mode" : ""}`}>
        <Header
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {addBookmarkState && (
          <AddBookmark
            mode={addBookmarkState.mode}
            bookmark={addBookmarkState.bookmark}
            // categories={[...new Set(bookmarks.map((b) => b.category))]}
            categories={TEMP_CATEGORIES}
            onCancel={() => setAddBookmarkState(null)}
            onSubmit={(data) => {
              submitBookmarkFromMain(addBookmarkState.bookmark, data);
              setAddBookmarkState(null);
            }}
          />
        )}

        <div className="app-content">
          {activeTab === "bookmarks" && (
            <BookmarksTab
              bookmarks={bookmarks}
              setBookmarks={setBookmarks}
              onEditBookmark={(b) =>
                setAddBookmarkState({ mode: "edit", bookmark: b })
              }
            />
          )}
          {activeTab === "nara" && <SearchTab />}
        </div>
      </div>
    </BookmarkContext.Provider>
  );
}
