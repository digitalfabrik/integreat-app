import React, { ReactElement, Suspense, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes, useMatch } from 'react-router-dom'

import {
  CITY_NOT_COOPERATING_ROUTE,
  cityContentPath,
  createCitiesEndpoint,
  LANDING_ROUTE,
  MAIN_DISCLAIMER_ROUTE,
  NOT_FOUND_ROUTE,
  pathnameFromRouteInformation,
  useLoadFromEndpoint
} from 'api-client'

import CityContentSwitcher from './CityContentSwitcher'
import FailureSwitcher from './components/FailureSwitcher'
import GeneralFooter from './components/GeneralFooter'
import GeneralHeader from './components/GeneralHeader'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'
import buildConfig from './constants/buildConfig'
import { cmsApiBaseUrl } from './constants/urls'
import useWindowDimensions from './hooks/useWindowDimensions'
import { cityContentPattern, RoutePatterns } from './routes'
import CityNotCooperatingPage from './routes/CityNotCooperatingPage'
import lazyWithRetry from './utils/retryImport'

type PropsType = {
  setContentLanguage: (languageCode: string) => void
}

const MainDisclaimerPage = lazyWithRetry(() => import('./routes/MainDisclaimerPage'))
const LandingPage = lazyWithRetry(() => import('./routes/LandingPage'))
const NotFoundPage = lazyWithRetry(() => import('./routes/NotFoundPage'))

export const cityNotCooperatingEnabled =
  buildConfig().featureFlags.cityNotCooperatingTemplate && buildConfig().icons.cityNotCooperating

const RootSwitcher = ({ setContentLanguage }: PropsType): ReactElement => {
  const requestCities = useCallback(async () => createCitiesEndpoint(cmsApiBaseUrl).request(), [])
  const { data: cities, loading, error } = useLoadFromEndpoint(requestCities)
  const { i18n } = useTranslation()
  const fixedCity = buildConfig().featureFlags.fixedCity
  const languageCode = useMatch('/:slug/:languageCode/*')?.params.languageCode
  const { viewportSmall } = useWindowDimensions()

  const detectedLanguageCode = i18n.language
  const language = languageCode ?? detectedLanguageCode

  useEffect(() => {
    if (language !== detectedLanguageCode) {
      setContentLanguage(language)
    }
  }, [language, detectedLanguageCode, setContentLanguage])

  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode: language })
  const fixedCityPath = fixedCity ? cityContentPath({ cityCode: fixedCity, languageCode: language }) : null

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    )
  }

  if (!cities || error) {
    return (
      <Layout
        header={<GeneralHeader languageCode={language} viewportSmall={viewportSmall} />}
        footer={<GeneralFooter language={language} />}>
        <FailureSwitcher error={error ?? new Error('Cities not available')} />
      </Layout>
    )
  }
  const relevantCities = fixedCity ? cities.filter(city => city.code === fixedCity) : cities

  const props = {
    cities: relevantCities,
    languageCode: language
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path={RoutePatterns[LANDING_ROUTE]} element={<LandingPage {...props} />} />
        {cityNotCooperatingEnabled && (
          <Route path={RoutePatterns[CITY_NOT_COOPERATING_ROUTE]} element={<CityNotCooperatingPage {...props} />} />
        )}
        <Route path={RoutePatterns[MAIN_DISCLAIMER_ROUTE]} element={<MainDisclaimerPage {...props} />} />
        <Route path={RoutePatterns[NOT_FOUND_ROUTE]} element={<NotFoundPage />} />
        <Route path={cityContentPattern} element={<CityContentSwitcher {...props} />} />

        {/* Redirects */}
        <Route path='/' element={<Navigate to={fixedCityPath ?? landingPath} />} />
        <Route path={LANDING_ROUTE} element={<Navigate to={fixedCityPath ?? landingPath} />} />
        <Route path='/:cityCode' element={<Navigate to={fixedCityPath ?? language} />} />
        {fixedCityPath && <Route path={RoutePatterns[LANDING_ROUTE]} element={<Navigate to={fixedCityPath} />} />}
      </Routes>
    </Suspense>
  )
}

export default RootSwitcher
