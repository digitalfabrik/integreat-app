import MiniSearch from 'minisearch'
import { useMemo } from 'react'

export type SearchResult = {
  title: string
  thumbnail?: string
  content: string
  path: string
}

const useSearch = (allPossibleResults: SearchResult[], query: string): SearchResult[] => {
  const minisearch = useMemo(() => {
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
    search.addAllAsync(allPossibleResults)
    return search
  }, [allPossibleResults])

  // @ts-expect-error minisearch doesn't add the returned storeFields (e.g. title or path) to its typing
  return query.length === 0 ? allPossibleResults : minisearch.search(query)
}

export default useSearch
