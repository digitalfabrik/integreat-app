import { useMemo } from 'react'

import { SearchResult } from 'shared'
import {
  CategoriesMapModel,
  createCategoriesEndpoint,
  createEventsEndpoint,
  createPOIsEndpoint,
  EventModel,
  ExtendedPageModel,
  PoiModel,
  useLoadFromEndpoint,
} from 'shared/api'

type UseAllPossibleSearchResultsProps = {
  city: string
  language: string
  cmsApiBaseUrl: string
}

type UseAllPossibleSearchResultsReturn = {
  data: ExtendedPageModel[]
  error: Error | null
  loading: boolean
}

const combineResults = (
  categories: CategoriesMapModel | null,
  events: EventModel[] | null,
  pois: PoiModel[] | null,
): SearchResult[] => [
  ...(categories?.toArray().filter(category => !category.isRoot()) || []),
  ...(events || []),
  ...(pois || []),
]

const useAllPossibleSearchResults = ({
  city,
  language,
  cmsApiBaseUrl,
}: UseAllPossibleSearchResultsProps): UseAllPossibleSearchResultsReturn => {
  const params = { city, language }

  const categories = useLoadFromEndpoint(createCategoriesEndpoint, cmsApiBaseUrl, params)
  const events = useLoadFromEndpoint(createEventsEndpoint, cmsApiBaseUrl, params)
  const pois = useLoadFromEndpoint(createPOIsEndpoint, cmsApiBaseUrl, params)

  const allPossibleResults = useMemo(
    () => combineResults(categories.data, events.data, pois.data),
    [categories.data, events.data, pois.data],
  )

  return {
    data: allPossibleResults,
    loading: categories.loading || events.loading || pois.loading,
    error: categories.error || events.error || pois.error,
  }
}

export default useAllPossibleSearchResults
