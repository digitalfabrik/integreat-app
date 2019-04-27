import { AppRegistry, YellowBox, NativeModules, NativeEventEmitter } from 'react-native'
import App from './src/modules/app/components/App'
import 'moment/locale/de'
import { RESOURCE_CACHE_DIR_PATH, URL_PREFIX } from './src/modules/platform/constants/webview' // fixme

// @see: https://github.com/facebook/react-native/issues/9599
if (typeof global.self === 'undefined') {
  global.self = global
}

// @see: https://github.com/facebook/metro/issues/287
YellowBox.ignoreWarnings(['Require cycle:'])

AppRegistry.registerComponent('Integreat', () => App)
const FetcherModuleEmitter = new NativeEventEmitter(NativeModules.FetcherModule)
// subscribe to event
FetcherModuleEmitter.addListener(
  'progress',
  res => console.warn('fetchAsync event', res)
)
NativeModules.FetcherModule.fetchAsync({[`${URL_PREFIX + RESOURCE_CACHE_DIR_PATH}/hello.png`]: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png'})
  .then(res => console.warn(JSON.stringify(res)))
  .catch(e => console.error(e.message, e.code))
