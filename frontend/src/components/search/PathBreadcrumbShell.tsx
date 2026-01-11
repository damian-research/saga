import styles from "./PathBreadcrumbShell.module.css";

interface BreadcrumbSegment {
  key: string | number;
  label: string;
}

interface Props {
  path?: BreadcrumbSegment[];
  onSelect: (key: string | number) => void;
}

export default function PathBreadcrumbShell({ path = [], onSelect }: Props) {
  if (!path || path.length === 0) return null;

  return (
    <div className={styles.path}>
      {path?.map((p, index) => (
        <span key={p.key}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(p.key);
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
