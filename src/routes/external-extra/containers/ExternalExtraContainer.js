// @flow

import { mapProps } from 'recompose'
import ExternalExtra from '../components/ExternalExtra'

export default mapProps(({navigation}) => ({
  url: navigation.getParam('url'),
  postData: navigation.getParam('postData')
}))(ExternalExtra)
