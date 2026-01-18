import { useEffect, useState } from "react";
import type { Tag } from "../../api/models/bookmarks.types";

export function useTagOperations() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    window.electronAPI.tags
      .getAll()
      .then(setTags)
      .catch((err) => console.error("Failed to load tags:", err))
      .finally(() => setLoading(false));
  }, []);

  async function createTag(name: string, label: string): Promise<Tag | null> {
    try {
      const newTag: Tag = {
        id: crypto.randomUUID(),
        name: name.toLowerCase(),
        label,
        createdAt: new Date().toISOString(),
      };

      const created = await window.electronAPI.tags.create(newTag);
      setTags((prev) => [...prev, created]);
      return created;
    } catch (err) {
      console.error("Failed to create tag:", err);
      return null;
    }
  }

  async function updateTag(id: string, label: string) {
    try {
      const updated = await window.electronAPI.tags.update(id, label);
      if (updated) {
        setTags((prev) => prev.map((t) => (t.id === id ? updated : t)));
      }
    } catch (err) {
      console.error("Failed to update tag:", err);
    }
  }

  async function deleteTag(id: string) {
    try {
      await window.electronAPI.tags.delete(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete tag:", err);
    }
  }

  function findOrCreate(name: string): Tag | null {
    const normalized = name.toLowerCase();
    return tags.find((t) => t.name === normalized) || null;
  }

  async function mergeTags(fromName: string, toName: string) {
    // Get all bookmarks with fromName tag
    const allBookmarks = await window.electronAPI.bookmarks.getAll();
    const toUpdate = allBookmarks.filter((b) => b.tags?.includes(fromName));

    for (const bookmark of toUpdate) {
      const newTags = bookmark
        .tags!.filter((t) => t !== fromName)
        .concat(toName);

      await window.electronAPI.bookmarks.update(bookmark.id, {
        tags: [...new Set(newTags)], // deduplicate
      });
    }
  }

  async function removeTagEverywhere(tagName: string) {
    const allBookmarks = await window.electronAPI.bookmarks.getAll();
    const toUpdate = allBookmarks.filter((b) => b.tags?.includes(tagName));

    for (const bookmark of toUpdate) {
      await window.electronAPI.bookmarks.update(bookmark.id, {
        tags: bookmark.tags!.filter((t) => t !== tagName),
      });
    }
  }

  return {
    tags,
    loading,
    createTag,
    updateTag,
    deleteTag,
    findOrCreate,
    mergeTags,
    removeTagEverywhere,
  };
}
