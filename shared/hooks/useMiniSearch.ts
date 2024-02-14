import MiniSearch from 'minisearch'
import { useMemo } from 'react'

export type SearchResult = {
  title: string
  id: string | number
  thumbnail?: string
  content: string
  path: string
}

const useMiniSearch = (allPossibleResults: SearchResult[]): MiniSearch<SearchResult> => {
  const minisearch = useMemo(() => {
    const search = new MiniSearch({
      fields: ['title', 'content'],
      storeFields: ['title', 'content', 'path', 'location', 'url', 'thumbnail'],
      searchOptions: {
        boost: { title: 2 },
        fuzzy: true,
        prefix: true,
      },
    })
    search.addAll(allPossibleResults)
    return search
  }, [allPossibleResults])

  return minisearch
}

export default useMiniSearch
