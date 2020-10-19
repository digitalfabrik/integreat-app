// @flow

import ExternalOffer from '../components/ExternalOffer'
import type { NavigationStackProp } from 'react-navigation-stack'
import React from 'react'

export default class ExternalOfferContainer extends React.Component<{| navigation: NavigationStackProp<*> |}> {
  render () {
    const url = this.props.navigation.getParam('url')

    if (!url) {
      throw Error('url is not defined in navigation params!')
    }

    return <ExternalOffer url={url} postData={this.props.navigation.getParam('postData')} />
  }
}
