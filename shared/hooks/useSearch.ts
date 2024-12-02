import MiniSearch from 'minisearch'
import { useCallback } from 'react'

import useLoadAsync from '../api/endpoints/hooks/useLoadAsync'
import CategoriesMapModel from '../api/models/CategoriesMapModel'
import EventModel from '../api/models/EventModel'
import ExtendedPageModel from '../api/models/ExtendedPageModel'
import PoiModel from '../api/models/PoiModel'

export type SearchResult = ExtendedPageModel

// TODO: turn it back into a memoized function
// TODO: mock it in the web test
// TODO: maybe test this in shared
export const formatPossibleSearchResults = (
  categories?: CategoriesMapModel | null,
  events?: EventModel[] | null,
  pois?: PoiModel[] | null,
): SearchResult[] => [
  ...(categories?.toArray().filter(category => !category.isRoot()) || []),
  ...(events || []),
  ...(pois || []),
]

const useSearch = (allPossibleResults: SearchResult[], query: string): SearchResult[] | null => {
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

  if (!minisearch || minisearch.documentCount !== allPossibleResults.length) {
    return null
  }

  // @ts-expect-error minisearch doesn't add the returned storeFields (e.g. title or path) to its typing
  return query.length === 0 ? allPossibleResults : minisearch.search(query)
}

export default useSearch
