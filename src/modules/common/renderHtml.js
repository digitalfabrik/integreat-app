// @flow

import { URL_PREFIX } from '../platform/constants/webview'
import type { FileCacheStateType } from '../app/StateType'
import type { ThemeType } from '../theme/constants/theme'
import { Platform } from 'react-native'

// language=JavaScript
const renderJS = (files: FileCacheStateType) => `
(function() {
  var hrefs = document.querySelectorAll('[href]')
  var srcs = document.querySelectorAll('[src]')
  var files = ${JSON.stringify(files)}
  
  console.debug('Files to inject:') // TODO: remove
  console.debug(files)
  
  for (var i = 0; i < hrefs.length; i++) {
    var item = hrefs[i]
    console.debug('Found href: ' + decodeURI(item.href))
    var newResource = files[decodeURI(item.href)]
    if (newResource) {
      console.debug('Replaced ' + item.href + ' with ' + newResource.filePath)
      item.href = '${URL_PREFIX}' + newResource.filePath
    }
  }
  
  for (var i = 0; i < srcs.length; i++) {
    var item = srcs[i]
    console.debug('Found src: ' + decodeURI(item.src))
    var newResource = files[decodeURI(item.src)]
    if (newResource) {
      console.debug('Replaced ' + item.src + ' with ' + newResource.filePath)
      item.src = '${URL_PREFIX}' + newResource.filePath
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

export default (html: string, files: FileCacheStateType, theme: ThemeType) => {
  const getSource = (fontName: string) => Platform.select({
    ios: `local(${fontName}) format('truetype')`,
    android: `url('file:///android_asset/fonts/${fontName}.ttf') format('truetype')`
  })
  // language=HTML
  return `
<html>
<head>
  <!-- disables zooming https://stackoverflow.com/questions/44625680/disable-zoom-on-web-view-react-native-->
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
  <style>
    @font-face {
      font-family: 'OpenSans';
      font-style: normal;
      font-weight: 400;
      src: ${getSource('OpenSans-Regular')};
    }
    @font-face {
      font-family: 'OpenSans';
      font-style: normal;
      font-weight: 700;
      src: ${getSource('OpenSans-Bold')};
    }
    @font-face {
      font-family: 'Raleway';
      font-style: normal;
      font-weight: 400;
      src: ${getSource('Raleway-Regular')};
    }
    @font-face {
      font-family: 'Raleway';
      font-style: normal;
      font-weight: 700;
      src: ${getSource('Raleway-Bold')};
    }
    @font-face {
      font-family: 'Lateef';
      font-style: normal;
      font-weight: 400;
      src: ${getSource('Lateef')};
    }
   
    html, body {
        margin: 0;
        padding: 0;
        
        font-family: ${theme.fonts.webviewFontFamilies};
        font-size: ${theme.fonts.contentFontSize};
        line-height: ${theme.fonts.contentLineHeight};
        font-size-adjust: ${theme.fonts.fontSizeAdjust};
        background-color: ${theme.colors.backgroundColor};
        /*\${props => props.centered && css\`
        text-align: center;
        list-style-position: inside;
        \`} */
    }
    
    p {
      margin: ${theme.fonts.standardParagraphMargin} 0;
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
  <script>${renderJS(files)}</script>
</body>
</html>
`
}
