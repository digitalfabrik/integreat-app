import React, { ReactNode } from 'react'

import { ExternalOfferRouteType } from 'api-client'

import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import ExternalOffer from './ExternalOffer'

type PropsType = {
  route: RoutePropType<ExternalOfferRouteType>
  navigation: NavigationPropType<ExternalOfferRouteType>
}
export default class ExternalOfferContainer extends React.Component<PropsType> {
  render(): ReactNode {
    const { url, postData } = this.props.route.params
    return <ExternalOffer url={url} postData={postData} />
  }
}
