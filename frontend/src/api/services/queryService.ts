import { buildNaraQuery } from "../../utils/queryBuilder";
import type { SearchFormState } from "../../pages/search/SearchPanel";
import type { RawRecord, FullRecord } from "../models/record.types";
import { API_BASE_URL } from "../config";

export async function searchRecords(
  form: SearchFormState
): Promise<RawRecord[]> {
  const params = new URLSearchParams();

  const hasControl =
    Boolean(form.naId?.trim()) ||
    Boolean(form.localId?.trim()) ||
    Boolean(form.microfilmId?.trim());

  if (hasControl) {
    const raw =
      form.naId?.trim() || form.localId?.trim() || form.microfilmId?.trim() || ""; 

    params.set("q", "*");
    params.set("controlNumbers", raw);

    if (/^\d+$/.test(raw)) {
      params.set("naid_is", raw);
    }
  } else {
    const q = buildNaraQuery(form);
    params.set("q", q);
  }

  if (form.limit) params.set("limit", String(form.limit));
  if (form.onlineAvailable !== undefined) {
    params.set("availableOnline", String(form.onlineAvailable));
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