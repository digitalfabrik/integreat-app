// @flow

import ExternalOffer from '../components/ExternalOffer'
import React from 'react'
import type {
  ExternalOfferRouteType,
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/constants/NavigationTypes'

type PropsType = {|
  route: RoutePropType<ExternalOfferRouteType>,
  navigation: NavigationPropType<ExternalOfferRouteType>
|}

export default class ExternalOfferContainer extends React.Component<PropsType> {
  render () {
    const { url, postData } = this.props.route.params

    return <ExternalOffer url={url} postData={postData} />
  }
}
