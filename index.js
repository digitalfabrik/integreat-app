import { AppRegistry, YellowBox } from 'react-native'
import App from './src/modules/app/components/App'
import 'moment/locale/de' // fixme

// @see: https://github.com/facebook/react-native/issues/9599
if (typeof global.self === 'undefined') {
  global.self = global
}

// @see: https://github.com/facebook/metro/issues/287
YellowBox.ignoreWarnings(['Require cycle:'])

AppRegistry.registerComponent('Integreat', () => App)
