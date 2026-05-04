import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes, useMatch } from 'react-router'

import {
  SUGGEST_TO_REGION_ROUTE,
  regionContentPath,
  CONSENT_ROUTE,
  LANDING_ROUTE,
  LICENSES_ROUTE,
  MAIN_IMPRINT_ROUTE,
  NOT_FOUND_ROUTE,
  pathnameFromRouteInformation,
  RESERVED_REGION_CONTENT_SLUGS,
} from 'shared'

import FixedRegionContentNavigator from './FixedRegionContentNavigator'
import RegionContentNavigator from './RegionContentNavigator'
import buildConfig from './constants/buildConfig'
import useScrollToTop from './hooks/useScrollToTop'
import { regionContentPattern, RoutePatterns } from './routes'
import ConsentPage from './routes/ConsentPage'
import SuggestToRegionPage from './routes/SuggestToRegionPage'
import lazyWithRetry from './utils/retryImport'

type RootNavigatorProps = {
  setContentLanguage: (languageCode: string) => void
}

const MainImprintPage = lazyWithRetry(() => import('./routes/MainImprintPage'))
const LandingPage = lazyWithRetry(() => import('./routes/LandingPage'))
const NotFoundPage = lazyWithRetry(() => import('./routes/NotFoundPage'))
const LicensesPage = lazyWithRetry(() => import('./routes/LicensesPage'))

const RootNavigator = ({ setContentLanguage }: RootNavigatorProps): ReactElement => {
  const { i18n } = useTranslation()
  const { fixedRegion, suggestToRegion } = buildConfig().featureFlags
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
  const fixedRegionPath = fixedRegion ? regionContentPath({ regionCode: fixedRegion, languageCode: language }) : null
  return (
    <Routes>
      {!fixedRegion && <Route path={RoutePatterns[LANDING_ROUTE]} element={<LandingPage languageCode={language} />} />}
      <Route path={RoutePatterns[MAIN_IMPRINT_ROUTE]} element={<MainImprintPage languageCode={language} />} />
      <Route path={RoutePatterns[NOT_FOUND_ROUTE]} element={<NotFoundPage />} />
      <Route path={RoutePatterns[CONSENT_ROUTE]} element={<ConsentPage languageCode={language} />} />
      <Route path={RoutePatterns[LICENSES_ROUTE]} element={<LicensesPage languageCode={language} />} />
      <Route
        path={regionContentPattern}
        element={
          fixedRegion ? (
            <FixedRegionContentNavigator languageCode={language} fixedRegion={fixedRegion} />
          ) : (
            <RegionContentNavigator languageCode={language} />
          )
        }
      />

      {suggestToRegion && (
        <Route
          path={RoutePatterns[SUGGEST_TO_REGION_ROUTE]}
          element={<SuggestToRegionPage languageCode={language} />}
        />
      )}

      {/* Redirects */}
      <Route path='/' element={<Navigate to={fixedRegionPath ?? landingPath} replace />} />
      {!!fixedRegionPath && (
        <Route path={RoutePatterns[LANDING_ROUTE]} element={<Navigate to={fixedRegionPath} replace />} />
      )}
      {/* also handles redirects from /landing to /landing/de */}
      <Route path='/:regionCode' element={<Navigate to={fixedRegionPath ?? language} replace />} />

      {/* Language independent urls */}
      {RESERVED_REGION_CONTENT_SLUGS.map(slug => (
        <Route
          key={slug}
          path={`/:regionCode/${slug}/*`}
          element={<Navigate to={`/${routeParam0}/${detectedLanguageCode}/${slug}/${splat ?? ''}`} replace />}
        />
      ))}
    </Routes>
  )
}

export default RootNavigator
