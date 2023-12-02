import { ThemeType } from 'build-configs'

import { ParsedCacheDictionaryType } from '../components/Page'
import { ERROR_MESSAGE_TYPE, getFontFaceSource, HEIGHT_MESSAGE_TYPE, WARNING_MESSAGE_TYPE } from '../constants/webview'

// To use parameters or external constants in renderJS, you need to use string interpolation, e.g.
// const cacheDictionary = ${JSON.stringify(cacheDictionary)}
// language=JavaScript
const renderJS = (cacheDictionary: ParsedCacheDictionaryType, allowedIframeSources: string[]) => `
  function reportError (message, type) {
    if (!window.ReactNativeWebView) {
      return window.setTimeout(function() { reportError(message, type) }, 100)
    }

    window.ReactNativeWebView.postMessage(JSON.stringify({ type, message: message }))
  }

  // Catching occurring errors
  (function  catchErrors() {
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      const string = msg.toLowerCase()
      const substring = "script error"
      if (string.indexOf(substring) > -1) {
        reportError('Script Error: See Browser Console for Detail: ' + msg + JSON.stringify(error),
          '${ERROR_MESSAGE_TYPE}')
      } else {
        const message = [
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

  (function replaceResourcesWithCached() {
    const hrefs = document.querySelectorAll('[href]')
    const srcs = document.querySelectorAll('[src]')
    const cacheDictionary = ${JSON.stringify(cacheDictionary)}

    for (let i = 0; i < hrefs.length; i++) {
      const item = hrefs[i]
      try {
        const newResource = cacheDictionary[decodeURI(item.href)]
        if (newResource) {
          item.href = newResource
        }
      } catch (e) {
        reportError(e.message + 'occurred while decoding and looking for ' + item.href + ' in the dictionary',
          '${WARNING_MESSAGE_TYPE}')
      }
    }

    for (let i = 0; i < srcs.length; i++) {
      const item = srcs[i]
      try {
        const newResource = cacheDictionary[decodeURI(item.src)]
        if (newResource) {
          item.src = newResource
        }
      } catch (e) {
        reportError(e.message + 'occurred while decoding and looking for ' + item.src + ' in the dictionary',
          '${WARNING_MESSAGE_TYPE}')
      }
    }
  })();

  (function addWebviewHeightListeners() {
    const container = document.getElementById('measure-container')

    function adjustHeight () {
      container.setAttribute('style', 'padding: 1px 0;'); // Used for measuring collapsed vertical margins

      if (!window.ReactNativeWebView) {
        return window.setTimeout(adjustHeight, 100);
      }

      const height = container.getBoundingClientRect().height - 2
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: '${HEIGHT_MESSAGE_TYPE}', height: height }));
      container.setAttribute('style', '');
    }

    window.addEventListener('load', adjustHeight);
    window.addEventListener('resize', adjustHeight);
    const details = document.querySelectorAll("details")
    details.forEach(detail => detail.addEventListener("toggle", adjustHeight))
  })();

  (function handleIframes() {
    const iframes = document.querySelectorAll('iframe')
    const allowedIframeSources = ${JSON.stringify(allowedIframeSources)}

    iframes.forEach((el) => {
      if (allowedIframeSources.some(url => el.src.indexOf(url) > 0)) {
        const url = new URL(el.src)
        // Add do not track parameter
        url.searchParams.append('dnt', '1')
        el.setAttribute('src', url.href)
      } else {
        el.parentNode.removeChild(el)
      }
    })
  })();
`

// To use parameters or external constants in renderHTML, you need to use string interpolation, e.g.
// <html lang='${language}'>
// language=HTML
const renderHtml = (
  html: string,
  cacheDictionary: ParsedCacheDictionaryType,
  allowedIframeSources: string[],
  theme: ThemeType,
  language: string,
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

      details > * {
        padding: 0 25px;
      }

      details > summary {
        padding: 0;
      }

      pre {
        overflow-x: auto;
      }

      .link-external {
        display: inline-flex;
        align-items: center;
      }

      .link-external::after {
        /* ExternalIcon, WebView can't handle imported svg as background */
        content: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18' style='-webkit-print-color-adjust:exact'><path d='M16 15.9996l-14 0l0 -14l7 0l0 -2l-7 0a2 2 0 0 0 -2 2l0 14a2 2 0 0 0 2 2l14 0c1.1 0 2 -0.9 2 -2l0 -7l-2 0l0 7zm-5 -16l0 2l3.59 0l-9.83 9.83 1.41 1.41 9.83 -9.83l0 3.59l2 0l0 -7l-7 0z' fill='rgb(11, 87, 208)'/></svg>");
        display: inline-block;
        width: ${theme.fonts.contentFontSize};
        height: ${theme.fonts.contentFontSize};
        margin-left : 4px;
      }

      iframe {
        border: none;
        width: 100%;
      }
    </style>
  </head>
  <body dir='auto'>
  <div id='measure-container'>${html}</div>
  <script>${renderJS(cacheDictionary, allowedIframeSources)}</script>
  </body>
  </html>
`

export default renderHtml
