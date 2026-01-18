// src/api/services/searchRecords.service.ts

import { buildNaraQ, buildNaraParams } from "../utils/queryBuilder";
import type { NaraSearchParams } from "../dto/naraSearch.dto";
import type { Ead } from "../../../backend/models/ead3.model";
import { electronApi } from "../electron.api";

// ============================================================================
// EAD3 ONLY – SEARCH
// ============================================================================
export async function searchRecords(
  paramsInput: NaraSearchParams,
): Promise<Ead[]> {
  const params = new URLSearchParams();
  const paramsInputSafe = paramsInput;

  const hasAncestor = Boolean(paramsInputSafe.ancestorNaId?.trim());

  const hasControl =
    !hasAncestor &&
    (Boolean(paramsInputSafe.naId?.trim()) ||
      Boolean(paramsInputSafe.localId?.trim()) ||
      Boolean(paramsInputSafe.microfilmId?.trim()));

  if (hasControl) {
    const raw =
      paramsInputSafe.naId?.trim() ||
      paramsInputSafe.localId?.trim() ||
      paramsInputSafe.microfilmId?.trim() ||
      "";

    params.set("q", "*");
    params.set("controlNumbers", raw);

    if (/^\d+$/.test(raw)) {
      params.set("naid_is", raw);
    }
  } else {
    const q = buildNaraQ(paramsInputSafe);
    params.set("q", q);

    const filterParams = buildNaraParams(paramsInputSafe);
    filterParams.forEach((value, key) => {
      params.set(key, value);
    });
  }

  if (paramsInputSafe.limit) {
    params.set("limit", String(paramsInputSafe.limit));
  }

  if (paramsInputSafe.onlineAvailable !== undefined) {
    params.set("availableOnline", String(paramsInputSafe.onlineAvailable));
  }

  return electronApi.nara.search(`?${params.toString()}`);
}

// ============================================================================
// EAD3 ONLY – FULL RECORD
// ============================================================================
export async function getRecord(naId: number): Promise<Ead> {
  return electronApi.nara.getFull(naId);
}

// ============================================================================
// EAD3 ONLY – GET CHILDREN
// ============================================================================
export async function searchChildren(
  parentId: string,
  limit: number = 50,
): Promise<Ead[]> {
  return electronApi.nara.getChildren(Number(parentId), limit);
}

// ============================================================================
// DOWNLOAD (NARA-SPECIFIC, OK)
// ============================================================================

// export async function downloadRecord(
//   naId: number,
//   dir?: string,
// ): Promise<void> {
//   const url =
//     `${API_BASE_URL}/nara/download/${naId}` +
//     (dir ? `?dir=${encodeURIComponent(dir)}` : "");

//   const res = await fetch(url, { method: "POST" });
//   if (!res.ok) {
//     throw new Error("Download failed");
//   }
// }
