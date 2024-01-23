import React, { Fragment, PropsWithChildren, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import {
  getSlugFromPath,
  MALTE_HELP_FORM_OFFER_ROUTE,
  useLoadFromEndpoint,
  createOffersEndpoint,
  NotFoundError,
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

type MalteHelpFormOfferPageProps = {
  embedded?: boolean
} & CityRouteProps

const MalteHelpFormOfferPage = ({
  city,
  cityCode,
  languageCode,
  embedded,
}: MalteHelpFormOfferPageProps): ReactElement | null => {
  const { t } = useTranslation('dashboard')

  const { data, error, loading } = useLoadFromEndpoint(createOffersEndpoint, cmsApiBaseUrl, {
    city: cityCode,
    language: languageCode,
  })
  const helpButtonOffer = data?.find(it => it.alias === MALTE_HELP_FORM_OFFER_ROUTE)

  if (!city) {
    return null
  }

  const pageTitle = `${helpButtonOffer?.title ?? t('offers')} - ${city.name}`
  const feedbackTarget = helpButtonOffer ? getSlugFromPath(helpButtonOffer.path) : undefined
  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths: [],
    route: MALTE_HELP_FORM_OFFER_ROUTE,
    languageCode,
    Toolbar: (
      <CityContentToolbar feedbackTarget={feedbackTarget} route={MALTE_HELP_FORM_OFFER_ROUTE} pageTitle={pageTitle} />
    ),
  }

  const Wrapper = embedded
    ? Fragment
    : ({ children }: PropsWithChildren) => (
        <CityContentLayout isLoading={loading} {...locationLayoutParams}>
          {children}
        </CityContentLayout>
      )

  if (loading) {
    return (
      <Wrapper>
        <LoadingSpinner />
      </Wrapper>
    )
  }

  if (!helpButtonOffer || error) {
    return (
      <Wrapper>
        <FailureSwitcher
          error={
            error ??
            new NotFoundError({
              type: 'offer',
              id: MALTE_HELP_FORM_OFFER_ROUTE,
              city: cityCode,
              language: languageCode,
            })
          }
        />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      {!embedded && <Helmet pageTitle={pageTitle} languageChangePaths={[]} cityModel={city} />}
      {!embedded && <Caption title={helpButtonOffer.title} />}
      <MalteHelpForm cityCode={cityCode} languageCode={languageCode} helpButtonOffer={helpButtonOffer} />
    </Wrapper>
  )
}

export default MalteHelpFormOfferPage
