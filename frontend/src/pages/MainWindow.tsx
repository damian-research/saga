// MainWindow.tsx - zaktualizowane importy
import { useState } from "react";
import { Header } from "../components/layout";
import { SearchTab } from "./search";
import { BookmarksTab } from "./bookmarks";
import { AddBookmark } from "../components/bookmarks";
import { BookmarkContext } from "../context/BookmarkContext";
import type { OpenAddBookmarkPayload } from "../context/BookmarkContext";
import TagProvider from "../api/utils/TagProvider";
import { useBookmarks } from "../api/hooks/useBokmarks";
import { useCategories, DEFAULT_CATEGORY } from "../api/hooks/useCategories";

type TabId = "bookmarks" | "nara" | "uk";

export default function MainWindow() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("bookmarks");
  const [bookmarkModal, setBookmarkModal] =
    useState<OpenAddBookmarkPayload | null>(null);

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
    <BookmarkContext.Provider
      value={{
        openBookmarkWindow: setBookmarkModal,
        ...categoryOps,
        updateBookmarkCategory: bookmarkOps.updateCategory,
        updateBookmarks: bookmarkOps.updateMany,
      }}
    >
      <TagProvider>
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
            {activeTab === "nara" && <SearchTab />}
          </div>
        </div>
      </TagProvider>
    </BookmarkContext.Provider>
  );
}
