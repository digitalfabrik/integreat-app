import React, { ReactElement } from 'react'

import { EXTERNAL_OFFER_ROUTE, OFFERS_ROUTE, OffersRouteType, SPRUNGBRETT_OFFER_ROUTE, TileModel } from 'shared'
import { createOffersEndpoint, ErrorCode } from 'shared/api'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadExtraCityContent from '../hooks/useLoadExtraCityContent'
import useNavigate from '../hooks/useNavigate'
import useSnackbar from '../hooks/useSnackbar'
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
  const { data, ...response } = useLoadExtraCityContent({
    cityCode,
    languageCode,
    createEndpoint: createOffersEndpoint,
  })
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
        postData,
      })
    } else if (isExternalUrl) {
      openExternalUrl(path, showSnackbar)
    } else if (data?.extra.find(offer => offer.title === title)?.alias === SPRUNGBRETT_OFFER_ROUTE) {
      navigateTo({ route: SPRUNGBRETT_OFFER_ROUTE, cityCode, languageCode })
    }
  }

  return (
    <LoadingErrorHandler {...response} error={error} scrollView>
      {data?.city.offersEnabled ? (
        <Offers offers={data.extra} navigateToOffer={navigateToOffer} languageCode={languageCode} />
      ) : null}
    </LoadingErrorHandler>
  )
}

export default OffersContainer
