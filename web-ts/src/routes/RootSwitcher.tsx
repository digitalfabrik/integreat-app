import React, { ReactElement, useCallback } from 'react'
import { Redirect, Route, Switch, useLocation, useParams, useRouteMatch } from 'react-router-dom'
import LandingPage from './landing/LandingPage'
import NotFoundPage from './not-found/NotFoundPage'
import {
  useLoadFromEndpoint,
  LANDING_ROUTE,
  CityModel,
  createCitiesEndpoint,
  NOT_FOUND_ROUTE,
  MAIN_DISCLAIMER_ROUTE
} from 'api-client'
import CityContentSwitcher from './CityContentSwitcher'
import { cmsApiBaseUrl } from '../constants/urls'
import Layout from '../components/Layout'
import GeneralHeader from '../components/GeneralHeader'
import GeneralFooter from '../components/GeneralFooter'
import FailureSwitcher from '../components/FailureSwitcher'
import MainDisclaimerPage from './main-disclaimer/MainDisclaimerPage'
import LoadingSpinner from '../components/LoadingSpinner'
import { useTranslation } from 'react-i18next'

type PropsType = {
  setContentLanguage: (languageCode: string) => void
}

const RootSwitcher = ({ setContentLanguage }: PropsType): ReactElement => {
  const requestCities = useCallback(async () => createCitiesEndpoint(cmsApiBaseUrl).request(undefined), [])
  const { data: cities, loading, error } = useLoadFromEndpoint<CityModel[]>(requestCities)
  const { i18n } = useTranslation()
  // LanguageCode is always the second param (if there is one)
  const languageCode = useRouteMatch<{ languageCode?: string }>('/:slug/:languageCode')?.params.languageCode

  const detectedLanguageCode = i18n.language
  const language = languageCode ?? detectedLanguageCode

  if (language !== detectedLanguageCode) {
    setContentLanguage(language)
  }

  if (loading) {
    return <Layout><LoadingSpinner /></Layout>
  }

  if (!cities || error) {
    return (
      <Layout header={<GeneralHeader viewportSmall={false} />} footer={<GeneralFooter language={language} />}>
        <FailureSwitcher error={error ?? new Error('Cities not available')} />
      </Layout>
    )
  }

  return (
    <Switch>
      <Route exact path={`/${LANDING_ROUTE}/:languageCode`} component={LandingPage} />
      <Route exact path={`/${MAIN_DISCLAIMER_ROUTE}`} component={MainDisclaimerPage} />
      <Route exact path={`/${NOT_FOUND_ROUTE}`} component={NotFoundPage} />
      <Route path={`/:cityCode/:languageCode`} render={props => <CityContentSwitcher cities={cities} {...props} />} />

      <Redirect exact from='/' to={`/${LANDING_ROUTE}/${language}`} />
      <Redirect exact from={`/${LANDING_ROUTE}?`} to={`/${LANDING_ROUTE}/${language}`} />
      <Redirect exact from={`/:cityCode`} to={`/:cityCode/${language}`} />
      {/* TODO redirects for aschaffenburg */}
    </Switch>
  )
}

export default RootSwitcher
