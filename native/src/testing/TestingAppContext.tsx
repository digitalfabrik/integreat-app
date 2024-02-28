import React, { ReactNode } from 'react'

import { AppContext, AppContextType } from '../contexts/AppContextProvider'
import { defaultSettings } from '../utils/AppSettings'

const TestingAppContext = ({
  children,
  settings = defaultSettings,
  cityCode = 'augsburg',
  languageCode = 'de',
  changeCityCode = jest.fn(),
  changeLanguageCode = jest.fn(),
  updateSettings = jest.fn(),
}: Partial<AppContextType> & { children: ReactNode }) => {
  const context = {
    settings,
    cityCode,
    languageCode,
    updateSettings,
    changeCityCode,
    changeLanguageCode,
  }
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

export default TestingAppContext
