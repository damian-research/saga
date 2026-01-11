import { useEffect, useState } from "react";
import { type Ead3Response, type Dao } from ".";
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
    return <div>Select a record to view details</div>;
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

  // For PreviewViewer, pass first digital object as object prop,
  // all digitalObjects as objects prop, and no bookmarks prop
  const firstObject = digitalObjects.length > 0 ? digitalObjects[0] : null;

  if (firstObject && !previewOpen) {
    setPreviewOpen(true);
  }

  return (
    <div>
      <h2>{title}</h2>
      {firstObject && previewOpen && (
        <PreviewViewer
          object={firstObject}
          objects={digitalObjects}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}
