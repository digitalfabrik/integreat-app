import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { RefreshControl } from 'react-native'
import Offers from '../components/Offers'
import { TFunction, withTranslation } from 'react-i18next'
import {
  CityModel,
  createOffersEndpoint,
  NotFoundError,
  OfferModel,
  OFFERS_ROUTE,
  useLoadFromEndpoint
} from 'api-client'
import { ThemeType } from 'build-configs/ThemeType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import { OffersRouteType, EXTERNAL_OFFER_ROUTE, SPRUNGBRETT_OFFER_ROUTE } from 'api-client/src/routes'
import LayoutedScrollView from '../../../modules/common/containers/LayoutedScrollView'
import openExternalUrl from '../../../modules/common/openExternalUrl'
import createNavigateToFeedbackModal from '../../../modules/navigation/createNavigateToFeedbackModal'
import { fromError } from '../../../modules/error/ErrorCodes'
import TileModel from '../../../modules/common/models/TileModel'
import { StateType } from '../../../modules/app/StateType'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'

type OwnPropsType = {
  route: RoutePropType<OffersRouteType>
  navigation: NavigationPropType<OffersRouteType>
}
type OffersPropsType = OwnPropsType & {
  theme: ThemeType
  t: TFunction
}

const OffersContainer = ({ theme, t, navigation, route }: OffersPropsType) => {
  const { cityCode, languageCode } = route.params
  const cities = useSelector<StateType, Readonly<Array<CityModel>> | null>((state: StateType) =>
    state.cities.status === 'ready' ? state.cities.models : null
  )
  const request = useCallback(async () => {
    const apiUrl = await determineApiUrl()
    return await createOffersEndpoint(apiUrl).request({
      city: cityCode,
      language: languageCode
    })
  }, [cityCode, languageCode])
  const { data: offers, error: offersError, loading, refresh } = useLoadFromEndpoint<Array<OfferModel>>(request)
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
        openExternalUrl(path)
      } else {
        if (offer.alias === SPRUNGBRETT_OFFER_ROUTE) {
          const params = {
            cityCode,
            languageCode
          }
          navigation.push(SPRUNGBRETT_OFFER_ROUTE, params)
        }
      }
    },
    [offers, cityCode, languageCode, navigation]
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
        <FailureContainer code={fromError(error)} tryAgain={refresh} />
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
