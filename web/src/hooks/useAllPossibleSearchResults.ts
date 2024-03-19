import { useMemo } from 'react'

import {
  createCategoriesEndpoint,
  createEventsEndpoint,
  createPOIsEndpoint,
  ExtendedPageModel,
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

const useAllPossibleSearchResults = ({
  city,
  language,
  cmsApiBaseUrl,
}: UseAllPossibleSearchResultsProps): UseAllPossibleSearchResultsReturn => {
  const params = { city, language }

  const { data: categories, ...categoriesReturn } = useLoadFromEndpoint(createCategoriesEndpoint, cmsApiBaseUrl, params)
  const { data: events, ...eventsReturn } = useLoadFromEndpoint(createEventsEndpoint, cmsApiBaseUrl, params)
  const { data: pois, ...poisReturn } = useLoadFromEndpoint(createPOIsEndpoint, cmsApiBaseUrl, params)

  const allPossibleResults = useMemo(
    () => [...(categories?.toArray().filter(category => !category.isRoot()) || []), ...(events || []), ...(pois || [])],
    [categories, events, pois],
  )

  return {
    data: allPossibleResults,
    loading: categoriesReturn.loading || eventsReturn.loading || poisReturn.loading,
    error: categoriesReturn.error || eventsReturn.error || poisReturn.error,
  }
}

export default useAllPossibleSearchResults
