// MainWindow.tsx - zaktualizowane importy
import { useState, useEffect } from "react";
import { Header } from "../components/layout";
import { SearchTab } from "./search";
import { BookmarksTab } from "./bookmarks";
import { AddBookmark } from "../components/bookmarks";
import { SearchProvider } from "../context/SearchContext";
import { BookmarkContext } from "../context/BookmarkContext";
import type { OpenAddBookmarkPayload } from "../context/BookmarkContext";
import TagProvider from "../api/utils/TagProvider";
import { useBookmarks } from "../api/hooks/useBokmarks";
import { useCategories, DEFAULT_CATEGORY } from "../api/hooks/useCategories";
import { type SearchTabId } from "../api/models/search.types";

export default function MainWindow() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<SearchTabId>("bookmarks");
  const [bookmarkModal, setBookmarkModal] =
    useState<OpenAddBookmarkPayload | null>(null);
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);
  const bookmarkOps = useBookmarks();

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
    <SearchProvider>
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
              onTabChange={setActiveTab}
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
    </SearchProvider>
  );
}
