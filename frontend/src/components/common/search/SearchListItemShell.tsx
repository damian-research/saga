interface Props {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function SearchListItemShell({
  isSelected,
  onClick,
  children,
}: Props) {
  return (
    <div className={`list-item ${isSelected ? "active" : ""}`}>
      <div className="list-item-content">{children}</div>
      <div className="list-item-click" onClick={onClick}>
        <span className="list-item-arrow">›</span>
      </div>
    </div>
  );
}
