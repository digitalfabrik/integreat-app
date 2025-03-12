import { useMemo } from 'react'

import { prepareSearchDocuments } from 'shared'
import {
  createCategoriesEndpoint,
  createEventsEndpoint,
  createPOIsEndpoint,
  ExtendedPageModel,
  useLoadFromEndpoint,
} from 'shared/api'

type UseLoadSearchDocumentsProps = {
  cityCode: string
  languageCode: string
  cmsApiBaseUrl: string
}

type UseLoadSearchDocumentsReturn = {
  data: ExtendedPageModel[]
  error: Error | null
  loading: boolean
}

const useLoadSearchDocuments = ({
  cityCode,
  languageCode,
  cmsApiBaseUrl,
}: UseLoadSearchDocumentsProps): UseLoadSearchDocumentsReturn => {
  const params = { city: cityCode, language: languageCode }

  const categories = useLoadFromEndpoint(createCategoriesEndpoint, cmsApiBaseUrl, params)
  const events = useLoadFromEndpoint(createEventsEndpoint, cmsApiBaseUrl, params)
  const pois = useLoadFromEndpoint(createPOIsEndpoint, cmsApiBaseUrl, params)

  const documents = useMemo(
    () => prepareSearchDocuments(categories.data, events.data, pois.data),
    [categories.data, events.data, pois.data],
  )

  return {
    data: documents,
    loading: categories.loading || events.loading || pois.loading,
    error: categories.error || events.error || pois.error,
  }
}

export default useLoadSearchDocuments
