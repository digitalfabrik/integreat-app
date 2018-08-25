import { AppRegistry } from 'react-native'
import App from './src/modules/app/components/App'

// @see: https://github.com/facebook/react-native/issues/9599
if (typeof global.self === 'undefined') {
  global.self = global
}

AppRegistry.registerComponent('Integreat', () => App)
