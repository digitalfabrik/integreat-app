import { useMemo } from 'react'

import { prepareSearchDocuments } from 'shared'
import { createCategoriesEndpoint, createEventsEndpoint, createPOIsEndpoint, ExtendedDocumentModel } from 'shared/api'

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
  const pois = useQueryFromEndpoint(createPOIsEndpoint, cmsApiBaseUrl, params)

  const documents = useMemo(
    () => prepareSearchDocuments(categories.data, events.data, pois.data),
    [categories.data, events.data, pois.data],
  )

  return {
    data: documents,
    loading: categories.isPending || events.isPending || pois.isPending,
    error: categories.error || events.error || pois.error,
  }
}

export default useLoadSearchDocuments
