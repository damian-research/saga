import type { SearchFormState } from "../tabs/search/SearchPanel";
import type { RawRecord } from "./models";

const BASE_URL = "http://localhost:5271/api/query";

function buildNaraQuery(form: SearchFormState): string {
  const clauses: string[] = [];

  if (form.q && form.q.trim()) {
    clauses.push(form.q.trim());
  }

  if (form.naId) {
    const ids = form.naId
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    ids.forEach((id) => clauses.push(`naId:${id}`));
  }

  if (form.levelOfDescription) {
    clauses.push(`level:${form.levelOfDescription}`);
  }

  if (form.recordGroupNumber) {
    const rgs = form.recordGroupNumber
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    rgs.forEach((rg) => clauses.push(`recordGroupNumber:${rg}`));
  }

  if (form.microfilmId) {
    const mfs = form.microfilmId
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    mfs.forEach((m) => clauses.push(`microformPublicationsIdentifier:${m}`));
  }

  if (form.localId) {
    const locals = form.localId
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    locals.forEach((l) => clauses.push(`localIdentifier:${l}`));
  }

  if (form.personOrOrg) {
    clauses.push(`personOrOrg:${form.personOrOrg.trim()}`);
  }

  if (form.dataSource) {
    clauses.push(`dataSource:${form.dataSource.trim()}`);
  }

  if (clauses.length === 0) {
    return "*";
  }

  return clauses.join(" AND ");
}

export async function searchRecords(
  form: SearchFormState
): Promise<RawRecord[]> {
  const params = new URLSearchParams();

  const hasControl =
    Boolean(form.naId?.trim()) ||
    Boolean(form.localId?.trim()) ||
    Boolean(form.microfilmId?.trim());

  if (hasControl) {
    const controlValue =
      form.naId?.trim() || form.localId?.trim() || form.microfilmId?.trim();

    // Identifier search: q is a required placeholder only
    params.set("q", "*");
    params.set("controlNumbers", controlValue!);
  } else {
    // Text search
    params.set("q", form.q?.trim() || "*");
  }

  // COMMON
  if (form.limit) params.set("limit", String(form.limit));
  if (form.onlineAvailable !== undefined) {
    params.set("availableOnline", String(form.onlineAvailable));
  }

  const res = await fetch(`${BASE_URL}/search?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Search failed");
  }

  return res.json();
}

function appendIsOrMulti(params: URLSearchParams, base: string, raw: string) {
  const values = raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  if (values.length === 1) {
    params.set(`${base}_is`, values[0]);
  } else if (values.length > 1) {
    params.set(base, values.join(","));
  }
}

import type { FullRecord } from "./models";

export async function getRecord(naId: number): Promise<FullRecord> {
  const res = await fetch(`http://localhost:5271/api/query/full/${naId}`);
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
    `http://localhost:5271/api/query/download/${naId}` +
    (dir ? `?dir=${encodeURIComponent(dir)}` : "");

  const res = await fetch(url, { method: "POST" });
  if (!res.ok) {
    throw new Error("Download failed");
  }
}
