import styles from "./PathShell.module.css";
import type { PathSegment } from "../../api/models/ead3.types";

interface Props {
  path?: PathSegment[];
  onSelect: (id: string) => void;
}

export default function PathShell({ path = [], onSelect }: Props) {
  if (!path || path.length === 0) return null;

  return (
    <div className={styles.path}>
      {path?.map((p, index) => (
        <span key={p.id}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(p.id);
            }}
            className={styles.link}
          >
            {p.label}
          </a>
          {index < path.length - 1 && (
            <span className={styles.separator}> &gt; </span>
          )}
        </span>
      ))}
    </div>
  );
}
