import { useContext } from 'react'

import { AppContext } from '../contexts/AppContextProvider'

type UseCityAppContextReturn = {
  cityCode: string
  changeCityCode: (cityCode: string) => void
  languageCode: string
  changeLanguageCode: (languageCode: string) => void
}

const useCityAppContext = (): UseCityAppContextReturn => {
  const { cityCode, changeCityCode, languageCode, changeLanguageCode } = useContext(AppContext)
  if (!cityCode) {
    throw new Error('City code not set!')
  }
  return { cityCode, changeCityCode, languageCode, changeLanguageCode }
}

export default useCityAppContext
