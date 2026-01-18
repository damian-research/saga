// backend/services/nara-mapper.service.ts

import {
  Hit,
  Source,
  Record,
  Metadata,
  NaraDate,
  Ancestor,
  PhysicalOccurrence
} from "../models/nara-raw-model";
import {
  Ead,
  Control,
  FileDesc,
  ArchDesc,
  Did,
  Dsc,
  Component,
  PathSegment,
  UnitDate,
  Repository,
  Origination,
  ControlAccess,
  Subject,
  Part,
  MaintenanceHistory,
  NoteStmt
} from "../models/ead3.model";
import {
  LevelOfDescription,
  parseLevelOfDescription,
  getHierarchyOrder,
  toEad3String,
} from "../models/archive.types";

export class NaraMapperService {
  mapHitToEad3(hit: Hit): Ead {
    return {
      control: this.mapControl(hit),
      archDesc: this.mapArchDesc(hit._source?.record),
      path: this.mapPath(hit),
      digitalObjectCount: this.getDigitalObjectCount(hit),
    };
  }

  mapHitsToEad3(hits: Hit[]): Ead[] {
    return hits.map((hit) => this.mapHitToEad3(hit));
  }

  // ============================================================================
  // CONTROL SECTION
  // ============================================================================

  private mapControl(hit: Hit): Control {
    const metadata = hit._source?.metadata;

    return {
      recordId: metadata?.uuid || "",
      fileDesc: this.mapFileDesc(hit._source),
      maintenanceAgency: {
        agencyCode: "US-DNA",
        agencyName: "National Archives and Records Administration",
      },
      maintenanceHistory: this.mapMaintenanceHistory(metadata),
    };
  }

  private mapFileDesc(source?: Source): FileDesc {
    const metadata = source?.metadata;
    const ingestDate = metadata?.ingestTime
      ? new Date(metadata.ingestTime)
      : new Date();

    return {
      titleStmt: {
        titleProper: metadata?.fileName || "",
        author: "NARA Digital Conversion",
      },
      publicationStmt: {
        publisher: "National Archives and Records Administration",
        date: {
          text: ingestDate.toISOString().split("T")[0],
          normal: ingestDate.toISOString().split("T")[0],
        },
      },
      noteStmt: this.mapNoteStmt(source?.record),
    };
  }

  private mapMaintenanceHistory(metadata?: Metadata): MaintenanceHistory {
    const ingestDate = metadata?.ingestTime
      ? new Date(metadata.ingestTime)
      : new Date();

    return {
      maintenanceEvents: [
        {
          eventType: { value: "created" },
          eventDateTime: {
            text: ingestDate.toISOString().replace("T", " ").substring(0, 19),
            standardDateTime: ingestDate.toISOString(),
          },
          agentType: { value: "machine" },
          agent: "NARA Digital Archive System",
        },
      ],
    };
  }

  private mapNoteStmt(record?: Record): NoteStmt | undefined {
    if (!record?.microformPublications?.length) return undefined;

    const publicationsText = record.microformPublications
      .map((p) =>
        p.note
          ? `${p.identifier} - ${p.title}. ${p.note}`
          : `${p.identifier} - ${p.title}`,
      )
      .join(". ");

    return {
      controlNote: {
        paragraph: {
          text: publicationsText,
        },
      },
    };
  }

  // ============================================================================
  // ARCHDESC SECTION
  // ============================================================================

  private mapArchDesc(record?: Record): ArchDesc {
    if (!record) return {} as ArchDesc;

    return {
      level: toEad3String(parseLevelOfDescription(record.levelOfDescription)),
      localType: record.generalRecordsTypes?.length
        ? record.generalRecordsTypes.join(" / ")
        : undefined,
      did: this.mapDid(record),
      dsc: this.mapDsc(record),
      controlAccess: this.mapControlAccess(record),
    };
  }

  private mapDid(record: Record): Did {
    return {
      unitTitle: record.title || "",
      unitId: {
        text: record.naId.toString(),
        identifier: `nara:${record.naId}`,
      },
      unitDate: this.mapDateRange(
        record.coverageStartDate,
        record.coverageEndDate,
      ),
      repository: this.mapRepository(record.physicalOccurrences),
      origination: this.mapOrigination(record.ancestors),
      abstract: {
        text:
          record.scopeAndContentNote || record.generalNotes?.join("; ") || "",
      },
    };
  }

  private mapDateRange(start?: NaraDate, end?: NaraDate): UnitDate | undefined {
    if (!start && !end) return undefined;

    const startDate = start?.logicalDate || "";
    const endDate = end?.logicalDate || startDate;

    return {
      normal: `${startDate}/${endDate}`,
      text: this.formatDateRange(start, end),
      calendar: "gregorian",
      era: "ce",
    };
  }

  private formatDateRange(start?: NaraDate, end?: NaraDate): string {
    if (!start && !end) return "";
    if (!start) return end!.logicalDate || "";
    if (!end) return start.logicalDate || "";
    if (start.logicalDate === end.logicalDate) return start.logicalDate || "";
    return `${start.logicalDate} - ${end.logicalDate}`;
  }

  private mapRepository(
    occurrences?: PhysicalOccurrence[],
  ): Repository | undefined {
    const firstUnit = occurrences?.[0]?.referenceUnits?.[0];
    if (!firstUnit) return undefined;

    return {
      corpName: {
        parts: [{ localType: "corpname", text: firstUnit.name || "" }],
      },
    };
  }

