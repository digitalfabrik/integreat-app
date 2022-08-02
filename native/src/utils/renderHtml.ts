import { ThemeType } from 'build-configs'

import { ParsedCacheDictionaryType } from '../components/Page'
import { ERROR_MESSAGE_TYPE, getFontFaceSource, HEIGHT_MESSAGE_TYPE, WARNING_MESSAGE_TYPE } from '../constants/webview'

// language=JavaScript
const renderJS = (cacheDictionary: Record<string, string>) => `
  function reportError (message, type) {
    if (!window.ReactNativeWebView) {
      return window.setTimeout(function() { reportError(message, type) }, 100)
    }

    window.ReactNativeWebView.postMessage(JSON.stringify({ type, message: message }))
  }

  // Catching occurring errors
  (function() {
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      // from https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
      var string = msg.toLowerCase()
      var substring = "script error"
      if (string.indexOf(substring) > -1) {
        reportError('Script Error: See Browser Console for Detail: ' + msg + JSON.stringify(error),
          '${ERROR_MESSAGE_TYPE}')
      } else {
        var message = [
          'Message: ' + msg,
          'URL: ' + url,
          'Line: ' + lineNo,
          'Column: ' + columnNo,
          'Error object: ' + JSON.stringify(error)
        ].join(' - ')
        reportError(message, '${ERROR_MESSAGE_TYPE}')
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
      try {
        var newResource = cacheDictionary[decodeURI(item.href)]
        if (newResource) {
          item.href = newResource
        }
      } catch (e) {
        reportError(e.message + 'occurred while decoding and looking for ' + item.href + ' in the dictionary',
          '${WARNING_MESSAGE_TYPE}')
      }
    }

    for (var i = 0; i < srcs.length; i++) {
      var item = srcs[i]
      try {
        var newResource = cacheDictionary[decodeURI(item.src)]
        if (newResource) {
          item.src = newResource
        }
      } catch (e) {
        reportError(e.message + 'occurred while decoding and looking for ' + item.src + ' in the dictionary',
          '${WARNING_MESSAGE_TYPE}')
      }
    }
  })();

  (function() {
    var container = document.getElementById('measure-container')

    function adjustHeight () {
      container.setAttribute('style', 'padding: 1px 0;'); // Used for measuring collapsed vertical margins

      if (!window.ReactNativeWebView) {
        return window.setTimeout(adjustHeight, 100);
      }

      var height = container.getBoundingClientRect().height - 2
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: '${HEIGHT_MESSAGE_TYPE}', height: height }));
      container.setAttribute('style', '');
    }

    window.addEventListener('load', adjustHeight);
    window.addEventListener('resize', adjustHeight);
    var details = document.querySelectorAll("details")
    details.forEach(detail => detail.addEventListener("toggle", adjustHeight))
  })();
`

// language=HTML
const renderHtml = (
  html: string,
  cacheDictionary: ParsedCacheDictionaryType,
  theme: ThemeType,
  language: string
): string => `
  <!-- The lang attribute makes TalkBack use the appropriate language. -->
  <html lang='${language}'>
  <head>
    <!-- disables zooming https://stackoverflow.com/questions/44625680/disable-zoom-on-web-view-react-native -->
    <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0'>
    <style>
      @font-face {
        font-family: 'Noto Sans';
        font-style: normal;
        font-weight: 400;
        src: ${getFontFaceSource('NotoSans')};
      }

      @font-face {
        font-family: 'Noto Sans';
        font-style: normal;
        font-weight: 700;
        src: ${getFontFaceSource('NotoSans-Bold')};
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
        font-family: 'Noto Sans Arabic';
        font-style: normal;
        font-weight: 400;
        src: ${getFontFaceSource('NotoSansArabic-Regular')};
      }

      @font-face {
        font-family: 'Noto Sans Arabic';
        font-style: normal;
        font-weight: 700;
        src: ${getFontFaceSource('NotoSansArabic-Bold')};
      }

      html {
        font: -apple-system-body;
      }

      html, body {
        margin: 0;
        padding: 0;

        font-family: ${theme.fonts.native.webviewFont};
        line-height: ${theme.fonts.contentLineHeight};
        font-size-adjust: ${theme.fonts.fontSizeAdjust};
        background-color: ${theme.colors.backgroundColor};
        /*\${props => props.centered && css\`
        text-align: center;
        list-style-position: inside;
        \`} */
      }

      body {
        font-size: ${theme.fonts.contentFontSize};
      }

      h1, h2, h3, h4, h5, h6 {
        overflow-wrap: break-word;
      }

      p {
        margin: ${theme.fonts.standardParagraphMargin} 0;
        overflow: auto;
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
  <body dir='auto'>
  <div id='measure-container'>${html}</div>
  <script>${renderJS(cacheDictionary)}</script>
  </body>
  </html>
`

export default renderHtml
