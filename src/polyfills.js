import 'babel-polyfill'

import 'whatwg-fetch'

import 'url-search-params-polyfill'

import {TextDecoder, TextEncoder} from 'text-encoding'

if (!window.TextDecoder) {
  window.TextDecoder = TextDecoder
}

if (!window.TextDecoder) {
  window.TextEncoder = TextEncoder
}
