import React, { ReactElement, ReactNode } from 'react'

import { AppContext, AppContextType } from '../contexts/AppContextProvider'
import { defaultSettings, SettingsType } from '../utils/AppSettings'

const TestingAppContext = ({
  children,
  settings = {},
  cityCode = 'augsburg',
  languageCode = 'de',
  changeCityCode = jest.fn(),
  changeLanguageCode = jest.fn(),
  updateSettings = jest.fn(),
}: {
  settings?: Partial<SettingsType>
  children: ReactNode
} & Omit<Partial<AppContextType>, 'settings'>): ReactElement => {
  const context = {
    settings: { ...defaultSettings, ...settings },
    cityCode,
    languageCode,
    updateSettings,
    changeCityCode,
    changeLanguageCode,
  }
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

export default TestingAppContext
