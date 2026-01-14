// TagProvider.tsx
import { useCallback, useEffect, useState } from "react";
import { TagContext } from "../../context/BookmarkContext";
import type { Tag } from "../../api/models/bookmarks.types";
import { loadTags, saveTags } from "../../api/services/bookmarks.service";

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

  // ===== LOAD =====
  useEffect(() => {
    const raw = loadTags();
    const normalized = Array.isArray(raw) ? raw.filter(isValidTag) : [];

    setTags(normalized);

    if (normalized.length !== raw.length) {
      saveTags(normalized);
    }
  }, []);

  // ===== ENSURE =====
  const ensureTags = useCallback((names: string[]) => {
    if (!names.length) return;

    setTags((prev) => {
      const map = new Map(prev.map((t) => [t.name, t]));
      let changed = false;

      names.forEach((raw) => {
        const name = normalize(raw);
        if (!name || map.has(name)) return;

        map.set(name, {
          id: crypto.randomUUID(),
          name,
          label: raw.trim(),
          createdAt: new Date().toISOString(),
        });
        changed = true;
      });

      const next = changed ? Array.from(map.values()) : prev;
      if (changed) saveTags(next); // ← persist tylko gdy zmiana
      return next;
    });
  }, []);

  // ===== RENAME =====
  const renameTag = useCallback((tagId: string, newLabel: string) => {
    const label = newLabel.trim();
    if (!label) return;

    const name = normalize(label);

    setTags((prev) => {
      const next = prev.map((t) =>
        t.id === tagId ? { ...t, name, label } : t
      );
      saveTags(next);
      return next;
    });
  }, []);

  // ===== REMOVE =====
  const removeTag = useCallback((tagId: string) => {
    setTags((prev) => {
      const next = prev.filter((t) => t.id !== tagId);
      saveTags(next);
      return next;
    });
  }, []);

  return (
    <TagContext.Provider value={{ tags, ensureTags, renameTag, removeTag }}>
      {children}
    </TagContext.Provider>
  );
}
