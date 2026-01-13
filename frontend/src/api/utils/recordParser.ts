// recordParser
//
import type { Ead3Response, Dao } from "../models/ead3.types";

export interface ParsedRecordDetails {
  title: string;
  recordId: string;
  level: string;
  description: string | null;
  digitalObjects: Dao[];
  objectSummary: ObjectSummary[];
  microfilm: string | null;
  accessRestriction: string | null;
  useRestriction: string | null;
  useRestrictionDetails: string | null;
  isRestricted: boolean;
  openWebUrl: string;
}

export interface ObjectSummary {
  type: string;
  count: number;
}

function normalize(v: unknown): string | null {
  return typeof v === "string" ? v.toLowerCase() : null;
}

function extractDigitalObjects(record: Ead3Response): Dao[] {
  const archDesc = record.archDesc;
  let digitalObjects: Dao[] = [];

  if (archDesc?.dsc?.components && Array.isArray(archDesc.dsc.components)) {
    archDesc.dsc.components.forEach((component: any) => {
      const daos =
        component.did?.daoSet?.daos && Array.isArray(component.did.daoSet.daos)
          ? component.did.daoSet.daos
          : [];
      if (daos.length > 0) {
        digitalObjects = digitalObjects.concat(daos);
      }
    });
  }

  return digitalObjects;
}

function summarizeObjects(digitalObjects: Dao[]): ObjectSummary[] {
  const typeCounts: Record<string, number> = {};

  digitalObjects.forEach((dao) => {
    const type = dao.localType || dao.daoType || "Unknown";
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  return Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
}

function extractRestrictions(record: Ead3Response) {
  const archDesc = record.archDesc;
  let accessRestriction: string | null = null;
  let useRestriction: string | null = null;
  let useRestrictionDetails: string | null = null;

  if (archDesc?.controlAccess?.subjects) {
    archDesc.controlAccess.subjects.forEach((subject: any) => {
      subject.parts.forEach((part: any) => {
        if (part.localType === "access_restriction") {
          accessRestriction = part.text;
        }
        if (part.localType === "use_restriction_status") {
          useRestriction = part.text;
        }
        if (
          part.localType === "use_restriction_specific" ||
          part.localType === "use_restriction_note"
        ) {
          useRestrictionDetails = useRestrictionDetails
            ? `${useRestrictionDetails}. ${part.text}`
            : part.text;
        }
      });
    });
  }

  const isRestricted =
    (normalize(accessRestriction) !== null &&
      normalize(accessRestriction) !== "unrestricted") ||
    (normalize(useRestriction) !== null &&
      normalize(useRestriction) !== "unrestricted");

  return {
    accessRestriction,
    useRestriction,
    useRestrictionDetails,
    isRestricted,
  };
}

export function parseRecordDetails(record: Ead3Response): ParsedRecordDetails {
  const archDesc = record.archDesc;
  const control = record.control;

  const title = archDesc?.did?.unitTitle || "Untitled";
  const recordId = archDesc?.did?.unitId?.text || "N/A";
  const level = archDesc?.level || "Unknown";
  const description = archDesc?.did?.abstract?.text || null;

  const digitalObjects = extractDigitalObjects(record);
  const objectSummary = summarizeObjects(digitalObjects);

  const microfilm =
    control?.fileDesc?.noteStmt?.controlNote?.paragraph?.text || null;

  const restrictions = extractRestrictions(record);

  const openWebUrl = `https://catalog.archives.gov/id/${recordId}`;

  return {
    title,
    recordId,
    level,
    description,
    digitalObjects,
    objectSummary,
    microfilm,
    ...restrictions,
    openWebUrl,
  };
}

export interface ParsedListItem {
  title: string;
  unitId: string;
  level: string;
  materialType: string;
  mediaType: string;
  digitalObjectCount: number;
}

const LEVEL_LABELS: Record<string, string> = {
  item: "Item",
  fileUnit: "File Unit",
  series: "Series",
  recordgrp: "Record Group",
  collection: "Collection",
};

export function parseListItem(record: Ead3Response): ParsedListItem {
  const archDesc = record.archDesc;

  const title = archDesc.did.unitTitle;
  const unitId = archDesc.did.unitId?.text || "";
  const levelRaw = archDesc.level || "";
  const level = LEVEL_LABELS[levelRaw] || levelRaw || "Unknown";

  const materialType = Array.isArray(archDesc.localType)
    ? archDesc.localType.join(" / ")
    : archDesc.localType || "";

  const mediaType = archDesc.dsc?.head || "";
  const digitalObjectCount = record.digitalObjectCount || 0;

  return {
    title,
    unitId,
    level,
    materialType,
    mediaType,
    digitalObjectCount,
  };
}

export function getRecordKey(record: Ead3Response | null | undefined): string {
  if (!record) return "__invalid__";

  return (
    record.archDesc?.did?.unitId?.text ??
    record.control?.recordId ??
    "__invalid__"
  );
}
