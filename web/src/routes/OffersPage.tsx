import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import {
  MALTE_HELP_FORM_OFFER_ROUTE,
  OFFERS_ROUTE,
  pathnameFromRouteInformation,
  SPRUNGBRETT_OFFER_ROUTE,
  TileModel,
} from 'shared'
import { createOffersEndpoint, OfferModel, SPRUNGBRETT_OFFER, useLoadFromEndpoint } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import Tiles from '../components/Tiles'
import { cmsApiBaseUrl } from '../constants/urls'

const OffersPage = ({ city, cityCode, languageCode }: CityRouteProps): ReactElement | null => {
  const { t } = useTranslation('offers')
  const {
    data: offers,
    loading,
    error: offersError,
  } = useLoadFromEndpoint(createOffersEndpoint, cmsApiBaseUrl, { city: cityCode, language: languageCode })

  const toTileModels = useCallback(
    (offers: Array<OfferModel>): Array<TileModel> =>
      offers
        .filter(offer => offer.alias !== MALTE_HELP_FORM_OFFER_ROUTE)
        .map(offer => {
          let path = offer.path

          if (offer.alias === SPRUNGBRETT_OFFER) {
            // the url stored in the sprungbrett offer is the url of the endpoint
            path = pathnameFromRouteInformation({ route: SPRUNGBRETT_OFFER_ROUTE, cityCode, languageCode })
          }

          return new TileModel({
            title: t(offer.title),
            path,
            thumbnail: offer.thumbnail,
            postData: offer.postData,
            isExternalUrl: true,
          })
        }),
    [cityCode, languageCode, t],
  )

  if (!city) {
    return null
  }

  const languageChangePaths = city.languages.map(({ code, name }) => {
    const offersPath = pathnameFromRouteInformation({ route: OFFERS_ROUTE, cityCode, languageCode: code })
    return {
      path: offersPath,
      name,
      code,
    }
  })
  const pageTitle = `${t('pageTitle')} - ${city.name}`
  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    route: OFFERS_ROUTE,
    languageCode,
    Toolbar: <CityContentToolbar route={OFFERS_ROUTE} pageTitle={pageTitle} />,
  }

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  if (!offers) {
    const error = offersError || new Error('Offers should be available.')

    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <Tiles title={t('offers')} tiles={toTileModels(offers)} />
    </CityContentLayout>
  )
}

export default OffersPage
