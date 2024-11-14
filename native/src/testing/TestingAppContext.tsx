import React, { ReactElement, ReactNode } from 'react'

import { AppContext, AppContextType } from '../contexts/AppContextProvider'
import { defaultSettings, SettingsType } from '../utils/AppSettings'

type TestingAppContextParams = { settings?: Partial<SettingsType> } & Omit<Partial<AppContextType>, 'settings'>

export const testingAppContext = ({
  settings = {},
  cityCode = 'augsburg',
  languageCode = 'de',
  changeCityCode = jest.fn(),
  changeLanguageCode = jest.fn(),
  updateSettings = jest.fn(),
}: TestingAppContextParams): AppContextType => ({
  settings: { ...defaultSettings, ...settings },
  cityCode,
  languageCode,
  updateSettings,
  changeCityCode,
  changeLanguageCode,
})

const TestingAppContextProvider = ({
  children,
  ...props
}: { children: ReactNode } & TestingAppContextParams): ReactElement => {
  const context = testingAppContext(props)
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

export default TestingAppContextProvider
