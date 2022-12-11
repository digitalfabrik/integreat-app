import { CategoriesMapModel, createCategoriesEndpoint } from 'api-client'

import { dataContainer } from '../utils/DefaultDataContainer'
import useLoadCityContent, { CityContentReturn } from './useLoadCityContent'

type UseLoadCategoriesProps = {
  cityCode: string
  languageCode: string
}

const useLoadCategories = (params: UseLoadCategoriesProps): CityContentReturn<{ categories: CategoriesMapModel }> =>
  useLoadCityContent({
    ...params,
    createEndpoint: createCategoriesEndpoint,
    map: data => ({ categories: data }),
    isAvailable: dataContainer.categoriesAvailable,
    getFromDataContainer: dataContainer.getCategoriesMap,
    setToDataContainer: dataContainer.setCategoriesMap,
  })

export default useLoadCategories
