import type { Bookmark, Category } from "../models/bookmarks.types";
import type { Ead3Response } from "../models/ead3.types";

export function mapEad3ToBookmark(
  record: Ead3Response,
  input: {
    mode: "add-manual" | "add-from-search";
    category: Category;
    customName: string;
    url: string;
    id?: string;
    createdAt?: string;
  }
): Bookmark {
  const naId = record.archDesc.did.unitId.text;

  return {
    mode: input.mode,
    id: input.id ?? crypto.randomUUID(),
    archive: "NARA",
    eadId: naId,
    title: record.archDesc.did.unitTitle,
    path: record.path ?? [],

    ead3: {
      level: record.archDesc.level,
      localType: record.archDesc.localType,
      dscHead: record.archDesc.dsc?.head,
      digitalObjectCount: record.digitalObjectCount ?? 0,
    },

    category: input.category,
    customName: input.customName,
    createdAt: input.createdAt ?? new Date().toISOString(),

    url: naId ? `https://catalog.archives.gov/id/${naId}` : input.url,
  };
}

// ============================================================================
// MAPPING: EAD3 (from API) → BOOKMARK
// ============================================================================

/*
FIELD MAPPING FROM EAD3 TO BOOKMARK:

┌─────────────────────────────────────────────────────────────────────────┐
│ BASIC IDENTIFICATION                                                    │
└─────────────────────────────────────────────────────────────────────────┘

EAD3 → BOOKMARK
─────────────────────────────────────────────────────────────────────────
record.archDesc.did.unitId.text  → bookmark.eadId
record.archDesc.did.unitTitle    → bookmark.title
"NARA"                          → bookmark.archive (hardcoded for NARA)
crypto.randomUUID()              → bookmark.id (or input.id if provided)

┌─────────────────────────────────────────────────────────────────────────┐
│ HIERARCHY & PATH                                                        │
└─────────────────────────────────────────────────────────────────────────┘

EAD3 → BOOKMARK
─────────────────────────────────────────────────────────────────────────
record.path[]                    → bookmark.path[]
record.path[].level              → bookmark.path[].level
record.path[].id                 → bookmark.path[].id
record.path[].label              → bookmark.path[].label
[] (empty array)                 → bookmark.path[] (if record.path is undefined)

┌─────────────────────────────────────────────────────────────────────────┐
│ EAD3 METADATA                                                           │
└─────────────────────────────────────────────────────────────────────────┘

EAD3 → BOOKMARK
─────────────────────────────────────────────────────────────────────────
record.archDesc.level            → bookmark.ead3.level
record.archDesc.localType        → bookmark.ead3.localType
record.archDesc.dsc?.head        → bookmark.ead3.dscHead
record.digitalObjectCount        → bookmark.ead3.digitalObjectCount
0                                → bookmark.ead3.digitalObjectCount (if undefined)

NOTE: bookmark.ead3 fields replace deprecated bookmark.material fields:
  - bookmark.material.type (deprecated) ≡ bookmark.ead3.localType
  - bookmark.material.media (deprecated) ≡ bookmark.ead3.dscHead

┌─────────────────────────────────────────────────────────────────────────┐
│ USER-DEFINED FIELDS (from input)                                        │
└─────────────────────────────────────────────────────────────────────────┘

INPUT → BOOKMARK
─────────────────────────────────────────────────────────────────────────
input.mode                       → bookmark.mode ("add-manual" | "add-from-search")
input.category                   → bookmark.category
input.customName                 → bookmark.customName
input.createdAt                  → bookmark.createdAt
new Date().toISOString()         → bookmark.createdAt (if input.createdAt is undefined)

┌─────────────────────────────────────────────────────────────────────────┐
│ URL GENERATION                                                          │
└─────────────────────────────────────────────────────────────────────────┘

LOGIC → BOOKMARK
─────────────────────────────────────────────────────────────────────────
If naId exists:
  `https://catalog.archives.gov/id/${naId}` → bookmark.url
Else:
  input.url                      → bookmark.url

┌─────────────────────────────────────────────────────────────────────────┐
│ UNMAPPED EAD3 FIELDS (Available but not used in bookmark)               │
└─────────────────────────────────────────────────────────────────────────┘

- record.control (entire section)
  - control.recordId
  - control.fileDesc
  - control.maintenanceAgency
  - control.maintenanceHistory

- record.archDesc.did (partial mapping only)
  - did.head
  - did.unitDate
  - did.repository
  - did.origination
  - did.abstract
  - did.langMaterial

- record.archDesc.dsc (partial mapping only)
  - dsc.dscType
  - dsc.components[] (all component details)
    - components[].level
    - components[].did.unitId
    - components[].did.unitTitle
    - components[].did.daoSet.daos[]
    - components[].scopeContent

┌─────────────────────────────────────────────────────────────────────────┐
│ UNMAPPED BOOKMARK FIELDS (Not populated during mapping)                 │
└─────────────────────────────────────────────────────────────────────────┘

- bookmark.note (optional, user-defined after creation)

┌─────────────────────────────────────────────────────────────────────────┐
│ DEPRECATED FIELDS (Removed from bookmarks.types.ts)                     │
└─────────────────────────────────────────────────────────────────────────┘

- bookmark.material.type → REPLACED BY bookmark.ead3.localType
- bookmark.material.media → REPLACED BY bookmark.ead3.dscHead
- bookmark.ead3.firstDao → REMOVED (unused)

┌─────────────────────────────────────────────────────────────────────────┐
│ MAPPING EXAMPLE (from provided data)                                    │
└─────────────────────────────────────────────────────────────────────────┘

EAD3 Input:
{
  archDesc: {
    level: "fileUnit",
    localType: "Textual Records",
    did: {
      unitTitle: "Brandt, Karl",
      unitId: { text: "73088101", identifier: "nara:73088101" }
    },
    dsc: { head: "Loose Sheets" }
  },
  path: [
    { level: "recordgrp", id: "388", label: "RG# 59 – General Records of the Department of State" },
    { level: "series", id: "854614", label: "Series Interrogations of Former High Level Nazi..." }
  ],
  digitalObjectCount: 2
}

User Input:
{
  mode: "add-from-search",
  category: "WWII",
  customName: "Karl Brandt Interrogation",
  url: "https://catalog.archives.gov/id/73088101"
}

Bookmark Output:
{
  mode: "add-from-search",
  id: "uuid-generated",
  archive: "NARA",
  eadId: "73088101",
  title: "Brandt, Karl",
  path: [
    { level: "recordgrp", id: "388", label: "RG# 59 – General Records..." },
    { level: "series", id: "854614", label: "Series Interrogations..." }
  ],
  ead3: {
    level: "fileUnit",
    localType: "Textual Records",
    dscHead: "Loose Sheets",
    digitalObjectCount: 2
  },
  category: "WWII",
  customName: "Karl Brandt Interrogation",
  createdAt: "2026-01-12T20:00:00.000Z",
  url: "https://catalog.archives.gov/id/73088101"
}

┌─────────────────────────────────────────────────────────────────────────┐
│ NOTES                                                                   │
└─────────────────────────────────────────────────────────────────────────┘

- Bookmark is a simplified, flattened representation of EAD3 record
- Only essential fields for user bookmarking are mapped
- Full EAD3 structure remains available in the original API response
- bookmark.archive is hardcoded as "NARA" in current implementation
- bookmark.url is auto-generated from naId for NARA records
- bookmark.path contains only ancestor hierarchy (from record.path)
- bookmark.ead3 replaces the deprecated bookmark.material structure
*/
