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
  useLoadFromEndpoint,
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import Tiles from '../components/Tiles'
import { cmsApiBaseUrl } from '../constants/urls'
import useWindowDimensions from '../hooks/useWindowDimensions'
import TileModel from '../models/TileModel'

const OffersPage = ({ city, cityCode, languageCode }: CityRouteProps): ReactElement | null => {
  const { t } = useTranslation('offers')
  const { viewportSmall } = useWindowDimensions()

  const {
    data: offers,
    loading,
    error: offersError,
  } = useLoadFromEndpoint(createOffersEndpoint, cmsApiBaseUrl, { city: cityCode, language: languageCode })

  const toTileModels = useCallback(
    (offers: Array<OfferModel>): Array<TileModel> =>
      offers.map(offer => {
        let path = offer.path

        if (offer.alias === SPRUNGBRETT_OFFER) {
          // the url stored in the sprungbrett offer is the url of the endpoint
          path = pathnameFromRouteInformation({ route: SPRUNGBRETT_OFFER_ROUTE, cityCode, languageCode })
        } else if (offer.alias === SHELTER_ROUTE) {
          path = pathnameFromRouteInformation({ route: SHELTER_ROUTE, cityCode, languageCode })
        }

        return new TileModel({
          title: t(offer.title),
          path,
          thumbnail: offer.thumbnail,
          postData: offer.postData,
        })
      }),
    [cityCode, languageCode, t]
  )

  if (!city) {
    return null
  }

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <CityContentToolbar openFeedbackModal={openFeedback} viewportSmall={viewportSmall} />
  )

  const languageChangePaths = city.languages.map(({ code, name }) => {
    const offersPath = pathnameFromRouteInformation({ route: OFFERS_ROUTE, cityCode, languageCode: code })
    return {
      path: offersPath,
      name,
      code,
    }
  })

  const locationLayoutParams = {
    city,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths,
    route: OFFERS_ROUTE,
    languageCode,
    toolbar,
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

  const pageTitle = `${t('pageTitle')} - ${city.name}`

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <Tiles title={t('offers')} tiles={toTileModels(offers)} />
    </CityContentLayout>
  )
}

export default OffersPage
