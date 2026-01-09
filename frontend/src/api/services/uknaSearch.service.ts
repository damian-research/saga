import type { UknaSearchParams } from "../dto/uknaSearch.dto";
import type { UkSearchRecord } from "../models/ukna.types";
import { API_BASE_URL } from "../config";

export async function searchUkna(
  params: UknaSearchParams
): Promise<UkSearchRecord[]> {
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
