import { CityModel, LanguageModel, ReturnType, useLoadAsync } from 'api-client'

import useLoadCities from './useLoadCities'
import useLoadLanguages from './useLoadLanguages'

type UseLoadCityContentProps<T> = {
  cityCode: string
  load: () => Promise<T | null>
}

export type CityContentReturn<T> = ReturnType<
  {
    cities: CityModel[]
    languages: LanguageModel[]
    city: CityModel
    language: LanguageModel
  } & T
>

const useLoadCityContent = <T>({ cityCode, load }: UseLoadCityContentProps<T>): CityContentReturn<T> => {
  const citiesReturn = useLoadCities()
  const languagesReturn = useLoadLanguages({ cityCode })
  const otherReturn = useLoadAsync(load, {})

  const city = citiesReturn.data?.find(it => it.code === cityCode)
  const language = languagesReturn.data?.find(it => it.code === cityCode)

  const getError = (): Error | null => {
    if (!city) {
      return new Error('City not found')
    }
    if (!language) {
      return new Error('Language not found')
    }
    return citiesReturn.error ?? languagesReturn.error ?? otherReturn.error
  }

  const loading = citiesReturn.loading || languagesReturn.loading || otherReturn.loading
  const refresh = () => {
    citiesReturn.refresh()
    languagesReturn.refresh()
    otherReturn.refresh()
  }

  const data =
    city && language && citiesReturn.data && languagesReturn.data && otherReturn.data
      ? {
          city,
          language,
          cities: citiesReturn.data,
          languages: languagesReturn.data,
          ...otherReturn.data,
        }
      : null

  return { error: getError(), loading, refresh, data }
}

export default useLoadCityContent
