import { useCallback, useEffect, useState } from "react";
import { TagContext } from "../../context/BookmarkContext";
import type { Tag } from "../../api/models/bookmarks.types";

function normalize(name: string) {
  return name.trim().toLowerCase();
}

function isValidTag(t: any): t is Tag {
  return (
    t &&
    typeof t.id === "string" &&
    typeof t.name === "string" &&
    typeof t.label === "string"
  );
}

export default function TagProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (!window.electronAPI?.tags) {
      console.warn("electronAPI not ready");
      return;
    }

    window.electronAPI.tags
      .getAll()
      .then((loaded) => {
        const normalized = loaded.filter(isValidTag);
        setTags(normalized);
      })
      .catch((err) => console.error("Failed to load tags:", err));
  }, []);

  const ensureTags = useCallback(async (names: string[]) => {
    if (!names.length) return;

    const allTags = await window.electronAPI.tags.getAll();
    const existing = new Set(allTags.map((t) => t.name));

    for (const raw of names) {
      const name = normalize(raw);
      if (!name || existing.has(name)) continue;

      const newTag: Tag = {
        id: crypto.randomUUID(),
        name,
        label: raw.trim(),
        createdAt: new Date().toISOString(),
      };

      const created = await window.electronAPI.tags.create(newTag);
      setTags((prev) => [...prev, created]);
      existing.add(name);
    }

    // Critical: wait for state update to propagate
    await new Promise((resolve) => setTimeout(resolve, 50));
  }, []);

  const renameTag = useCallback(async (tagId: string, newLabel: string) => {
    const label = newLabel.trim();
    if (!label) return;

    const updated = await window.electronAPI.tags.update(tagId, label);
    if (updated) {
      setTags((prev) => prev.map((t) => (t.id === tagId ? updated : t)));
    }
  }, []);

  const removeTag = useCallback(async (tagId: string) => {
    await window.electronAPI.tags.delete(tagId);
    setTags((prev) => prev.filter((t) => t.id !== tagId));
  }, []);

  return (
    <TagContext.Provider value={{ tags, ensureTags, renameTag, removeTag }}>
      {children}
    </TagContext.Provider>
  );
}
