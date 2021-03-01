// @flow

import React, { useState, useEffect, useCallback } from 'react'
import { RefreshControl } from 'react-native'
import Offers from '../components/Offers'
import { type TFunction, withTranslation } from 'react-i18next'
import { createOffersEndpoint, OfferModel } from 'api-client'
import type { ThemeType } from 'build-configs/ThemeType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import type { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import { EXTERNAL_OFFER_ROUTE, SPRUNGBRETT_OFFER_ROUTE, WOHNEN_OFFER_ROUTE } from 'api-client/src/routes'
import LayoutedScrollView from '../../../modules/common/containers/LayoutedScrollView'
import openExternalUrl from '../../../modules/common/openExternalUrl'
import type { OffersRouteType } from 'api-client/src/routes'
import createNavigateToFeedbackModal from '../../../modules/navigation/createNavigateToFeedbackModal'
import { fromError } from '../../../modules/error/ErrorCodes'
import loadFromEndpoint from '../../../modules/endpoint/loadFromEndpoint'
import TileModel from '../../../modules/common/models/TileModel'

type OwnPropsType = {|
  route: RoutePropType<OffersRouteType>,
  navigation: NavigationPropType<OffersRouteType>
|}

type OffersPropsType = {|
  ...OwnPropsType,
  theme: ThemeType,
  t: TFunction
|}

const OffersContainer = ({ theme, t, navigation, route }: OffersPropsType) => {
  const [offers, setOffers] = useState<?Array<OfferModel>>(null)
  const [error, setError] = useState<?Error>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const { cityCode, languageCode } = route.params

  const loadOffers = useCallback(async () => {
    const request = async (apiUrl: string) =>
      await createOffersEndpoint(apiUrl).request({ city: cityCode, language: languageCode })

    await loadFromEndpoint<Array<OfferModel>>(request, setOffers, setError, setLoading)
  }, [cityCode, languageCode, setOffers, setError, setLoading])

  useEffect(() => {
    loadOffers().catch(e => setError(e))
  }, [])

  const navigateToOffer = useCallback((tile: TileModel) => {
    const { title, path, isExternalUrl, postData } = tile
    const offer = offers && offers.find(offer => offer.title === title)
    if (!offer) {
      return
    }

    if (isExternalUrl && postData) {
      // HTTP POST is neither supported by the InAppBrowser nor by Linking, therefore we have to open it in a webview
      if (postData) {
        navigation.push(EXTERNAL_OFFER_ROUTE, { url: path, shareUrl: path, postData })
      } else {
        openExternalUrl(path)
      }
    } else {
      if (offer.alias === SPRUNGBRETT_OFFER_ROUTE) {
        // const shareUrl = cityContentUrl({ cityCode, languageCode, route: OFFERS_ROUTE, path: offer.alias })
        const params = { cityCode, languageCode, title, alias: offer.alias, apiUrl: offer.path }
        navigation.push(SPRUNGBRETT_OFFER_ROUTE, params)
      } else if (offer.alias === WOHNEN_OFFER_ROUTE) {
        const params = { city: cityCode, title, alias: offer.alias, postData, offerHash: null }
        navigation.push(WOHNEN_OFFER_ROUTE, params)
      }
    }
  }, [offers, cityCode, languageCode, navigation])

  const navigateToFeedback = useCallback((isPositiveFeedback: boolean) => {
    if (offers) {
      createNavigateToFeedbackModal(navigation)({
        type: 'Offers',
        language: languageCode,
        cityCode,
        offers,
        isPositiveFeedback
      })
    }
  }, [offers, languageCode, cityCode, navigation])

  if (error) {
    return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={loadOffers} refreshing={loading} />}>
        <FailureContainer errorMessage={error.message} code={fromError(error)} tryAgain={loadOffers} />
      </LayoutedScrollView>
  }

  return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={loadOffers} refreshing={loading} />}>
    {offers && <Offers offers={offers} navigateToOffer={navigateToOffer} theme={theme} t={t}
                       navigateToFeedback={navigateToFeedback} language={languageCode} /> }
    </LayoutedScrollView>
}

export default withTranslation('offers')(
  withTheme(OffersContainer)
)
