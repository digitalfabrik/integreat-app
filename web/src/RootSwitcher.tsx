import React, { ReactElement, Suspense, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'

import {
  CATEGORIES_ROUTE,
  createCitiesEndpoint,
  LANDING_ROUTE,
  MAIN_DISCLAIMER_ROUTE,
  NOT_FOUND_ROUTE,
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
import { cityContentPattern, createPath, RoutePatterns } from './routes'
import lazyWithRetry from './utils/retryImport'
import { useMatch, Navigate } from 'react-router-dom'

type PropsType = {
  setContentLanguage: (languageCode: string) => void
}

const MainDisclaimerPage = lazyWithRetry(() => import('./routes/MainDisclaimerPage'))
const LandingPage = lazyWithRetry(() => import('./routes/LandingPage'))
const NotFoundPage = lazyWithRetry(() => import('./routes/NotFoundPage'))

const RootSwitcher = ({ setContentLanguage }: PropsType): ReactElement => {
  const requestCities = useCallback(async () => createCitiesEndpoint(cmsApiBaseUrl).request(), [])
  const { data: cities, loading, error } = useLoadFromEndpoint(requestCities)
  const { i18n } = useTranslation()
  const fixedCity = buildConfig().featureFlags.fixedCity
  // LanguageCode is always the second param (if there is one)
  const languageCode = useMatch<{ languageCode?: string }>('/:slug/:languageCode')?.params.languageCode
  const { viewportSmall } = useWindowDimensions()

  const detectedLanguageCode = i18n.language
  const language = languageCode ?? detectedLanguageCode

  if (language !== detectedLanguageCode) {
    setContentLanguage(language)
  }

  const landingPath = createPath(LANDING_ROUTE, { languageCode: language })
  const cityContentPath = createPath(CATEGORIES_ROUTE, { cityCode: fixedCity ?? ':cityCode', languageCode: language })

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

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/*{fixedCity && <Redirect exact from={RoutePatterns[LANDING_ROUTE]} to={cityContentPath} />}*/}
        {fixedCity && <Route path={RoutePatterns[LANDING_ROUTE]} element={<Navigate to={cityContentPath} />} />}

        <Route
          path={RoutePatterns[LANDING_ROUTE]}
          element={<LandingPage cities={relevantCities} />}
        />
        <Route
          path={RoutePatterns[MAIN_DISCLAIMER_ROUTE]}
          element={<MainDisclaimerPage languageCode={language} />}
        />
        <Route path={RoutePatterns[NOT_FOUND_ROUTE]} element={<NotFoundPage/>} />
        {/* I'm not sure if we need to change path here, because here was no exact before */}
        <Route path={cityContentPattern} element={<CityContentSwitcher cities={relevantCities}/>} />
        <Route path='/' element={<Navigate to={landingPath} />}/>
        <Route path={`/${LANDING_ROUTE}`} element={<Navigate to={landingPath} />}/>
        <Route path='/:cityCode' element={<Navigate to={cityContentPath} />}/>
      </Routes>
    </Suspense>
  )
}

export default RootSwitcher
