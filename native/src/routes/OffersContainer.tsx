import React, { useCallback } from 'react'
import { TFunction, withTranslation } from 'react-i18next'
import { RefreshControl } from 'react-native'

import {
  createOffersEndpoint,
  EXTERNAL_OFFER_ROUTE,
  fromError,
  NotFoundError,
  OfferModel,
  OFFERS_ROUTE,
  OffersRouteType,
  SPRUNGBRETT_OFFER_ROUTE,
  useLoadFromEndpoint
} from 'api-client'
import { ThemeType } from 'build-configs'

import Failure from '../components/Failure'
import LayoutedScrollView from '../components/LayoutedScrollView'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withTheme from '../hocs/withTheme'
import useCities from '../hooks/useCities'
import useReportError from '../hooks/useReportError'
import useSnackbar from '../hooks/useSnackbar'
import TileModel from '../models/TileModel'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import { determineApiUrl } from '../utils/helpers'
import openExternalUrl from '../utils/openExternalUrl'
import Offers from './Offers'

type OwnPropsType = {
  route: RoutePropType<OffersRouteType>
  navigation: NavigationPropType<OffersRouteType>
}
type OffersPropsType = OwnPropsType & {
  theme: ThemeType
  t: TFunction
}

const OffersContainer = ({ theme, t, navigation, route }: OffersPropsType) => {
  const showSnackbar = useSnackbar()
  const { cityCode, languageCode } = route.params
  const cities = useCities()
  const request = useCallback(async () => {
    const apiUrl = await determineApiUrl()
    return createOffersEndpoint(apiUrl).request({
      city: cityCode,
      language: languageCode
    })
  }, [cityCode, languageCode])
  const { data: offers, error: offersError, loading, refresh } = useLoadFromEndpoint<Array<OfferModel>>(request)
  useReportError(offersError)

  const navigateToOffer = useCallback(
    (tile: TileModel) => {
      const { title, path, isExternalUrl, postData } = tile
      const offer = offers && offers.find(offer => offer.title === title)

      if (!offer) {
        return
      }

      if (isExternalUrl && postData) {
        // HTTP POST is neither supported by the InAppBrowser nor by Linking, therefore we have to open it in a webview
        navigation.push(EXTERNAL_OFFER_ROUTE, {
          url: path,
          shareUrl: path,
          postData
        })
      } else if (isExternalUrl) {
        openExternalUrl(path).catch((error: Error) => showSnackbar(error.message))
      } else if (offer.alias === SPRUNGBRETT_OFFER_ROUTE) {
        const params = {
          cityCode,
          languageCode
        }
        navigation.push(SPRUNGBRETT_OFFER_ROUTE, params)
      }
    },
    [showSnackbar, offers, cityCode, languageCode, navigation]
  )
  const navigateToFeedback = useCallback(
    (isPositiveFeedback: boolean) => {
      createNavigateToFeedbackModal(navigation)({
        routeType: OFFERS_ROUTE,
        language: languageCode,
        cityCode,
        isPositiveFeedback
      })
    },
    [languageCode, cityCode, navigation]
  )
  const cityModel = cities && cities.find(city => city.code === cityCode)

  if (offersError || (cityModel && !cityModel.offersEnabled)) {
    const error =
      offersError ||
      new NotFoundError({
        type: 'category',
        id: 'offers',
        city: cityCode,
        language: languageCode
      })
    return (
      <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={loading} />}>
        <Failure code={fromError(error)} tryAgain={refresh} />
      </LayoutedScrollView>
    )
  }

  return (
    <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={loading} />}>
      {offers && (
        <Offers
          offers={offers}
          navigateToOffer={navigateToOffer}
          theme={theme}
          t={t}
          navigateToFeedback={navigateToFeedback}
          language={languageCode}
        />
      )}
    </LayoutedScrollView>
  )
}

export default withTranslation('offers')(withTheme<OffersPropsType>(OffersContainer))
