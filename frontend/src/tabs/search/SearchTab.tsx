import { useState } from 'react'
import SearchLayout from './SearchLayout'
import type { RawRecord } from '../../api/models'

export default function SearchTab() {
  const [results, setResults] = useState<RawRecord[]>([])
  const [selectedNaId, setSelectedNaId] = useState<number | null>(null)

  return (
    <SearchLayout
      results={results}
      onResults={setResults}
      selectedNaId={selectedNaId}
      onSelect={setSelectedNaId}
    />
  )
}