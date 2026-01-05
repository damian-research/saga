import { useState } from 'react'
import { searchRecords } from '../../api/queryApi'
import type { RawRecord } from '../../api/models'

export default function SearchPanel() {
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSearch() {
    if (!q.trim()) return

    setLoading(true)
    try {
      const results: RawRecord[] = await searchRecords(q)
      console.log('SEARCH RESULTS', results)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel search">
      <input
        type="text"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search query…"
      />

      <button onClick={onSearch} disabled={loading}>
        {loading ? 'Searching…' : 'Search'}
      </button>
    </div>
  )
}