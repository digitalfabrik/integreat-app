// @flow

import { URL_PREFIX } from '../platform/constants/webview'
import type { FilesStateType } from '../app/StateType'

// language=JavaScript
const renderJS = (files: FilesStateType) => `
(function() {
  var hrefs = document.querySelectorAll('[href]')
  var srcs = document.querySelectorAll('[src]')
  var urls = ${JSON.stringify(files)}
  
  console.debug('Urls to inject:')
  console.debug(urls)
  
  for (var i = 0; i < hrefs.length; i++) {
    var item = hrefs[i]
    console.debug('Found href: ' + decodeURI(item.href))
    var newHref = urls[decodeURI(item.href)]
    if (newHref) {
      console.debug('Replaced ' + item.href + ' with ' + newHref)
      item.href = '${URL_PREFIX}' + newHref
    }
  }
  
  for (var i = 0; i < srcs.length; i++) {
    var item = srcs[i]
    console.debug('Found src: ' + decodeURI(item.src))
    var newSrc = urls[decodeURI(item.src)]
    if (newSrc) {
      console.debug('Replaced ' + item.src + ' with ' + newSrc)
      item.src = '${URL_PREFIX}' + newSrc
    }
  }
  
  document.body.style.display = 'block'
})();
(function waitForBridge() {
    if (window.postMessage.length !== 1){
      setTimeout(waitForBridge, 200);
    }
    else {
      window.ReactNativeWebView.postMessage(
        Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, 
        document.body.clientHeight, document.body.scrollHeight)
      )
    }
  })();
`

export default (html: string, files: FilesStateType) => {
  // language=HTML
  return `
<html>
<!-- disables zooming https://stackoverflow.com/questions/44625680/disable-zoom-on-web-view-react-native-->
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
<body style="display: none;">
${html}
<script>${renderJS(files)}</script>
</body>
</html>
`
}
