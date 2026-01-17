// TagManager.tsx
import { useContext, useMemo, useState } from "react";
import { Save, Pencil, Merge, Trash2, X } from "../icons";
import styles from "./TagManager.module.css";
import { TagContext } from "../../context/BookmarkContext";
import { useTagOperations } from "../../api/hooks/useTagOperations";

interface Props {
  onClose: () => void;
}

export default function TagManager({ onClose }: Props) {
  const tagCtx = useContext(TagContext);
  if (!tagCtx) throw new Error("TagContext missing");

  const [removeId, setRemoveId] = useState<string | null>(null);

  const { tags, renameTag, removeTag, ensureTags } = tagCtx;
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const [mergeFromId, setMergeFromId] = useState<string | null>(null);
  const [mergeToId, setMergeToId] = useState<string | null>(null);

  const [newTagInput, setNewTagInput] = useState("");
  const tagById = useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags]);

  const { mergeTags, removeTagEverywhere } = useTagOperations();

  // ==== CREATE =====
  function createNewTag() {
    const raw = newTagInput.trim();
    if (!raw) return;

    const name = raw.toLowerCase();

    if (tags.some((t) => t.name === name)) {
      alert("Tag already exists");
      return;
    }

    ensureTags([name]);
    setNewTagInput("");
  }

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
  function confirmRemove(tagId: string) {
    const tag = tagById.get(tagId);
    if (!tag) return;

    removeTagEverywhere(tag.name);
    removeTag(tagId);
    setRemoveId(null);
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Manage tags</h3>
          {/* <button onClick={onClose}>×</button> */}
        </div>

        {/* ===== CREATE PANEL ===== */}
        <div className={styles.createPanel}>
          <input
            value={newTagInput}
            placeholder="New tag name…"
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") createNewTag();
            }}
          />
          <button onClick={createNewTag} title="Add new tag">
            {" "}
            <Save size={20} />
          </button>
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
                  /* ===== RENAME MODE ===== */
                  <>
                    <button title="Save changes" onClick={submitRename}>
                      <Save size={16} />
                    </button>
                    <button title="Cancel" onClick={() => setRenameId(null)}>
                      <X size={16} />
                    </button>
                  </>
                ) : removeId === t.id ? (
                  /* ===== REMOVE CONFIRM MODE ===== */
                  <>
                    <button
                      className={styles.danger}
                      title="Confirm remove"
                      onClick={() => confirmRemove(t.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button title="Cancel" onClick={() => setRemoveId(null)}>
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  /* ===== DEFAULT MODE ===== */
                  <>
                    <button
                      onClick={() => {
                        setRenameId(t.id);
                        setRenameValue(t.label);
                        setRemoveId(null);
                      }}
                      title="Rename"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => {
                        setMergeFromId(t.id);
                        setRemoveId(null);
                      }}
                      title="Merge"
                    >
                      <Merge size={16} />
                    </button>

                    <button
                      className={styles.danger}
                      onClick={() => {
                        setRemoveId(t.id);
                        setRenameId(null);
                      }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
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

            <div className={`${styles.mergeRow} ${styles.mergeActions}`}>
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
              <button
                className={styles.mergeActions}
                onClick={submitMerge}
                disabled={!mergeToId}
                title="Merge tags into"
              >
                <Save size={16} />
              </button>
              <button
                className={styles.mergeActions}
                onClick={() => setMergeFromId(null)}
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
