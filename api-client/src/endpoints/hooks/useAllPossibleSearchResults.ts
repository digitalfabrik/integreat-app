import { useCallback, useMemo } from 'react'

import createCategoriesEndpoint from 'api-client/src/endpoints/createCategoriesEndpoint'
import createEventsEndpoint from 'api-client/src/endpoints/createEventsEndpoint'
import useLoadAsync from 'api-client/src/endpoints/hooks/useLoadAsync'
import useLoadFromEndpoint from 'api-client/src/endpoints/hooks/useLoadFromEndpoint'
import loadSprungbrettJobs from 'api-client/src/endpoints/loadSprungbrettJobs'

type useSearchParams = {
  city: string
  language: string
  cmsApiBaseUrl: string
}

export type SearchResult = {
  title: string
  id: string | number
  thumbnail?: string
} & (
  | {
      content: string
      path: string
      location?: string
      url?: string
    }
  | {
      location: string
      url: string
      content?: string
      path?: string
    }
)

const useAllPossibleSearchResults = ({
  city,
  language,
  cmsApiBaseUrl,
}: useSearchParams): {
  data: SearchResult[]
  loading: boolean
  error: Error | null
} => {
  const params = { city, language }

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useLoadFromEndpoint(createCategoriesEndpoint, cmsApiBaseUrl, params)

  const {
    data: events,
    loading: eventsLoading,
    error: eventsError,
  } = useLoadFromEndpoint(createEventsEndpoint, cmsApiBaseUrl, params)

  const loadOffers = useCallback(
    () => loadSprungbrettJobs({ cityCode: city, languageCode: language, baseUrl: cmsApiBaseUrl }),
    [city, language, cmsApiBaseUrl],
  )
  const { data: offers, loading: offersLoading, error: offersError } = useLoadAsync(loadOffers)

  const allPossibleResults = useMemo(
    () => [
      ...(categories
        ?.toArray()
        .filter(category => !category.isRoot())
        .map(category => ({
          title: category.title,
          content: category.content,
          path: category.path,
          id: category.path,
          thumbnail: category.thumbnail,
        })) ?? []),
      ...(events?.map(event => ({
        title: event.title,
        content: event.content,
        path: event.path,
        id: event.path,
      })) ?? []),
      ...(offers?.sprungbrettJobs.map(offer => ({
        title: offer.title,
        location: offer.location,
        url: offer.url,
        id: offer.url,
      })) ?? []),
    ],
    [categories, events, offers],
  )

  return {
    data: allPossibleResults,
    loading: categoriesLoading || eventsLoading || offersLoading,
    error: categoriesError || eventsError || offersError,
  }
}

export default useAllPossibleSearchResults
