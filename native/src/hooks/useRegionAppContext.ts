import { useContext } from 'react'

import { AppContext, AppContextType } from '../contexts/AppContextProvider'

export type RegionAppContext = AppContextType & {
  regionCode: string
}

export const useAppContext = (): AppContextType => useContext(AppContext)

const useRegionAppContext = (): RegionAppContext => {
  const { regionCode, ...context } = useAppContext()
  if (!regionCode) {
    throw new Error('Region code not set!')
  }
  return { regionCode, ...context }
}

export default useRegionAppContext
