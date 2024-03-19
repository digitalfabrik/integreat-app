import MiniSearch from 'minisearch'
import { useEffect, useMemo, useState } from 'react'

export type SearchResult = {
  title: string
  thumbnail?: string
  content: string
  path: string
}

const useSearch = (allPossibleResults: SearchResult[], query: string, asyncMode = false): SearchResult[] => {
  const [isIndexing, setIsIndexing] = useState<boolean>(asyncMode)
  const [searchResult, setSearchResult] = useState<SearchResult[]>([])
  const miniSearch = useMemo(() => {
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
    if (asyncMode) {
      search.addAllAsync(allPossibleResults).then(() => setIsIndexing(false))
    } else {
      search.addAll(allPossibleResults)
    }
    return search
  }, [allPossibleResults, asyncMode])

  useEffect(() => {
    // @ts-expect-error minisearch doesn't add the returned storeFields (e.g. title or path) to its typing
    setSearchResult(query.length === 0 ? allPossibleResults : miniSearch.search(query))
  }, [allPossibleResults, isIndexing, miniSearch, query])

  return searchResult
}

export default useSearch
