// @flow

import App from '../components/Layout'
import withPlatform from '../../platform/hocs/withPlatform'
import { mapProps } from 'recompose'

const propsMapper = props => ({
  ...props,
  statusBarHeight: props.platform.statusBarHeight
})

export default withPlatform(mapProps(propsMapper)(App))
