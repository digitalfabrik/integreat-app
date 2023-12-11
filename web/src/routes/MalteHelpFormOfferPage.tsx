import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import {
  pathnameFromRouteInformation,
  getSlugFromPath,
  useLoadAsync,
  submitHelpForm,
  MALTE_HELP_FORM_OFFER_ROUTE,
  cityContentPath,
  CATEGORIES_ROUTE,
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import Caption from '../components/Caption'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import MalteHelpForm from '../components/MalteHelpForm'
import { cmsApiBaseUrl } from '../constants/urls'

const MalteHelpFormOfferPage = ({ city, cityCode, languageCode, embedded }: CityRouteProps): ReactElement | null => {
  const { t } = useTranslation('dashboard')
  const load = useCallback(
    () => submitHelpForm({ cityCode, languageCode, baseUrl: cmsApiBaseUrl }),
    [cityCode, languageCode],
  )
  const { data, error, loading } = useLoadAsync(load)

  if (!city) {
    return null
  }

  const languageChangePaths = city.languages.map(({ code, name }) => ({
    path: pathnameFromRouteInformation({ route: MALTE_HELP_FORM_OFFER_ROUTE, cityCode, languageCode: code }),
    name,
    code,
  }))

  const pageTitle = `${data?.helpButtonOffer.title ?? t('offers')} - ${city.name}`
  const feedbackTarget = data?.helpButtonOffer ? getSlugFromPath(data.helpButtonOffer.path) : undefined
  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    embedded,
    city,
    languageChangePaths,
    route: MALTE_HELP_FORM_OFFER_ROUTE,
    languageCode,
    Toolbar: (
      <CityContentToolbar
        languageCode={languageCode}
        feedbackTarget={feedbackTarget}
        route={MALTE_HELP_FORM_OFFER_ROUTE}
        pageTitle={pageTitle}
      />
    ),
  }

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  if (!data) {
    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error ?? new Error('Data missing')} />
      </CityContentLayout>
    )
  }

  const { helpButtonOffer: offer, submit } = data

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      {!embedded && <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />}
      {!embedded && <Caption title={offer.title} />}
      <MalteHelpForm dashboardRoute={cityContentPath({ cityCode, languageCode })} submit={submit} />
    </CityContentLayout>
  )
}

export default MalteHelpFormOfferPage
