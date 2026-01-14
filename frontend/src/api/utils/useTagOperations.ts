// useTagOperations.ts
import { useContext } from "react";
import { TagContext } from "../../context/BookmarkContext";
import type { Bookmark } from "../../api/models/bookmarks.types";

export function useTagOperations(
  bookmarks: Bookmark[],
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>
) {
  const tagCtx = useContext(TagContext);
  if (!tagCtx) throw new Error("TagContext missing");

  const { renameTag, removeTag } = tagCtx;

  function mergeTags(fromName: string, toName: string) {
    setBookmarks((prev) =>
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
    setBookmarks((prev) =>
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
