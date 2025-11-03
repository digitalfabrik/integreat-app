import CircularProgress from '@mui/material/CircularProgress'
import React, { ReactElement, Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes, useMatch } from 'react-router'

import {
  CITY_NOT_COOPERATING_ROUTE,
  cityContentPath,
  CONSENT_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LICENSES_ROUTE,
  MAIN_DISCLAIMER_ROUTE,
  NOT_FOUND_ROUTE,
  pathnameFromRouteInformation,
  RESERVED_CITY_CONTENT_SLUGS,
} from 'shared'

import CityContentSwitcher from './CityContentSwitcher'
import FixedCityContentSwitcher from './FixedCityContentSwitcher'
import buildConfig from './constants/buildConfig'
import useScrollToTop from './hooks/useScrollToTop'
import { cityContentPattern, RoutePatterns } from './routes'
import CityNotCooperatingPage from './routes/CityNotCooperatingPage'
import ConsentPage from './routes/ConsentPage'
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
  const { routeParam0, routeParam1, '*': splat } = useMatch('/:routeParam0/:routeParam1/*')?.params ?? {}
  useScrollToTop()

  const detectedLanguageCode = i18n.language
  const language = routeParam1 ?? detectedLanguageCode

  useEffect(() => {
    if (language !== detectedLanguageCode) {
      setContentLanguage(language)
    }
  }, [language, detectedLanguageCode, setContentLanguage])

  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode: language })
  const fixedCityPath = fixedCity ? cityContentPath({ cityCode: fixedCity, languageCode: language }) : null
  return (
    <Suspense fallback={<CircularProgress />}>
      <Routes>
        {!fixedCity && <Route path={RoutePatterns[LANDING_ROUTE]} element={<LandingPage languageCode={language} />} />}
        <Route path={RoutePatterns[MAIN_DISCLAIMER_ROUTE]} element={<MainDisclaimerPage languageCode={language} />} />
        <Route path={RoutePatterns[NOT_FOUND_ROUTE]} element={<NotFoundPage />} />
        <Route path={RoutePatterns[CONSENT_ROUTE]} element={<ConsentPage languageCode={language} />} />
        <Route path={RoutePatterns[LICENSES_ROUTE]} element={<LicensesPage languageCode={language} />} />
        <Route
          path={cityContentPattern}
          element={
            fixedCity ? (
              <FixedCityContentSwitcher languageCode={language} fixedCity={fixedCity} />
            ) : (
              <CityContentSwitcher languageCode={language} />
            )
          }
        />

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
        {!!fixedCityPath && (
          <Route path={RoutePatterns[LANDING_ROUTE]} element={<Navigate to={fixedCityPath} replace />} />
        )}
        {/* also handles redirects from /landing to /landing/de */}
        <Route path='/:cityCode' element={<Navigate to={fixedCityPath ?? language} replace />} />

        {/* Language independent urls */}
        {RESERVED_CITY_CONTENT_SLUGS.map(slug => (
          <Route
            key={slug}
            path={`/:cityCode/${slug}/*`}
            element={<Navigate to={`/${routeParam0}/${detectedLanguageCode}/${slug}/${splat ?? ''}`} replace />}
          />
        ))}
      </Routes>
    </Suspense>
  )
}

export default RootSwitcher
