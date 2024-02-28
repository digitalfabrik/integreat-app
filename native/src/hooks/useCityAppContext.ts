import { useContext } from 'react'

import { AppContext, AppContextType, UpdateSettingsType } from '../contexts/AppContextProvider'
import { SettingsType } from '../utils/AppSettings'

type UseCityAppContextReturn = {
  settings: SettingsType
  cityCode: string
  languageCode: string
  updateSettings: (settings: UpdateSettingsType) => void
  changeCityCode: (cityCode: string | null) => void
  changeLanguageCode: (languageCode: string) => void
}

export const useAppContext = (): AppContextType => useContext(AppContext)

const useCityAppContext = (): UseCityAppContextReturn => {
  const { settings, cityCode, languageCode, updateSettings, changeCityCode, changeLanguageCode } = useAppContext()
  if (!cityCode) {
    throw new Error('City code not set!')
  }
  return { settings, cityCode, languageCode, updateSettings, changeCityCode, changeLanguageCode }
}

export default useCityAppContext
