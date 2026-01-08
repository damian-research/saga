import type { PathSegment } from "../../../api/models/record.types";
import { getRecord } from "../../../api/services/queryService";

interface Props {
  path: PathSegment[];
  onSelect: (id: number) => void;
}

async function handlePathClick(naId: number, onSelect: (id: number) => void) {
  try {
    await getRecord(naId);
    onSelect(naId);
  } catch (error) {
    console.error("Failed to load record:", error);
  }
}

export default function PathBreadcrumbShell({ path, onSelect }: Props) {
  if (path.length === 0) {
    return null;
  }

  return (
    <div className="path">
      {path.map((p, index) => (
        <span key={p.naId}>
          <a
            href="#"
            onClick={(e) => {
              e.stopPropagation();
              handlePathClick(p.naId, onSelect);
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
