import { useMemo } from 'react'

import { prepareSearchDocuments } from 'shared'
import { createCategoriesEndpoint, createEventsEndpoint, createPlacesEndpoint, ExtendedDocumentModel } from 'shared/api'

import useQueryFromEndpoint from './useQueryFromEndpoint'

type UseLoadSearchDocumentsProps = {
  regionCode: string
  languageCode: string
  cmsApiBaseUrl: string
}

type UseLoadSearchDocumentsReturn = {
  data: ExtendedDocumentModel[]
  error: Error | null
  loading: boolean
}

const useLoadSearchDocuments = ({
  regionCode,
  languageCode,
  cmsApiBaseUrl,
}: UseLoadSearchDocumentsProps): UseLoadSearchDocumentsReturn => {
  const params = { region: regionCode, language: languageCode }

  const categories = useQueryFromEndpoint(createCategoriesEndpoint, cmsApiBaseUrl, params)
  const events = useQueryFromEndpoint(createEventsEndpoint, cmsApiBaseUrl, params)
  const places = useQueryFromEndpoint(createPlacesEndpoint, cmsApiBaseUrl, params)

  const documents = useMemo(
    () => prepareSearchDocuments(categories.data, events.data, places.data),
    [categories.data, events.data, places.data],
  )

  return {
    data: documents,
    loading: categories.isPending || events.isPending || places.isPending,
    error: categories.error || events.error || places.error,
  }
}

export default useLoadSearchDocuments
