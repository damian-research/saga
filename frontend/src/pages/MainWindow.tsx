// MainWindow - REFACTORED
//
import { useState } from "react";
import Header from "../components/layout/Header/Header";
import { SearchTab } from "./search";
import { BookmarksTab } from "./bookmarks";
import type { Bookmark, WindowMode } from "../api/models/bookmarks.types";
import AddBookmark from "../components/bookmarks/AddBookmark";
import { BookmarkContext } from "../context/BookmarkContext";
import {
  saveBookmark,
  removeBookmark,
} from "../api/services/bookmarks.service";

type TabId = "bookmarks" | "nara" | "uk";

export default function MainWindow() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("bookmarks");
  const [addBookmarkState, setAddBookmarkState] = useState<{
    mode: WindowMode;
    bookmark: Bookmark | null;
  } | null>(null);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  function openAddBookmark(bookmark: Bookmark | null, mode: WindowMode) {
    setAddBookmarkState({ mode, bookmark });
  }

  function submitBookmark(bookmark: Bookmark) {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === bookmark.id);

      const next = exists
        ? prev.map((b) => (b.id === bookmark.id ? bookmark : b))
        : [...prev, bookmark];

      // persistence (side-effect)
      saveBookmark(bookmark);

      return next;
    });
  }

  function handleRemoveBookmark(id: string) {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    removeBookmark(id); // persistence only
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
            onCancel={() => setAddBookmarkState(null)}
            onSubmit={(bookmark) => {
              submitBookmark(bookmark);
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
              onAddBookmark={() =>
                setAddBookmarkState({ mode: "add-manual", bookmark: null })
              }
              onRemoveBookmark={handleRemoveBookmark}
            />
          )}
          {activeTab === "nara" && <SearchTab />}
        </div>
      </div>
    </BookmarkContext.Provider>
  );
}
