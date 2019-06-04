// @flow

import { mapProps } from 'recompose'
import ExternalExtra from '../components/ExternalExtra'
import type { NavigationScreenProp } from 'react-navigation'
import type { PropsType } from '../components/ExternalExtra'

export default mapProps<PropsType, {| navigation: NavigationScreenProp<*> |}>(
  ({navigation}) => {
    const url = navigation.getParam('url')

    if (!url) {
      throw Error('url is not defined in navigation params!')
    }

    return ({
      url,
      postData: navigation.getParam('postData')
    })
  })(ExternalExtra)
