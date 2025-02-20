import MiniSearch from 'minisearch'
import { useEffect, useState } from 'react'

import CategoriesMapModel from '../api/models/CategoriesMapModel'
import EventModel from '../api/models/EventModel'
import ExtendedPageModel from '../api/models/ExtendedPageModel'
import PoiModel from '../api/models/PoiModel'

export type SearchResult = ExtendedPageModel

export const prepareSearchDocuments = (
  categories?: CategoriesMapModel | null,
  events?: EventModel[] | null,
  pois?: PoiModel[] | null,
): SearchResult[] => [
  ...(categories?.toArray().filter(category => !category.isRoot()) || []),
  ...(events || []),
  ...(pois || []),
]

// WARNING: This uses the document count to check whether the search documents have already been added.
// Modifying single documents or replacing documents with a same length array will therefore NOT trigger an update
const useSearch = (documents: SearchResult[], query: string): SearchResult[] => {
  const [indexing, setIndexing] = useState(false)
  const [search] = useState(
    new MiniSearch({
      idField: 'path',
      fields: ['title', 'content'],
      storeFields: ['title', 'content', 'path', 'thumbnail'],
      searchOptions: {
        boost: { title: 2 },
        fuzzy: true,
        prefix: true,
      },
    }),
  )

  useEffect(() => {
    if (!indexing && search.documentCount !== documents.length) {
      setIndexing(true)
      search.removeAll()
      search
        .addAllAsync(documents)
        .then(() => setIndexing(false))
        .catch()
    }
  }, [indexing, search, documents])

  // @ts-expect-error minisearch doesn't add the returned storeFields (e.g. title or path) to its typing
  return query.length === 0 ? documents : search.search(query)
}

export default useSearch
