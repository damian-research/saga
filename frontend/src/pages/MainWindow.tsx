// MainWindow
//
// MainWindow.tsx
import { useEffect, useState } from "react";
import Header from "../components/layout/Header/Header";
import { SearchTab } from "./search";
import { BookmarksTab } from "./bookmarks";
import type { Bookmark, BookmarkCategory } from "../api/models/bookmarks.types";
import AddBookmark from "../components/bookmarks/AddBookmark";
import { BookmarkContext } from "../context/BookmarkContext";
import type { OpenAddBookmarkPayload } from "../context/BookmarkContext";
import {
  saveBookmark,
  removeBookmark,
  loadBookmarks,
} from "../api/services/bookmarks.service";
import {
  loadCategories,
  saveCategories,
} from "../api/services/categories.service";

type TabId = "bookmarks" | "nara" | "uk";

const DEFAULT_CATEGORY: BookmarkCategory = {
  id: "uncategorized",
  name: "Uncategorized",
  order: 0,
};

export default function MainWindow() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("bookmarks");

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [categories, setCategories] = useState<BookmarkCategory[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);

  const [bookmarkModal, setBookmarkModal] =
    useState<OpenAddBookmarkPayload | null>(null);

  // ===== LOAD DATA =====
  useEffect(() => {
    // bookmarks
    setLoadingBookmarks(true);
    const loadedBookmarks = loadBookmarks();
    setBookmarks(loadedBookmarks);
    setLoadingBookmarks(false);

    // categories
    const loadedCategories = loadCategories();
    if (loadedCategories.length === 0) {
      setCategories([DEFAULT_CATEGORY]);
      saveCategories([DEFAULT_CATEGORY]);
    } else {
      setCategories(loadedCategories);
    }
  }, []);

  // ===== BOOKMARK MODAL =====
  function openBookmarkWindow(payload: OpenAddBookmarkPayload) {
    setBookmarkModal(payload);
  }

  // ===== BOOKMARK CRUD =====
  function submitBookmark(bookmark: Bookmark) {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === bookmark.id);
      const next = exists
        ? prev.map((b) => (b.id === bookmark.id ? bookmark : b))
        : [...prev, bookmark];

      saveBookmark(bookmark);
      return next;
    });
  }

  function handleRemoveBookmark(id: string) {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    removeBookmark(id);
  }

  // ===== CATEGORY CRUD =====
  function addCategory(name: string) {
    setCategories((prev) => {
      const next = [
        ...prev,
        {
          id: crypto.randomUUID(),
          name,
          order: prev.length,
        },
      ];
      saveCategories(next);
      return next;
    });
  }

  function renameCategory(id: string, name: string) {
    setCategories((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, name } : c));
      saveCategories(next);
      return next;
    });
  }

  function removeCategory(id: string) {
    if (id === DEFAULT_CATEGORY.id) return;

    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveCategories(next);
      return next;
    });

    // migrate bookmarks → Uncategorized
    setBookmarks((prev) =>
      prev.map((b) =>
        b.categoryId === id ? { ...b, categoryId: DEFAULT_CATEGORY.id } : b
      )
    );
  }

  function updateBookmarkCategory(id: string, categoryId: string) {
    setBookmarks((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, categoryId } : b));
      const updated = next.find((b) => b.id === id);
      if (updated) saveBookmark(updated);
      return next;
    });
  }

  return (
    <BookmarkContext.Provider
      value={{
        openBookmarkWindow,
        categories,
        addCategory,
        renameCategory,
        removeCategory,
        updateBookmarkCategory,
      }}
    >
      <div className={`app-root ${isDarkMode ? "dark-mode" : ""}`}>
        <Header
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((v) => !v)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {bookmarkModal && (
          <AddBookmark
            mode={bookmarkModal.mode}
            record={bookmarkModal.record}
            bookmark={bookmarkModal.bookmark}
            categories={categories}
            onClose={() => setBookmarkModal(null)}
            onSave={(bookmark) => {
              submitBookmark(bookmark);
              setBookmarkModal(null);
            }}
          />
        )}

        <div className="app-content">
          {activeTab === "bookmarks" && (
            <BookmarksTab
              bookmarks={bookmarks}
              loading={loadingBookmarks}
              onRemoveBookmark={handleRemoveBookmark}
            />
          )}

          {activeTab === "nara" && <SearchTab />}
        </div>
      </div>
    </BookmarkContext.Provider>
  );
}
