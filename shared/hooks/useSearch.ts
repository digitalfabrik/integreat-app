import MiniSearch from 'minisearch'
import { useCallback } from 'react'

import { useLoadAsync } from '../api'

export type SearchResult = {
  title: string
  thumbnail?: string
  content: string
  path: string
}

const useSearch = (allPossibleResults: SearchResult[], query: string): SearchResult[] => {
  const initializeMiniSearch = useCallback(async () => {
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
    await search.addAllAsync(allPossibleResults)
    return search
  }, [allPossibleResults])
  const { data: minisearch } = useLoadAsync(initializeMiniSearch)
  // @ts-expect-error minisearch doesn't add the returned storeFields (e.g. title or path) to its typing
  return query.length === 0 || !minisearch ? allPossibleResults : minisearch.search(query)
}

export default useSearch
