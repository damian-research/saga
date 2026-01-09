import { buildNaraQuery } from "../utils/queryBuilder";
import type { NaraSearchParams } from "../dto/naraSearch.dto";
import type { RawRecord, FullRecord } from "../models/nara.types";
import { API_BASE_URL } from "../config";

export async function searchRecords(
  paramsInput: NaraSearchParams
): Promise<RawRecord[]> {
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
    const q = buildNaraQuery({
      ...paramsInputSafe,
      q: paramsInputSafe.q ?? "",
    });
    params.set("q", q);
  }

  if (paramsInputSafe.limit) params.set("limit", String(paramsInputSafe.limit));
  if (paramsInputSafe.onlineAvailable !== undefined) {
    params.set("availableOnline", String(paramsInputSafe.onlineAvailable));
  }

  const res = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Search failed");
  }

  return res.json();
}

export async function getRecord(naId: number): Promise<FullRecord> {
  const res = await fetch(`${API_BASE_URL}/full/${naId}`);
  if (!res.ok) {
    throw new Error("Failed to load record");
  }
  return res.json();
}

export async function downloadRecord(
  naId: number,
  dir?: string
): Promise<void> {
  const url =
    `${API_BASE_URL}/download/${naId}` +
    (dir ? `?dir=${encodeURIComponent(dir)}` : "");

  const res = await fetch(url, { method: "POST" });
  if (!res.ok) {
    throw new Error("Download failed");
  }
}
