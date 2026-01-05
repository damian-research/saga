import type { RawRecord } from './models'

const BASE_URL = 'http://localhost:5271/api/query'

export async function searchRecords(q: string): Promise<RawRecord[]> {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(q)}`)

  if (!res.ok) {
    throw new Error('Search failed')
  }

  return res.json()
}