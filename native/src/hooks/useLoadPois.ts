import { createPOIsEndpoint, PoiModel } from 'api-client'

import { dataContainer } from '../utils/DefaultDataContainer'
import useLoadCityContent, { CityContentReturn } from './useLoadCityContent'

type UseLoadPoisProps = {
  cityCode: string
  languageCode: string
}

const useLoadPois = (params: UseLoadPoisProps): CityContentReturn<{ pois: PoiModel[] }> =>
  useLoadCityContent({
    ...params,
    createEndpoint: createPOIsEndpoint,
    map: data => ({ pois: data }),
    isAvailable: dataContainer.poisAvailable,
    getFromDataContainer: dataContainer.getPois,
    setToDataContainer: dataContainer.setPois,
  })

export default useLoadPois
