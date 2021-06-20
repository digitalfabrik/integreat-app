import ExternalOffer from './ExternalOffer'
import React, { ReactNode } from 'react'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import { ExternalOfferRouteType } from 'api-client'

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
