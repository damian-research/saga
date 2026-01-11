import { useState } from "react";
import Header from "../components/layout/Header/Header";
import { SearchTab as SearchTab } from "./search";
import { BookmarksTab } from "./bookmarks";
import type {
  Bookmark,
  WindowMode,
  Category,
} from "../api/models/bookmarks.types";
import AddBookmark from "../components/bookmarks/AddBookmark";
import { BookmarkContext } from "../context/BookmarkContext";

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

  function submitBookmarkFromMain(
    base: Bookmark,
    data: { category: Category; customName: string }
  ) {
    const record: Bookmark = {
      ...base,
      category: data.category,
      customName: data.customName,
      createdAt: base.createdAt || new Date().toISOString(),
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
            onCancel={() => setAddBookmarkState(null)}
            onSubmit={(data) => {
              if (addBookmarkState.mode === "add-manual") {
                // nowy bookmark z URL (resolver zrobi resztę)
                // submit dostanie bazowy bookmark z AddBookmark
                submitBookmarkFromMain(addBookmarkState.bookmark!, data);
              } else if (addBookmarkState.bookmark) {
                // add-from-search albo edit
                submitBookmarkFromMain(addBookmarkState.bookmark, data);
              }
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
