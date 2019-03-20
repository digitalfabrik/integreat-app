// @flow

import { URL_PREFIX } from '../platform/constants/webview'
import type { ResourceCacheType } from '../endpoint/ResourceCacheType'
import type { ThemeType } from '../theme/constants/theme'

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
})();

(function() {
  var container = document.getElementById('measure-container')
  function adjustHeight() {
    container.setAttribute('style', 'padding: 1px 0;'); // Used for measuring collapsed vertical margins
    
    if (!window.ReactNativeWebView){
      throw Error('You have to set onMessage on the WebView!')
    }

    window.ReactNativeWebView.postMessage(container.getBoundingClientRect().height - 2);
    container.setAttribute('style', '');
  }
  
  window.addEventListener('load', adjustHeight);
  window.addEventListener('resize', adjustHeight);
})();
`

export default (html: string, resourceCache: ResourceCacheType, theme: ThemeType) => {
  // language=HTML
  return `
<html>
<head>
  <!-- disables zooming https://stackoverflow.com/questions/44625680/disable-zoom-on-web-view-react-native-->
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
  <style>
    html, body {
        margin: 0;
        padding: 0;
        
        /*font-family: \${theme.fonts.contentFontFamily};*/   
        font-size: ${theme.fonts.contentFontSize};
        line-height: ${theme.fonts.contentLineHeight};
        /*\${props => props.centered && css\`
        text-align: center;
        list-style-position: inside;
        \`} */
    }
    
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    table {
      display: block;
      width: 100% !important;
      height: auto !important; /* need important because of bad-formatted remote-content */
      overflow: auto;
    }

    tbody,
    thead {
      display: table; /* little bit hacky, but works in all browsers, even IE11 :O */
      width: 100%;
      box-sizing: border-box;
      border-collapse: collapse;
    }

    tbody,
    thead,
    th,
    td {
      border: 1px solid ${theme.colors.backgroundAccentColor};
    }

    a {
      overflow-wrap: break-word;
    }

    details > * {
      padding: 0 25px;
    }

    details > summary {
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="measure-container">${html}</div>
  <script>${renderJS(resourceCache)}</script>
</body>
</html>
`
}
