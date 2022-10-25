import React, { ReactElement } from 'react'

import { ExternalOfferRouteType } from 'api-client'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import ExternalOffer from './ExternalOffer'

type ExternalOfferContainerProps = {
  route: RouteProps<ExternalOfferRouteType>
  navigation: NavigationProps<ExternalOfferRouteType>
}

const ExternalOfferContainer = ({ route, navigation: _navigation }: ExternalOfferContainerProps): ReactElement => {
  const { url, postData } = route.params
  return <ExternalOffer url={url} postData={postData} />
}

export default ExternalOfferContainer
