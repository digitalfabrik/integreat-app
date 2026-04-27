import MiniSearch, { SearchResult } from 'minisearch'
import { useEffect, useState } from 'react'

import CategoriesMapModel from '../api/models/CategoriesMapModel'
import EventModel from '../api/models/EventModel'
import ExtendedDocumentModel from '../api/models/ExtendedDocumentModel'
import PoiModel from '../api/models/PoiModel'
import normalizeString from '../utils/normalizeString'
import parseHTML from '../utils/parseHTML'

const removeDuplicatedPaths = (documents: ExtendedDocumentModel[]) => {
  const paths = new Set()
  return documents.filter(document => {
    const isNew = !paths.has(document.path)
    if (isNew) {
      paths.add(document.path)
    }
    return isNew
  })
}

export const prepareSearchDocuments = (
  categories?: CategoriesMapModel | null,
  events?: EventModel[] | null,
  pois?: PoiModel[] | null,
): ExtendedDocumentModel[] => [
  ...(categories?.toArray().filter(category => !category.isRoot()) || []),
  ...(events || []),
  ...(pois || []),
]

const normalizeContent = (term: string) => normalizeString(parseHTML(term))

type UseSearchReturn = {
  data: SearchResult[]
  error: Error | null
  loading: boolean
}

// WARNING: This uses the document count to check whether the search documents have already been added.
// Modifying single documents or replacing documents with a same length array will therefore NOT trigger an update
export const useSearch = (documents: ExtendedDocumentModel[], query: string): UseSearchReturn => {
  const [indexing, setIndexing] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const normalizedQuery = normalizeString(query)

  const [search] = useState(
    new MiniSearch({
      idField: 'path',
      fields: ['title', 'content'],
      storeFields: ['availableLanguages'],
      extractField: (document, fieldName) =>
        fieldName === 'content' ? normalizeContent(document.content) : document[fieldName],
      processTerm: normalizeString,
      searchOptions: {
        boost: { title: 2 },
        fuzzy: 0.25,
        combineWith: 'AND',
        prefix: true,
      },
    }),
  )

  useEffect(() => {
    const sanitizedDocuments = removeDuplicatedPaths(documents)
    if (!indexing && search.documentCount !== sanitizedDocuments.length) {
      setIndexing(true)
      search.removeAll()
      search
        .addAllAsync(sanitizedDocuments)
        .then(() => setIndexing(false))
        .catch(setError)
    }
  }, [indexing, search, documents])

  return {
    data: search.search(normalizedQuery),
    error,
    loading: indexing,
  }
}

type UseMultiLanguageSearchParams = {
  userLanguageDocuments: ExtendedDocumentModel[]
  moreDocuments: ExtendedDocumentModel[]
  query: string
  userLanguageCode: string
}

type UseMultiLanguageSearchReturn = {
  data: ExtendedDocumentModel[]
  error: Error | null
  loading: boolean
}

// Performs a search in documents of multiple languages (usually the users language and the source language (de))
// If the search term is found in a non-user language document, we still return the document translated in the users language
// If no translation to the users language exists, we use the original language of the search result
const useMultiLanguageSearch = ({
  userLanguageDocuments,
  moreDocuments,
  userLanguageCode,
  query,
}: UseMultiLanguageSearchParams): UseMultiLanguageSearchReturn => {
  const userLanguageSearch = useSearch(userLanguageDocuments, query)
  const moreSearch = useSearch(moreDocuments, query)

  const userLanguageResults = userLanguageSearch.data
  const moreResults = moreSearch.data.map(result => ({
    ...result,
    id: result.availableLanguages[userLanguageCode] ?? result.id,
  }))

  const results = [...userLanguageResults, ...moreResults].sort((a, b) => b.score - a.score).map(result => result.id)
  const uniqueResults = [...new Set(results)]

  // The search results undergo normalization and should not be returned directly
  // We instead map the results their translation in the users language if existing or their original result otherwise
  // Make sure to persist the order of result documents in order to account for the search score and prioritize close matches
  const resultDocuments = uniqueResults
    .map(
      result =>
        userLanguageDocuments.find(document => document.path === result) ??
        moreDocuments.find(document => document.path === result),
    )
    .filter((it): it is ExtendedDocumentModel => it !== undefined)

  return {
    data: normalizeString(query).length > 0 ? resultDocuments : userLanguageDocuments,
    error: userLanguageSearch.error ?? moreSearch.error,
    loading: userLanguageSearch.loading || moreSearch.loading,
  }
}

export default useMultiLanguageSearch
