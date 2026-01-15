import { buildNaraQ, buildNaraParams } from "../utils/queryBuilder";
import type { NaraSearchParams } from "../dto/naraSearch.dto";
import type { Ead3Response } from "../models/ead3.types";
import { API_BASE_URL } from "../config";

// ============================================================================
// EAD3 ONLY – SEARCH
// ============================================================================

export async function searchRecords(
  paramsInput: NaraSearchParams
): Promise<Ead3Response[]> {
  const params = new URLSearchParams();
  const paramsInputSafe = paramsInput;

  const hasControl =
    Boolean(paramsInputSafe.naId?.trim()) ||
    Boolean(paramsInputSafe.localId?.trim()) ||
    Boolean(paramsInputSafe.microfilmId?.trim());

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

  const res = await fetch(`${API_BASE_URL}/nara/search?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Search failed");
  }

  // API returns EAD3 – passthrough
  return res.json();
}

// ============================================================================
// EAD3 ONLY – FULL RECORD
// ============================================================================

export async function getRecord(naId: number): Promise<Ead3Response> {
  const res = await fetch(`${API_BASE_URL}/nara/full/${naId}`);
  if (!res.ok) {
    throw new Error("Failed to load record");
  }

  return res.json();
}

// ============================================================================
// EAD3 ONLY – GET CHILDREN
// ============================================================================

export async function searchChildren(
  parentId: string,
  limit: number = 50
): Promise<Ead3Response[]> {
  const res = await fetch(
    `${API_BASE_URL}/nara/children/${parentId}?limit=${limit}`
  );
  if (!res.ok) {
    throw new Error("Failed to load children");
  }
  return res.json();
}

// ============================================================================
// DOWNLOAD (NARA-SPECIFIC, OK)
// ============================================================================

export async function downloadRecord(
  naId: number,
  dir?: string
): Promise<void> {
  const url =
    `${API_BASE_URL}/nara/download/${naId}` +
    (dir ? `?dir=${encodeURIComponent(dir)}` : "");

  const res = await fetch(url, { method: "POST" });
  if (!res.ok) {
    throw new Error("Download failed");
  }
}
