// MainWindow.tsx - zaktualizowane importy
import { useState, useEffect } from "react";
import { Header } from "../components/layout";
import { SearchTab } from "./search";
import { BookmarksTab } from "./bookmarks";
import { AddBookmark } from "../components/bookmarks";
import { useSearch } from "../context/SearchContext";
import { BookmarkContext } from "../context/BookmarkContext";
import type { OpenAddBookmarkPayload } from "../context/BookmarkContext";
import TagProvider from "../api/utils/TagProvider";
import { useBookmarks } from "../api/hooks/useBokmarks";
import { useCategories, DEFAULT_CATEGORY } from "../api/hooks/useCategories";


export default function MainWindow() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { activeTab, switchToSearchTab, switchToBookmarksTab } = useSearch();
  const [bookmarkModal, setBookmarkModal] =
    useState<OpenAddBookmarkPayload | null>(null);
  const bookmarkOps = useBookmarks();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const categoryOps = useCategories((removedCategoryId) => {
    bookmarkOps.updateMany((prev) =>
      prev.map((b) =>
        b.categoryId === removedCategoryId
          ? { ...b, categoryId: DEFAULT_CATEGORY.id }
          : b
      )
    );
  });

  return (
    <BookmarkContext.Provider
      value={{
        openBookmarkWindow: setBookmarkModal,
        bookmarks: bookmarkOps.bookmarks,
        ...categoryOps,
        updateBookmarkCategory: bookmarkOps.updateCategory,
        updateBookmarks: bookmarkOps.updateMany,
      }}
    >
      <TagProvider>
        <div className={"app-root"}>
          <Header
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode((v) => !v)}
            activeTab={activeTab}
            onSearchTab={switchToSearchTab}
            onBookmarksTab={switchToBookmarksTab}
          />

          {bookmarkModal && (
            <AddBookmark
              mode={bookmarkModal.mode}
              record={bookmarkModal.record}
              bookmark={bookmarkModal.bookmark}
              onClose={() => setBookmarkModal(null)}
              onSave={(bookmark) => {
                bookmarkOps.saveOne(bookmark);
                setBookmarkModal(null);
              }}
            />
          )}

          <div className="app-content">
            {activeTab === "bookmarks" && (
              <BookmarksTab
                bookmarks={bookmarkOps.bookmarks}
                loading={bookmarkOps.loading}
                onRemoveBookmark={bookmarkOps.remove}
              />
            )}
            {activeTab === "search" && <SearchTab />}
          </div>
        </div>
      </TagProvider>
    </BookmarkContext.Provider>
  );
}
