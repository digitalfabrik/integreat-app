import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import {
  createOffersEndpoint,
  OfferModel,
  OFFERS_ROUTE,
  pathnameFromRouteInformation,
  SHELTER_ROUTE,
  SPRUNGBRETT_OFFER,
  SPRUNGBRETT_OFFER_ROUTE,
  useLoadFromEndpoint
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import FailureSwitcher from '../components/FailureSwitcher'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationLayout from '../components/LocationLayout'
import LocationToolbar from '../components/LocationToolbar'
import Tiles from '../components/Tiles'
import { cmsApiBaseUrl } from '../constants/urls'
import TileModel from '../models/TileModel'

const OffersPage = ({ cityModel, cityCode, languageCode, languages }: CityRouteProps): ReactElement => {
  const { t } = useTranslation('offers')
  const viewportSmall = false

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <LocationToolbar openFeedbackModal={openFeedback} viewportSmall={viewportSmall} />
  )

  const requestOffers = useCallback(
    async () => createOffersEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode }),
    [cityCode, languageCode]
  )
  const { data: offers, loading, error: offersError } = useLoadFromEndpoint(requestOffers)

  const toTileModels = useCallback(
    (offers: Array<OfferModel>): Array<TileModel> =>
      offers.map(offer => {
        let path = offer.path

        if (offer.alias === SPRUNGBRETT_OFFER) {
          path = pathnameFromRouteInformation({ route: SPRUNGBRETT_OFFER_ROUTE, cityCode, languageCode })
        }

        return new TileModel({
          title: t(offer.title),
          // the url stored in the sprungbrett offer is the url of the endpoint
          path,
          thumbnail: offer.thumbnail,
          postData: offer.postData
        })
      }),
    [cityCode, languageCode, t]
  )

  const languageChangePaths = languages.map(({ code, name }) => {
    const offersPath = pathnameFromRouteInformation({ route: OFFERS_ROUTE, cityCode, languageCode: code })
    return {
      path: offersPath,
      name,
      code
    }
  })

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: { path: pathnameFromRouteInformation({ route: OFFERS_ROUTE, cityCode, languageCode }) },
    languageChangePaths,
    route: OFFERS_ROUTE,
    languageCode,
    toolbar
  }

  if (loading) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </LocationLayout>
    )
  }

  if (!offers) {
    const error = offersError || new Error('Offers should be available.')

    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </LocationLayout>
    )
  }

  const pageTitle = `${t('pageTitle')} - ${cityModel.name}`

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <Tiles title={t('offers')} tiles={toTileModels(offers)} />
    </LocationLayout>
  )
}

export default OffersPage
