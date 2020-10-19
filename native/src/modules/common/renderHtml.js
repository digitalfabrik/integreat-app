// @flow

import { getFontFaceSource } from '../platform/constants/webview'
import type { PageResourceCacheEntryStateType, PageResourceCacheStateType } from '../app/StateType'
import type { ThemeType } from '../theme/constants'
import { RTL_LANGUAGES } from '../i18n/constants'
import webviewFontFamilies from '../theme/webviewFontFamilies'
import { RESOURCE_CACHE_DIR_PATH } from '../endpoint/DatabaseConnector'
import { mapValues } from 'lodash'

// language=JavaScript
const renderJS = (cacheDictionary: { [remoteUrl: string]: string }) => `
// Catching occurring errors
(function() {
  function reportError (message) {
    if (!window.ReactNativeWebView) {
      return window.setTimeout(function() { reportError(message) }, 100)
    }

    window.ReactNativeWebView.postMessage(JSON.stringify({ type: "error", message: message }))
  };
  
  window.onerror = function(msg, url, lineNo, columnNo, error) {
    // from https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
    var string = msg.toLowerCase()
    var substring = "script error"
    if (string.indexOf(substring) > -1){
      reportError('Script Error: See Browser Console for Detail: '  + msg + JSON.stringify(error))
    } else {
      var message = [
        'Message: ' + msg,
        'URL: ' + url,
        'Line: ' + lineNo,
        'Column: ' + columnNo,
        'Error object: ' + JSON.stringify(error)
      ].join(' - ')
      reportError(message)
    }
    return false
  };
})();

(function() {
  var hrefs = document.querySelectorAll('[href]')
  var srcs = document.querySelectorAll('[src]')
  var cacheDictionary = ${JSON.stringify(cacheDictionary)}

  console.debug('Resources to inject:')
  console.debug(cacheDictionary)

  for (var i = 0; i < hrefs.length; i++) {
    var item = hrefs[i]
    console.debug('Found href: ' + decodeURI(item.href))
    var newResource = cacheDictionary[decodeURI(item.href)]
    if (newResource) {
      console.debug('Replaced ' + item.href + ' with ' + newResource)
      item.href = newResource
    }
  }

  for (var i = 0; i < srcs.length; i++) {
    var item = srcs[i]
    console.debug('Found src: ' + decodeURI(item.src))
    var newResource = cacheDictionary[decodeURI(item.src)]
    if (newResource) {
      console.debug('Replaced ' + item.src + ' with ' + newResource)
      item.src = newResource
    }
  }
})();

(function() {
  var container = document.getElementById('measure-container')
  function adjustHeight() {
    container.setAttribute('style', 'padding: 1px 0;'); // Used for measuring collapsed vertical margins
    
    if (!window.ReactNativeWebView){
      return window.setTimeout(adjustHeight, 100);
    }
    
    var height = container.getBoundingClientRect().height - 2
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', height: height }));
    container.setAttribute('style', '');
  };
  
  window.addEventListener('load', adjustHeight);
  window.addEventListener('resize', adjustHeight);
})();
`

// language=HTML
const renderHtml = (html: string, files: PageResourceCacheStateType, theme: ThemeType, language: string, resourceCacheUrl: string) => {
  const cacheDictionary = mapValues(files, (file: PageResourceCacheEntryStateType) => {
    return file.filePath.startsWith(RESOURCE_CACHE_DIR_PATH)
      ? file.filePath.replace(RESOURCE_CACHE_DIR_PATH, resourceCacheUrl)
      : file.filePath
  })
  return `
<!-- The lang attribute makes TalkBack use the appropriate language. -->
<html lang="${language}">
<head>
  <!-- disables zooming https://stackoverflow.com/questions/44625680/disable-zoom-on-web-view-react-native -->
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
  <style>
    @font-face {
      font-family: 'OpenSans';
      font-style: normal;
      font-weight: 400;
      src: ${getFontFaceSource('OpenSans-Regular')};
    }
    @font-face {
      font-family: 'OpenSans';
      font-style: normal;
      font-weight: 700;
      src: ${getFontFaceSource('OpenSans-Bold')};
    }
    @font-face {
      font-family: 'Raleway';
      font-style: normal;
      font-weight: 400;
      src: ${getFontFaceSource('Raleway-Regular')};
    }
    @font-face {
      font-family: 'Raleway';
      font-style: normal;
      font-weight: 700;
      src: ${getFontFaceSource('Raleway-Bold')};
    }
    @font-face {
      font-family: 'Lateef';
      font-style: normal;
      font-weight: 400;
      src: ${getFontFaceSource('Lateef')};
    }

    html, body {
        margin: 0;
        padding: 0;

        font-family: ${(webviewFontFamilies(theme, language))};
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

    pre {
      overflow-x: auto;
    }
  </style>
</head>
<body dir="${RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr'}">
  <div id="measure-container">${html}</div>
  <script>${renderJS(cacheDictionary)}</script>
</body>
</html>
`
}

export default renderHtml
