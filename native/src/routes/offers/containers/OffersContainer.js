// @flow

import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { RefreshControl } from 'react-native'
import Offers from '../components/Offers'
import { type TFunction, withTranslation } from 'react-i18next'
import { createOffersEndpoint, OfferModel, Payload } from 'api-client'
import type { ThemeType } from 'build-configs/ThemeType'
import type { StateType } from '../../../modules/app/StateType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import { LOADING_TIMEOUT } from '../../../modules/common/constants'
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
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import type { Dispatch } from 'redux'
import LayoutedScrollView from '../../../modules/common/containers/LayoutedScrollView'
import LayoutContainer from '../../../modules/layout/containers/LayoutContainer'
import { cityContentUrl } from '../../../modules/navigation/url'
import openExternalUrl from '../../../modules/common/openExternalUrl'
import type { OffersRouteType } from 'api-client/src/routes'
import createNavigateToFeedbackModal from '../../../modules/navigation/createNavigateToFeedbackModal'

type OwnPropsType = {|
  route: RoutePropType<OffersRouteType>,
  navigation: NavigationPropType<OffersRouteType>
|}

type StatePropsType = {| city: ?string, language: string |}
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType): StatePropsType => {
  return {
    city: state.cityContent?.city,
    language: state.contentLanguage
  }
}

type OffersPropsType = {|
  ...OwnPropsType,
  city: ?string,
  language: string,
  theme: ThemeType,
  t: TFunction
|}

const OffersContainer = ({ theme, t, navigation, city, language, route }: OffersPropsType) => {
  const [offers, setOffers] = useState<?Array<OfferModel>>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [timeoutExpired, setTimeoutExpired] = useState<boolean>(false)

  const loadOffers = useCallback(async () => {
    // TODO pass city and language as route params
    if (!city) {
      setError('Missing city!')
      return
    }
    setError(null)
    setTimeoutExpired(false)
    setLoading(true)
    setTimeout(() => setTimeoutExpired(true), LOADING_TIMEOUT)

    try {
      const apiUrl = await determineApiUrl()
      const payload: Payload<Array<OfferModel>> = await (createOffersEndpoint(apiUrl).request({
        city,
        language
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
  }, [city, language, setOffers, setError, setLoading, setTimeoutExpired])

  useEffect(() => {
    loadOffers().catch(e => setError(e))
  }, [])

  const navigateToOffer = useCallback((
    offers: Array<OfferModel>,
    path: string,
    isExternalUrl: boolean,
    postData: ?Map<string, string>
  ) => {
    if (!city) {
      return
    }

    // HTTP POST is neither supported by the InAppBrowser nor by Linking, therefore we have to open it in a webview
    if (isExternalUrl && postData) {
      navigation.push(EXTERNAL_OFFER_ROUTE, { url: path, shareUrl: path, postData })
    } else if (isExternalUrl) {
      openExternalUrl(path)
    } else if (path === SPRUNGBRETT_OFFER_ROUTE) {
      const shareUrl = cityContentUrl({ cityCode: city, languageCode: language, route: OFFERS_ROUTE, path })
      const params = { city, offers, shareUrl }
      navigation.push(SPRUNGBRETT_OFFER_ROUTE, params)
    } else if (path === WOHNEN_OFFER_ROUTE) {
      const params = { city, offers, offerHash: null }
      navigation.push(WOHNEN_OFFER_ROUTE, params)
    }
  }, [city, language, navigation])

  const navigateToFeedback = useCallback((isPositiveFeedback: boolean) => {
    if (offers && city) {
      createNavigateToFeedbackModal(navigation)({
        type: 'Offers',
        language,
        cityCode: city,
        offers,
        isPositiveFeedback
      })
    }
  }, [offers, language, city, navigation])

  if (error) {
    return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={loadOffers} refreshing={loading} />}>
        <FailureContainer errorMessage={error} tryAgain={loadOffers} />
      </LayoutedScrollView>
  }

  if (!offers || !city) {
    return timeoutExpired
      ? <LayoutedScrollView refreshControl={<RefreshControl refreshing />} />
      : <LayoutContainer />
  }

  return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={loadOffers} refreshing={loading} />}>
      <Offers offers={offers} navigateToOffer={navigateToOffer} theme={theme} t={t}
              navigateToFeedback={navigateToFeedback} cityCode={city} language={language} />
    </LayoutedScrollView>
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withTranslation('offers')(
    withTheme(OffersContainer)
  )
)
