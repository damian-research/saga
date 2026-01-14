// useTagOperations.ts
import { useContext } from "react";
import { BookmarkContext, TagContext } from "../../context/BookmarkContext";

export function useTagOperations() {
  const tagCtx = useContext(TagContext);
  const bookmarkCtx = useContext(BookmarkContext);

  if (!tagCtx) throw new Error("TagContext missing");
  if (!bookmarkCtx) throw new Error("BookmarkContext missing");

  const { renameTag, removeTag } = tagCtx;
  const { updateBookmarks } = bookmarkCtx;

  function mergeTags(fromName: string, toName: string) {
    updateBookmarks((prev) =>
      prev.map((b) =>
        b.tags?.includes(fromName)
          ? {
              ...b,
              tags: Array.from(
                new Set(b.tags.filter((t) => t !== fromName).concat(toName))
              ),
            }
          : b
      )
    );
  }

  function removeTagEverywhere(tagName: string) {
    updateBookmarks((prev) =>
      prev.map((b) => ({
        ...b,
        tags: b.tags?.filter((t) => t !== tagName),
      }))
    );
  }

  return {
    renameTag,
    mergeTags,
    removeTagEverywhere,
    removeTag,
  };
}
