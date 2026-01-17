// components/bookmarks/CategoryManager.tsx
import { useContext, useState } from "react";
import { Save, Pencil, Trash2, X } from "../icons";
import styles from "./TagManager.module.css"; // ← reuse styles
import { BookmarkContext } from "../../context/BookmarkContext";

interface Props {
  onClose: () => void;
}

export default function CategoryManager({ onClose }: Props) {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("BookmarkContext missing");

  const { categories, addCategory, renameCategory, removeCategory } = ctx;

  const [removeId, setRemoveId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [newCategoryInput, setNewCategoryInput] = useState("");

  // ===== CREATE =====
  function createNewCategory() {
    const name = newCategoryInput.trim();
    if (!name) return;

    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      alert("Category already exists");
      return;
    }

    addCategory(name);
    setNewCategoryInput("");
  }

  // ===== RENAME =====
  function submitRename() {
    if (!renameId) return;
    const value = renameValue.trim();
    if (!value) return;

    renameCategory(renameId, value);
    setRenameId(null);
    setRenameValue("");
  }

  // ===== REMOVE =====
  function confirmRemove(categoryId: string) {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    if (category.id === "uncategorized") return;

    removeCategory(categoryId);
    setRemoveId(null);
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Manage categories</h3>
          {/* <button onClick={onClose}>×</button> */}
        </div>

        {/* ===== CREATE PANEL ===== */}
        <div className={styles.createPanel}>
          <input
            value={newCategoryInput}
            placeholder="New category name…"
            onChange={(e) => setNewCategoryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") createNewCategory();
            }}
          />
          <button onClick={createNewCategory} title="Add new Category">
            {" "}
            <Save size={20} />
          </button>
        </div>

        {/* ===== LIST ===== */}
        <div className={styles.list}>
          {categories.map((c) => (
            <div key={c.id} className={styles.row}>
              {/* NAME */}
              {renameId === c.id ? (
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
                <span className={styles.label}>
                  {c.name}
                  {c.id === "uncategorized" && (
                    <span
                      style={{ color: "var(--text-tertiary)", marginLeft: 8 }}
                    >
                      (default)
                    </span>
                  )}
                </span>
              )}

              {/* ACTIONS */}
              <div className={styles.actions}>
                {renameId === c.id ? (
                  /* ===== RENAME MODE ===== */
                  <>
                    <button title="Save changes" onClick={submitRename}>
                      <Save size={16} />
                    </button>
                    <button title="Cancel" onClick={() => setRenameId(null)}>
                      <X size={16} />
                    </button>
                  </>
                ) : removeId === c.id ? (
                  /* ===== REMOVE CONFIRM MODE ===== */
                  <>
                    <button
                      className={styles.danger}
                      title="Confirm remove"
                      onClick={() => confirmRemove(c.id)}
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
                        setRenameId(c.id);
                        setRenameValue(c.name);
                        setRemoveId(null);
                      }}
                      disabled={c.id === "uncategorized"}
                      title="Rename"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className={styles.danger}
                      onClick={() => {
                        setRemoveId(c.id);
                        setRenameId(null);
                      }}
                      disabled={c.id === "uncategorized"}
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
      </div>
    </div>
  );
}
