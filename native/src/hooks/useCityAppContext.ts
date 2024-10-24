import { useContext } from 'react'

import { AppContext, AppContextType } from '../contexts/AppContextProvider'

export type CityAppContext = AppContextType & {
  cityCode: string
}

export const useAppContext = (): AppContextType => useContext(AppContext)

const useCityAppContext = (): CityAppContext => {
  const { cityCode, ...context } = useAppContext()
  if (!cityCode) {
    throw new Error('City code not set!')
  }
  return { cityCode, ...context }
}

export default useCityAppContext
