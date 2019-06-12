// @flow

import ExternalExtra from '../components/ExternalExtra'
import type { NavigationScreenProp } from 'react-navigation'
import React from 'react'

export default class ExternalExtraContainer extends React.Component<{| navigation: NavigationScreenProp<*> |}> {
  render () {
    const url = this.props.navigation.getParam('url')

    if (!url) {
      throw Error('url is not defined in navigation params!')
    }

    return <ExternalExtra url={url} postData={this.props.navigation.getParam('postData')} />
  }
}
