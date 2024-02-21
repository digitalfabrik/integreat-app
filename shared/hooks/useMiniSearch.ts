import MiniSearch from 'minisearch'
import { useMemo } from 'react'

export type SearchResult = {
  title: string
  thumbnail?: string
  content: string
  path: string
}

const useMiniSearch = (allPossibleResults: SearchResult[]): MiniSearch<SearchResult> =>
  useMemo(() => {
    const search = new MiniSearch({
      idField: 'path',
      fields: ['title', 'content'],
      storeFields: ['title', 'content', 'path', 'thumbnail'],
      searchOptions: {
        boost: { title: 2 },
        fuzzy: true,
        prefix: true,
      },
    })
    search.addAll(allPossibleResults)
    return search
  }, [allPossibleResults])

export default useMiniSearch
