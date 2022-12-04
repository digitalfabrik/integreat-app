import React, { ReactElement } from 'react'

import { ErrorCode, EXTERNAL_OFFER_ROUTE, OFFERS_ROUTE, OffersRouteType, SPRUNGBRETT_OFFER_ROUTE } from 'api-client'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadOffers from '../hooks/useLoadOffers'
import useNavigate from '../hooks/useNavigate'
import useSnackbar from '../hooks/useSnackbar'
import TileModel from '../models/TileModel'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import urlFromRouteInformation from '../navigation/url'
import openExternalUrl from '../utils/openExternalUrl'
import LoadingErrorHandler from './LoadingErrorHandler'
import Offers from './Offers'

type OffersContainerProps = {
  route: RouteProps<OffersRouteType>
  navigation: NavigationProps<OffersRouteType>
}

const OffersContainer = ({ navigation, route }: OffersContainerProps): ReactElement => {
  const showSnackbar = useSnackbar()
  const { cityCode, languageCode } = useCityAppContext()
  const { data, ...response } = useLoadOffers({ cityCode, languageCode })
  const error = data?.city && !data.city.offersEnabled ? ErrorCode.PageNotFound : response.error
  const { navigateTo } = useNavigate()

  const availableLanguages = data?.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({ route: OFFERS_ROUTE, languageCode, cityCode })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })

  const navigateToOffer = (tile: TileModel) => {
    const { title, path, isExternalUrl, postData } = tile
    if (isExternalUrl && postData) {
      // HTTP POST is neither supported by the InAppBrowser nor by Linking, therefore we have to open it in a webview
      navigation.push(EXTERNAL_OFFER_ROUTE, {
        url: path,
        shareUrl: path,
        postData,
      })
    } else if (isExternalUrl) {
      openExternalUrl(path).catch(error => showSnackbar({ text: error.message }))
    } else if (data?.offers.find(offer => offer.title === title)?.alias === SPRUNGBRETT_OFFER_ROUTE) {
      navigateTo({ route: SPRUNGBRETT_OFFER_ROUTE, cityCode, languageCode })
    }
  }

  const navigateToFeedback = (isPositiveFeedback: boolean) => {
    createNavigateToFeedbackModal(navigation)({
      routeType: OFFERS_ROUTE,
      language: languageCode,
      cityCode,
      isPositiveFeedback,
    })
  }

  return (
    <LoadingErrorHandler {...response} error={error} scrollView>
      {data?.city.offersEnabled && (
        <Offers
          offers={data.offers}
          navigateToOffer={navigateToOffer}
          navigateToFeedback={navigateToFeedback}
          languageCode={languageCode}
          cityCode={cityCode}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default OffersContainer
