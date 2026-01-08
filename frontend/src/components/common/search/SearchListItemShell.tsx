interface Props {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  onSave?: () => void;
  isSaved?: boolean;
}

export default function SearchListItemShell({
  isSelected,
  onClick,
  children,
  onSave,
  isSaved,
}: Props) {
  return (
    <div className={`list-item ${isSelected ? "active" : ""}`}>
      <div className="list-item-content">{children}</div>

      {onSave && (
        <button
          className="list-item-save"
          onClick={(e) => {
            e.stopPropagation();
            onSave();
          }}
          title={isSaved ? "Saved" : "Save to bookmarks"}
          aria-label="Save to bookmarks"
        >
          {isSaved ? "★" : "☆"}
        </button>
      )}

      <div className="list-item-click" onClick={onClick}>
        <span className="list-item-arrow">›</span>
      </div>
    </div>
  );
}
