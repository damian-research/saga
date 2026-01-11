import { useEffect, useState } from "react";
import { type Ead3Response, type Dao } from ".";
import styles from "./SearchDetails.module.css";
import PreviewViewer from "./PreviewViewer";
import { getRecord } from "../../api/services/searchRecords.service";

interface Props {
  selectedKey: string | number | null;
}

export default function SearchDetails({ selectedKey }: Props) {
  const [record, setRecord] = useState<Ead3Response | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedKey) {
      setRecord(null);
      setError(null);
      return;
    }

    const recordId =
      typeof selectedKey === "number" ? selectedKey : Number(selectedKey);
    if (isNaN(recordId)) {
      setRecord(null);
      setError("Invalid record id.");
      return;
    }

    setIsLoading(true);
    setError(null);

    getRecord(recordId)
      .then((data) => {
        setRecord(data);
        setIsLoading(false);
        setPreviewOpen(false);
      })
      .catch(() => {
        setError("Failed to load record.");
        setIsLoading(false);
      });
  }, [selectedKey]);

  if (!selectedKey) {
    return <div className={styles.empty}>Select a record to view details</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!record) {
    return null;
  }

  const archDesc = record.archDesc;

  // Derive title from archDesc.did.unitTitle (string)
  let title = "Untitled";
  if (archDesc?.did?.unitTitle) {
    title = archDesc.did.unitTitle;
  }

  // Extract digital objects from archDesc.dsc.components[].did.daoSet.daos[]
  let digitalObjects: Dao[] = [];
  if (archDesc?.dsc?.components && Array.isArray(archDesc.dsc.components)) {
    archDesc.dsc.components.forEach((component) => {
      const daos =
        component.did?.daoSet?.daos && Array.isArray(component.did.daoSet.daos)
          ? component.did.daoSet.daos
          : [];
      if (daos.length > 0) {
        digitalObjects = digitalObjects.concat(daos);
      }
    });
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>{title}</h2>
      {digitalObjects.length > 0 && (
        <div className={styles.header}>
          <button
            className={styles.downloadAll}
            onClick={() => {
              digitalObjects.forEach((o) => {
                if (o.href) {
                  window.open(o.href, "_blank");
                }
              });
            }}
          >
            Download all
          </button>

          <ul className={styles.objectList}>
            {digitalObjects.map((obj, idx) => (
              <li key={idx} className={styles.objectItem}>
                <span className={styles.objectLabel}>
                  {obj.localType || obj.daoType || "Digital object"}
                </span>
                <button
                  className={styles.viewButton}
                  onClick={() => setActiveIndex(idx)}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {activeIndex !== null && digitalObjects[activeIndex] && (
        <PreviewViewer
          object={digitalObjects[activeIndex]}
          objects={digitalObjects}
          onClose={() => setActiveIndex(null)}
          onNext={() => {
            if (activeIndex < digitalObjects.length - 1) {
              setActiveIndex(activeIndex + 1);
            }
          }}
          onPrev={() => {
            if (activeIndex > 0) {
              setActiveIndex(activeIndex - 1);
            }
          }}
        />
      )}
    </div>
  );
}
