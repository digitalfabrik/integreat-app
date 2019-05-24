// @flow

import { mapProps } from 'recompose'
import ExternalExtra from '../components/ExternalExtra'
import type { NavigationScreenProp } from 'react-navigation'
import type { PropsType } from '../components/ExternalExtra'

export default mapProps<PropsType, {navigation: NavigationScreenProp<*>}>(
  ({navigation}) => ({
    url: navigation.getParam('url'),
    postData: navigation.getParam('postData')
  }))(ExternalExtra)
