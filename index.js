// @flow

import * as React from 'react'
import { AppRegistry, YellowBox, Text } from 'react-native'
import App from './src/modules/app/components/App'
import 'moment/min/locales'

// @see: https://github.com/facebook/metro/issues/287
YellowBox.ignoreWarnings(['Require cycle:'])

AppRegistry.registerComponent('Integreat', () =>
  () => <App />
)

//AppRegistry.registerComponent('Integreat', () =>
//  () => <Text>Test</Text>
//)
