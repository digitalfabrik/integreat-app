// @flow

import React, { useState, useEffect, useCallback } from 'react'
import { RefreshControl } from 'react-native'
import Offers from '../components/Offers'
import { type TFunction, withTranslation } from 'react-i18next'
import { createOffersEndpoint, OfferModel, Payload } from 'api-client'
import type { ThemeType } from 'build-configs/ThemeType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'
import type {
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/constants/NavigationTypes'
import {
  EXTERNAL_OFFER_ROUTE, OFFERS_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  WOHNEN_OFFER_ROUTE
} from 'api-client/src/routes'
import LayoutedScrollView from '../../../modules/common/containers/LayoutedScrollView'
import { cityContentUrl } from '../../../modules/navigation/url'
import openExternalUrl from '../../../modules/common/openExternalUrl'
import type { OffersRouteType } from 'api-client/src/routes'
import createNavigateToFeedbackModal from '../../../modules/navigation/createNavigateToFeedbackModal'

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
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const { cityCode, languageCode } = route.params

  const loadOffers = useCallback(async () => {
    setLoading(true)

    try {
      const apiUrl = await determineApiUrl()
      const payload: Payload<Array<OfferModel>> = await (createOffersEndpoint(apiUrl).request({
        city: cityCode,
        language: languageCode
      }))

      if (payload.error) {
        setError(payload.error.message)
        setOffers(null)
      } else {
        setOffers(payload.data)
      }
    } catch (e) {
      setError(e)
      setOffers(null)
    } finally {
      setLoading(false)
    }
  }, [cityCode, languageCode, setOffers, setError, setLoading])

  useEffect(() => {
    loadOffers().catch(e => setError(e))
  }, [])

  const navigateToOffer = useCallback((
    offers: Array<OfferModel>,
    path: string,
    isExternalUrl: boolean,
    postData: ?Map<string, string>
  ) => {
    // HTTP POST is neither supported by the InAppBrowser nor by Linking, therefore we have to open it in a webview
    if (isExternalUrl && postData) {
      navigation.push(EXTERNAL_OFFER_ROUTE, { url: path, shareUrl: path, postData })
    } else if (isExternalUrl) {
      openExternalUrl(path)
    } else if (path === SPRUNGBRETT_OFFER_ROUTE) {
      const shareUrl = cityContentUrl({ cityCode, languageCode, route: OFFERS_ROUTE, path })
      const params = { city: cityCode, offers, shareUrl }
      navigation.push(SPRUNGBRETT_OFFER_ROUTE, params)
    } else if (path === WOHNEN_OFFER_ROUTE) {
      const params = { city: cityCode, offers, offerHash: null }
      navigation.push(WOHNEN_OFFER_ROUTE, params)
    }
  }, [cityCode, languageCode, navigation])

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
        <FailureContainer errorMessage={error} tryAgain={loadOffers} />
      </LayoutedScrollView>
  }

  return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={loadOffers} refreshing={loading} />}>
    {offers && <Offers offers={offers} navigateToOffer={navigateToOffer} theme={theme} t={t}
                       navigateToFeedback={navigateToFeedback} cityCode={cityCode} language={languageCode} /> }
    </LayoutedScrollView>
}

export default withTranslation('offers')(
  withTheme(OffersContainer)
)
