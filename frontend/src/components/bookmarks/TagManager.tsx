// TagManager.tsx
import { useContext, useMemo, useState } from "react";
import styles from "./TagManager.module.css";
import { TagContext } from "../../context/BookmarkContext";
import { useTagOperations } from "../../api/utils/useTagOperations";

interface Props {
  onClose: () => void;
}

export default function TagManager({ onClose }: Props) {
  const tagCtx = useContext(TagContext);
  if (!tagCtx) throw new Error("TagContext missing");

  const { tags, renameTag, removeTag } = tagCtx;

  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const [mergeFromId, setMergeFromId] = useState<string | null>(null);
  const [mergeToId, setMergeToId] = useState<string | null>(null);

  const tagById = useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags]);

  const { mergeTags, removeTagEverywhere } = useTagOperations();

  // ===== RENAME =====
  function submitRename() {
    if (!renameId) return;
    const value = renameValue.trim();
    if (!value) return;

    renameTag(renameId, value);
    setRenameId(null);
    setRenameValue("");
  }

  // ===== MERGE =====
  function submitMerge() {
    if (!mergeFromId || !mergeToId || mergeFromId === mergeToId) return;

    const from = tagById.get(mergeFromId);
    const to = tagById.get(mergeToId);
    if (!from || !to) return;

    mergeTags(from.name, to.name);
    removeTag(from.id);

    setMergeFromId(null);
    setMergeToId(null);
  }

  // ===== REMOVE =====
  function submitRemove(tagId: string) {
    const tag = tagById.get(tagId);
    if (!tag) return;

    if (
      !confirm(
        `Remove tag "${tag.label}"?\nIt will be removed from all bookmarks.`
      )
    )
      return;

    removeTagEverywhere(tag.name);
    removeTag(tagId);
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Manage tags</h3>
          <button onClick={onClose}>×</button>
        </div>

        <div className={styles.list}>
          {tags.map((t) => (
            <div key={t.id} className={styles.row}>
              {/* NAME */}
              {renameId === t.id ? (
                <input
                  value={renameValue}
                  autoFocus
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitRename();
                    if (e.key === "Escape") setRenameId(null);
                  }}
                />
              ) : (
                <span className={styles.label}>{t.label}</span>
              )}

              {/* ACTIONS */}
              <div className={styles.actions}>
                {renameId === t.id ? (
                  <>
                    <button onClick={submitRename}>Save</button>
                    <button onClick={() => setRenameId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setRenameId(t.id);
                        setRenameValue(t.label);
                      }}
                    >
                      Rename
                    </button>

                    <button onClick={() => setMergeFromId(t.id)}>Merge</button>

                    <button
                      className={styles.danger}
                      onClick={() => submitRemove(t.id)}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ===== MERGE PANEL ===== */}
        {mergeFromId && (
          <div className={styles.mergePanel}>
            <div>
              Merge <strong>{tagById.get(mergeFromId)?.label}</strong> into:
            </div>

            <select
              value={mergeToId ?? ""}
              onChange={(e) => setMergeToId(e.target.value)}
            >
              <option value="">Select target tag</option>
              {tags
                .filter((t) => t.id !== mergeFromId)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
            </select>

            <div className={styles.mergeActions}>
              <button onClick={submitMerge} disabled={!mergeToId}>
                Confirm merge
              </button>
              <button onClick={() => setMergeFromId(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