  private mapOrigination(ancestors?: Ancestor[]): Origination | undefined {
    const creator = ancestors
      ?.flatMap((a) => a.creators || [])
      .find((c) => c.creatorType === "Most Recent");

    if (!creator) return undefined;

    return {
      persName: {
        identifier: creator.naId.toString(),
        relator: "creator",
        parts: [
          { localType: "persname", text: creator.heading || "" },
          { localType: "role", text: creator.creatorType || "" },
          {
            localType: "dates",
            text: `${creator.establishDate?.logicalDate || ""} - ${creator.abolishDate?.logicalDate || "present"}`,
          },
        ],
      },
    };
  }

  // ============================================================================
  // DSC SECTION
  // ============================================================================

  private mapDsc(record: Record): Dsc {
    const mediaTypes = record.physicalOccurrences
      ?.flatMap((p) => p.mediaOccurrences || [])
      .flatMap((m) => m.generalMediaTypes || [])
      .filter((v, i, a) => a.indexOf(v) === i); // distinct

    return {
      dscType: "combined",
      head: mediaTypes?.length ? mediaTypes.join(" / ") : undefined,
      components: this.mapComponents(record),
    };
  }

  private mapComponents(record: Record): Component[] {
    if (!record.digitalObjects?.length) return [];

    return record.digitalObjects.map((obj) => ({
      level: toEad3String(LevelOfDescription.Item),
      did: {
        unitId: obj.objectId || "",
        unitTitle: {
          text: obj.objectDescription || obj.objectFilename || "name not found",
          genreForm: {
            parts: [{ localType: "type_record", text: obj.objectType || "" }],
          },
        },
        daoSet: {
          coverage: "whole",
          daos: [
            {
              href: obj.objectUrl || "",
              linkTitle: obj.objectDescription || "View Digital Object",
              localType: obj.objectType || "",
              daoType: "derived",
              show: "new",
              actuate: "onrequest",
            },
          ],
        },
      },
      scopeContent: {
        chronList: {
          chronItems: [
            {
              dateSingle: {
                standardDate: new Date().toISOString().split("T")[0],
                text: "Digital object available",
              },
              event: {
                localType: "digital_object",
                subjects: [
                  {
                    parts: [
                      {
                        localType: "object",
                        text: obj.objectFilename || "name not found",
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
    }));
  }

  // ============================================================================
  // PATH & DIGITAL OBJECT COUNT
  // ============================================================================

  private mapPath(hit: Hit): PathSegment[] {
    const record = hit._source?.record;
    if (!record?.ancestors?.length) return [];

    return record.ancestors
      .filter(
        (a) =>
          a.naId !== record.naId &&
          a.levelOfDescription?.toLowerCase() !==
            record.levelOfDescription?.toLowerCase(),
      )
      .sort((a, b) => {
        const levelA = parseLevelOfDescription(a.levelOfDescription);
        const levelB = parseLevelOfDescription(b.levelOfDescription);
        return getHierarchyOrder(levelA) - getHierarchyOrder(levelB);
      })
      .map((a) => this.mapPathSegment(a));
  }

  private mapPathSegment(ancestor: Ancestor): PathSegment {
    const level = parseLevelOfDescription(ancestor.levelOfDescription);

    return {
      id: ancestor.naId.toString(),
      level: toEad3String(level),
      label: this.formatPathLabel(ancestor, level),
    };
  }

  private formatPathLabel(
    ancestor: Ancestor,
    level: LevelOfDescription,
  ): string {
    switch (level) {
      case LevelOfDescription.RecordGroup:
        return `RG# ${ancestor.recordGroupNumber} – ${ancestor.title}`;
      case LevelOfDescription.Series:
        return `Series ${ancestor.title}`;
      case LevelOfDescription.FileUnit:
        return `File ${ancestor.title}`;
      default:
        return ancestor.title || "";
    }
  }

  private getDigitalObjectCount(hit: Hit): number {
    if (hit.fields?.totalDigitalObjects?.length) {
      return hit.fields.totalDigitalObjects[0];
    }

    return hit._source?.record?.digitalObjects?.length || 0;
  }

  // ============================================================================
  // CONTROL ACCESS
  // ============================================================================

  private mapControlAccess(record: Record): ControlAccess | undefined {
    const subjects: Subject[] = [];

    // Access Restriction
    if (record.accessRestriction?.status) {
      subjects.push({
        parts: [
          {
            localType: "access_restriction",
            rules: "nara",
            text: record.accessRestriction.status,
          },
        ],
      });
    }

    // Use Restriction
    if (record.useRestriction) {
      const parts: Part[] = [];

      if (record.useRestriction.status) {
        parts.push({
          localType: "use_restriction_status",
          rules: "nara",
          text: record.useRestriction.status,
        });
      }

      const specificRestrictions =
        record.useRestriction.specificRestriction?.filter((r) => r?.trim());
      if (specificRestrictions?.length) {
        parts.push({
          localType: "use_restriction_specific",
          rules: "nara",
          text: specificRestrictions.join("; "),
        });
      }

      if (record.useRestriction.note) {
        parts.push({
          localType: "use_restriction_note",
          rules: "nara",
          text: record.useRestriction.note,
        });
      }

      if (parts.length) {
        subjects.push({ parts });
      }
    }

    if (!subjects.length) return undefined;

    return {
      head: "Access and Use Restrictions",
      subjects,
    };
  }
}
