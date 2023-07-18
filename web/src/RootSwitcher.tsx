import React, { ReactElement, Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes, useMatch } from 'react-router-dom'

import {
  CITY_NOT_COOPERATING_ROUTE,
  cityContentPath,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LICENSES_ROUTE,
  MAIN_DISCLAIMER_ROUTE,
  NOT_FOUND_ROUTE,
  pathnameFromRouteInformation,
} from 'api-client'

import CityContentSwitcher from './CityContentSwitcher'
import LoadingSpinner from './components/LoadingSpinner'
import buildConfig from './constants/buildConfig'
import useScrollToTop from './hooks/useScrollToTop'
import { cityContentPattern, RoutePatterns } from './routes'
import CityNotCooperatingPage from './routes/CityNotCooperatingPage'
import JpalTrackingPage from './routes/JpalTrackingPage'
import lazyWithRetry from './utils/retryImport'

type RootSwitcherProps = {
  setContentLanguage: (languageCode: string) => void
}

const MainDisclaimerPage = lazyWithRetry(() => import('./routes/MainDisclaimerPage'))
const LandingPage = lazyWithRetry(() => import('./routes/LandingPage'))
const NotFoundPage = lazyWithRetry(() => import('./routes/NotFoundPage'))
const LicensesPage = lazyWithRetry(() => import('./routes/LicensesPage'))

const RootSwitcher = ({ setContentLanguage }: RootSwitcherProps): ReactElement => {
  const { i18n } = useTranslation()
  const { fixedCity, cityNotCooperating, jpalTracking } = buildConfig().featureFlags
  const languageCode = useMatch('/:slug/:languageCode/*')?.params.languageCode
  useScrollToTop()

  const detectedLanguageCode = i18n.language
  const language = languageCode ?? detectedLanguageCode

  useEffect(() => {
    if (language !== detectedLanguageCode) {
      setContentLanguage(language)
    }
  }, [language, detectedLanguageCode, setContentLanguage])

  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode: language })
  const fixedCityPath = fixedCity ? cityContentPath({ cityCode: fixedCity, languageCode: language }) : null

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path={RoutePatterns[LANDING_ROUTE]} element={<LandingPage languageCode={language} />} />
        <Route path={RoutePatterns[MAIN_DISCLAIMER_ROUTE]} element={<MainDisclaimerPage languageCode={language} />} />
        <Route path={RoutePatterns[NOT_FOUND_ROUTE]} element={<NotFoundPage />} />
        <Route path={RoutePatterns[LICENSES_ROUTE]} element={<LicensesPage languageCode={language} />} />
        <Route path={cityContentPattern} element={<CityContentSwitcher languageCode={language} />} />

        {cityNotCooperating && (
          <Route
            path={RoutePatterns[CITY_NOT_COOPERATING_ROUTE]}
            element={<CityNotCooperatingPage languageCode={language} />}
          />
        )}
        {jpalTracking && (
          <Route path={RoutePatterns[JPAL_TRACKING_ROUTE]} element={<JpalTrackingPage />}>
            <Route path=':trackingCode' element={null} />
          </Route>
        )}

        {/* Redirects */}
        <Route path='/' element={<Navigate to={fixedCityPath ?? landingPath} replace />} />
        <Route path={LANDING_ROUTE} element={<Navigate to={fixedCityPath ?? landingPath} replace />} />
        <Route path='/:cityCode' element={<Navigate to={fixedCityPath ?? language} replace />} />
        {!!fixedCityPath && (
          <Route path={RoutePatterns[LANDING_ROUTE]} element={<Navigate to={fixedCityPath} replace />} />
        )}
      </Routes>
    </Suspense>
  )
}

export default RootSwitcher
