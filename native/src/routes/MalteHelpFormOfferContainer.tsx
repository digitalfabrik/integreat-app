import React, { ReactElement } from 'react'

import { MALTE_HELP_FORM_OFFER_ROUTE, ErrorCode, createOffersEndpoint, MalteHelpFormOfferRouteType } from 'api-client'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadExtraCityContent from '../hooks/useLoadExtraCityContent'
import urlFromRouteInformation from '../navigation/url'
import LoadingErrorHandler from './LoadingErrorHandler'
import MalteHelpFormOffer from './MalteHelpFormOffer'

type MalteHelpFormOfferProps = {
  route: RouteProps<MalteHelpFormOfferRouteType>
  navigation: NavigationProps<MalteHelpFormOfferRouteType>
}

const MalteHelpFormOfferContainer = ({ route, navigation }: MalteHelpFormOfferProps): ReactElement => {
  const { cityCode, languageCode } = useCityAppContext()
  const { data, ...response } = useLoadExtraCityContent({
    cityCode,
    languageCode,
    createEndpoint: createOffersEndpoint,
  })
  const malteHelpFormOffer = data?.extra.find(it => it.alias === MALTE_HELP_FORM_OFFER_ROUTE)
  const error =
    (data?.city && !data.city.offersEnabled) || !malteHelpFormOffer ? ErrorCode.PageNotFound : response.error

  const availableLanguages = data?.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({ route: MALTE_HELP_FORM_OFFER_ROUTE, languageCode, cityCode })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })

  return (
    <LoadingErrorHandler {...response} error={error}>
      <MalteHelpFormOffer route={route} navigation={navigation} />
    </LoadingErrorHandler>
  )
}

export default MalteHelpFormOfferContainer
