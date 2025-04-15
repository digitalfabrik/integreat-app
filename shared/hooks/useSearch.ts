import MiniSearch from 'minisearch'
import { useEffect, useState } from 'react'

import CategoriesMapModel from '../api/models/CategoriesMapModel'
import EventModel from '../api/models/EventModel'
import ExtendedPageModel from '../api/models/ExtendedPageModel'
import PoiModel from '../api/models/PoiModel'
import normalizeString from '../utils/normalizeString'

export type SearchResult = ExtendedPageModel
const DEBOUNCED_QUERY_TIMEOUT = 250

export const prepareSearchDocuments = (
  categories?: CategoriesMapModel | null,
  events?: EventModel[] | null,
  pois?: PoiModel[] | null,
): SearchResult[] => [
  ...(categories?.toArray().filter(category => !category.isRoot()) || []),
  ...(events || []),
  ...(pois || []),
]

type UseSearchReturn = {
  data: SearchResult[]
  error: Error | null
  loading: boolean
}

// WARNING: This uses the document count to check whether the search documents have already been added.
// Modifying single documents or replacing documents with a same length array will therefore NOT trigger an update
const useSearch = (documents: SearchResult[], query: string): UseSearchReturn => {
  const [indexing, setIndexing] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState(normalizeString(query))
  const [error, setError] = useState<Error | null>(null)

  const [search] = useState(
    new MiniSearch({
      idField: 'path',
      fields: ['title', 'content'],
      storeFields: ['title', 'content', 'path', 'thumbnail'],
      processTerm: normalizeString,
      searchOptions: {
        boost: { title: 2 },
        fuzzy: true,
        prefix: true,
      },
    }),
  )

  useEffect(() => {
    const debounceQueryTimeout = setTimeout(() => {
      setDebouncedQuery(normalizeString(query))
    }, DEBOUNCED_QUERY_TIMEOUT)

    return () => clearTimeout(debounceQueryTimeout)
  }, [query])

  useEffect(() => {
    if (!indexing && search.documentCount !== documents.length) {
      setIndexing(true)
      search.removeAll()
      search
        .addAllAsync(documents)
        .then(() => setIndexing(false))
        .catch(setError)
    }
  }, [indexing, search, documents])

  return {
    data: debouncedQuery.length === 0 ? documents : (search.search(debouncedQuery) as unknown as SearchResult[]),
    error,
    loading: indexing,
  }
}

export default useSearch
