import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
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
  useLoadFromEndpoint,
} from 'api-client'

import Failure from '../components/Failure'
import LayoutedScrollView from '../components/LayoutedScrollView'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCities from '../hooks/useCities'
import useCityAppContext from '../hooks/useCityAppContext'
import useNavigate from '../hooks/useNavigate'
import useReportError from '../hooks/useReportError'
import useSetShareUrl from '../hooks/useSetShareUrl'
import useSnackbar from '../hooks/useSnackbar'
import TileModel from '../models/TileModel'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import { determineApiUrl } from '../utils/helpers'
import openExternalUrl from '../utils/openExternalUrl'
import Offers from './Offers'

type OffersContainerProps = {
  route: RouteProps<OffersRouteType>
  navigation: NavigationProps<OffersRouteType>
}

const OffersContainer = ({ navigation, route }: OffersContainerProps): ReactElement => {
  const showSnackbar = useSnackbar()
  const { cityCode, languageCode } = useCityAppContext()
  const { navigateTo } = useNavigate()
  const cities = useCities()
  const { t } = useTranslation('offers')

  const routeInformation = { route: OFFERS_ROUTE, languageCode, cityCode }
  useSetShareUrl({ navigation, routeInformation, route })

  const request = useCallback(async () => {
    const apiUrl = await determineApiUrl()
    return createOffersEndpoint(apiUrl).request({
      city: cityCode,
      language: languageCode,
    })
  }, [cityCode, languageCode])
  const { data: offers, error: offersError, loading, refresh } = useLoadFromEndpoint<Array<OfferModel>>(request)
  useReportError(offersError)

  const navigateToOffer = useCallback(
    (tile: TileModel) => {
      const { title, path, isExternalUrl, postData } = tile
      if (isExternalUrl && postData) {
        // HTTP POST is neither supported by the InAppBrowser nor by Linking, therefore we have to open it in a webview
        navigation.push(EXTERNAL_OFFER_ROUTE, {
          url: path,
          shareUrl: path,
          postData,
        })
      } else if (isExternalUrl) {
        openExternalUrl(path).catch((error: Error) => showSnackbar(error.message))
      } else if (offers?.find(offer => offer.title === title)?.alias === SPRUNGBRETT_OFFER_ROUTE) {
        navigateTo({ route: SPRUNGBRETT_OFFER_ROUTE, cityCode, languageCode })
      }
    },
    [showSnackbar, offers, cityCode, languageCode, navigation, navigateTo]
  )
  const navigateToFeedback = useCallback(
    (isPositiveFeedback: boolean) => {
      createNavigateToFeedbackModal(navigation)({
        routeType: OFFERS_ROUTE,
        language: languageCode,
        cityCode,
        isPositiveFeedback,
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
        language: languageCode,
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
          t={t}
          navigateToFeedback={navigateToFeedback}
          languageCode={languageCode}
          cityCode={cityCode}
        />
      )}
    </LayoutedScrollView>
  )
}

export default OffersContainer
