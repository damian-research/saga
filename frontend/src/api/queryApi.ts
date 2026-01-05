import type { RawRecord } from "./models";

const BASE_URL = "http://localhost:5271/api/query";

export async function searchRecords(q: string): Promise<RawRecord[]> {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(q)}`);

  if (!res.ok) {
    throw new Error("Search failed");
  }

  return res.json();
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
