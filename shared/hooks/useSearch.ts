import MiniSearch from 'minisearch'
import { useCallback } from 'react'

import { CategoryModel, EventModel, PoiModel, useLoadAsync } from '../api'

export type SearchResult = EventModel | PoiModel | CategoryModel

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
  return query.length === 0 || !minisearch
    ? allPossibleResults
    : (minisearch.search(query) as unknown as SearchResult[])
}

export default useSearch
