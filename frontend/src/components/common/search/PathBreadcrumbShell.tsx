interface BreadcrumbSegment {
  key: string | number;
  label: string;
}
interface Props {
  path: BreadcrumbSegment[];
  onSelect: (key: string | number) => void;
}

export default function PathBreadcrumbShell({ path, onSelect }: Props) {
  if (path.length === 0) {
    return null;
  }

  return (
    <div className="path">
      {path.map((p, index) => (
        <span key={p.key}>
          <a
            href="#"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(p.key);
            }}
            className="path-link"
          >
            {p.label}
          </a>
          {index < path.length - 1 && " > "}
        </span>
      ))}
    </div>
  );
}
