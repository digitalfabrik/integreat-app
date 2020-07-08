// @flow

import ExternalOffer from '../components/ExternalOffer'
import type { NavigationScreenProp } from 'react-navigation'
import React from 'react'

export default class ExternalOfferContainer extends React.Component<{| navigation: NavigationScreenProp<*> |}> {
  render () {
    const url = this.props.navigation.getParam('url')

    if (!url) {
      throw Error('url is not defined in navigation params!')
    }

    return <ExternalOffer url={url} postData={this.props.navigation.getParam('postData')} />
  }
}
