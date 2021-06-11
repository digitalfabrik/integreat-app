import React, { ReactElement, useCallback } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import LocationLayout, { FeedbackRatingType } from '../components/LocationLayout'
import {
  CityModel,
  createOffersEndpoint,
  LanguageModel,
  OfferModel,
  OFFERS_ROUTE,
  SPRUNGBRETT_OFFER,
  SPRUNGBRETT_OFFER_ROUTE,
  useLoadFromEndpoint
} from 'api-client'
import LocationToolbar from '../components/LocationToolbar'
import TileModel from '../models/TileModel'
import { createPath } from './index'
import { cmsApiBaseUrl } from '../constants/urls'
import normalizePath from 'api-client/src/normalizePath'
import { useTranslation } from 'react-i18next'
import LoadingSpinner from '../components/LoadingSpinner'
import FailureSwitcher from '../components/FailureSwitcher'
import Tiles from '../components/Tiles'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string }>

const OffersPage = ({ cityModel, match, location, languages }: PropsType): ReactElement => {
  const { languageCode, cityCode } = match.params
  const pathname = normalizePath(location.pathname)
  const { t } = useTranslation('offers')
  const viewportSmall = false

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <LocationToolbar openFeedbackModal={openFeedback} viewportSmall={viewportSmall} />
  )

  const requestOffers = useCallback(async () => {
    return createOffersEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode })
  }, [cityCode, languageCode])
  const { data: offers, loading, error: offersError } = useLoadFromEndpoint(requestOffers)

  const toTileModels = useCallback(
    (offers: Array<OfferModel>): Array<TileModel> => {
      return offers.map(offer => {
        let path = offer.path

        if (offer.alias === SPRUNGBRETT_OFFER) {
          path = createPath(SPRUNGBRETT_OFFER_ROUTE, { cityCode, languageCode })
        }

        return new TileModel({
          title: offer.title,
          // the url stored in the sprungbrett offer is the url of the endpoint
          path: path,
          thumbnail: offer.thumbnail,
          // every offer except from the sprungbrett offer is just a link to an external site
          isExternalUrl: path === offer.path,
          postData: offer.postData
        })
      })
    },
    [cityCode, languageCode]
  )

  const languageChangePaths = languages.map(({ code, name }) => {
    const offersPath = createPath(OFFERS_ROUTE, { cityCode, languageCode: code })
    return {
      path: offersPath,
      name,
      code
    }
  })

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: { path: createPath(OFFERS_ROUTE, { cityCode, languageCode }) },
    languageChangePaths,
    route: OFFERS_ROUTE,
    languageCode,
    pathname,
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

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Tiles title={t('offers')} tiles={toTileModels(offers)} />
    </LocationLayout>
  )
}

export default OffersPage
