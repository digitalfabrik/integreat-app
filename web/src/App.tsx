import 'core-js/actual/array/at'
import { Settings as LuxonSettings } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider, createGlobalStyle } from 'styled-components'

import { setJpalTrackingCode } from 'shared/api'
import { UiDirectionType, config } from 'translations'

import RootSwitcher from './RootSwitcher'
import { ContrastThemeProvider } from './components/ContrastThemeContext'
import Helmet from './components/Helmet'
import I18nProvider from './components/I18nProvider'
import TtsContainer from './components/TtsContainer'
import buildConfig from './constants/buildConfig'
import { useContrastTheme } from './hooks/useContrastTheme'
import safeLocalStorage, { JPAL_TRACKING_CODE_KEY } from './utils/safeLocalStorage'
import { initSentry } from './utils/sentry'

const GlobalStyle = createGlobalStyle<{ isContrastTheme: boolean }>`
    body {
        position: relative;

        /* Styling for react-tooltip: https://react-tooltip.com/docs/getting-started#styling */
        --rt-color-dark: ${props => props.theme.colors.textSecondaryColor};
        --rt-color-white: ${props => props.theme.colors.backgroundColor};
        --rt-opacity: 1;
        
        /* Styling for react-datepicker */
    ${props =>
      props.isContrastTheme &&
      `
      .react-datepicker__header,
      .react-datepicker__month,
      .react-datepicker__day {
        background-color: ${props.theme.colors.backgroundColor};
      }

      .react-datepicker__current-month,
      .react-datepicker__day-names .react-datepicker__day-name,
      .react-datepicker__week,
      .react-datepicker__day {
        color: ${props.theme.colors.textColor};
      }
      
      .react-datepicker__day--today {
      border: 1px solid ${props.theme.colors.linkColor};
      background-color: transparent !important;
      border-radius: 50% !important;
      }
      
       .react-datepicker__day--selected:not([aria-disabled='true']):hover,
       .react-datepicker__day--in-selecting-range:not([aria-disabled='true']):hover,
       .react-datepicker__day--in-range:not([aria-disabled='true']):hover,
       .react-datepicker__day:not([aria-disabled=true]):hover {
         background-color: ${props.theme.colors.linkColor} !important;
      }

       .react-datepicker__day--selected {
         background-color: ${props.theme.colors.linkColor} !important;
      }
    `}
    }
`

LuxonSettings.throwOnInvalid = true
LuxonSettings.defaultLocale = config.defaultFallback

const AppContent = (): ReactElement => {
  const [contentLanguage, setContentLanguage] = useState<string>(config.defaultFallback)
  const { isContrastTheme } = useContrastTheme()
  const { t } = useTranslation('landing')

  const contentDirection = contentLanguage
    ? config.getScriptDirection(contentLanguage)
    : (getComputedStyle(document.body).direction as UiDirectionType)

  useEffect(() => {
    initSentry()
    setJpalTrackingCode(safeLocalStorage.getItem(JPAL_TRACKING_CODE_KEY))
  }, [])

  const theme = isContrastTheme
    ? { ...buildConfig().highContrastTheme, contentDirection }
    : { ...buildConfig().lightTheme, contentDirection }

  return (
    <ThemeProvider theme={theme}>
      <I18nProvider contentLanguage={contentLanguage}>
        <>
          <Helmet pageTitle={t('pageTitle')} rootPage />
          <Router>
            <GlobalStyle isContrastTheme={isContrastTheme} />
            <TtsContainer languageCode={contentLanguage}>
              <RootSwitcher setContentLanguage={setContentLanguage} />
            </TtsContainer>
          </Router>
        </>
      </I18nProvider>
    </ThemeProvider>
  )
}

const App = (): ReactElement => (
  <ContrastThemeProvider>
    <AppContent />
  </ContrastThemeProvider>
)

export default App
