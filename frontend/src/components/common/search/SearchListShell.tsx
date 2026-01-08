import React from "react";

interface Props<T> {
  items: T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
  selectedKey: string | number | null;
}

export default function SearchListShell<T>({
  items,
  getKey,
  renderItem,
  selectedKey,
}: Props<T>) {
  if (!items || items.length === 0) {
    return (
      <div className="panel list">
        <div className="panel-title">Results</div>
        <div className="preview-empty">No results found</div>
      </div>
    );
  }

  return (
    <div className="panel list">
      <div className="panel-title">Results ({items.length})</div>
      {items.map((item) => {
        const key = getKey(item);
        return (
          <React.Fragment key={key}>
            {renderItem(item, key === selectedKey)}
          </React.Fragment>
        );
      })}
    </div>
  );
}
