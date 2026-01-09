import type { UknaSearchParams } from "../dto/uknaSearch.dto";
import type { UknaSearchRecord, UknaDetailsRecord } from "../models/ukna.types";
import { API_BASE_URL } from "../config";

export async function searchUkna(
  params: UknaSearchParams
): Promise<UknaSearchRecord[]> {
  const res = await fetch(`${API_BASE_URL}/ukna/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error("UKNA search failed");
  }

  return res.json();
}

export async function getUknaDetails(id: string): Promise<UknaDetailsRecord> {
  const res = await fetch(`${API_BASE_URL}/ukna/details/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("UKNA details failed");
  }

  return res.json();
}
