// @flow

import { URL_PREFIX } from '../platform/constants/webview'
import type { ResourceCacheType } from '../endpoint/ResourceCacheType'

// language=JavaScript
const renderJS = (resourceCache: ResourceCacheType) => `
(function() {
  var hrefs = document.querySelectorAll('[href]')
  var srcs = document.querySelectorAll('[src]')
  var urls = ${JSON.stringify(resourceCache)}
  
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
`

export default (html: string, resourceCache: ResourceCacheType) => {
  // language=HTML
  return `
<html>
<body style="display: none;">
${html}
<script>${renderJS(resourceCache)}</script>
</body>
</html>
`
}
