// @flow

import App from '../components/Layout'
import withPlatform from '../../platform/hocs/withPlatform'
import { mapProps } from 'recompose'
import { withTheme } from 'styled-components'

const propsMapper = props => ({
  ...props,
  statusBarHeight: props.platform.statusBarHeight
})

// $FlowFixMe
export default withPlatform(mapProps(propsMapper)(withTheme(App)))
