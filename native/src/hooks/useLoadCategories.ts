import { useCallback } from 'react'

import { CategoriesMapModel, createCategoriesEndpoint } from 'api-client'

import { dataContainer } from '../utils/DefaultDataContainer'
import { determineApiUrl } from '../utils/helpers'
import useLoadCityContent, { CityContentReturn } from './useLoadCityContent'

type UseLoadCategoriesProps = {
  cityCode: string
  languageCode: string
}

const useLoadCategories = ({
  cityCode,
  languageCode,
}: UseLoadCategoriesProps): CityContentReturn<{ categories: CategoriesMapModel }> => {
  const load = useCallback(async () => {
    if (await dataContainer.categoriesAvailable(cityCode, languageCode)) {
      return { categories: await dataContainer.getCategoriesMap(cityCode, languageCode) }
    }

    const payload = await createCategoriesEndpoint(await determineApiUrl()).request({
      city: cityCode,
      language: languageCode,
    })
    if (payload.data) {
      await dataContainer.setCategoriesMap(cityCode, languageCode, payload.data)
    }
    return payload.data ? { categories: payload.data } : null
  }, [cityCode, languageCode])

  return useLoadCityContent({ cityCode, languageCode, load })
}

export default useLoadCategories
