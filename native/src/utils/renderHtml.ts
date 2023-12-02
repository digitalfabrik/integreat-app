import { TFunction } from 'i18next'

import { ThemeType } from 'build-configs'

import { ParsedCacheDictionaryType } from '../components/Page'
import {
  ERROR_MESSAGE_TYPE,
  getFontFaceSource,
  HEIGHT_MESSAGE_TYPE,
  IFRAME_MESSAGE_TYPE,
  SETTINGS_MESSAGE_TYPE,
  WARNING_MESSAGE_TYPE,
} from '../constants/webview'
import { ExternalSourcePermission } from './AppSettings'

// To use parameters or external constants in renderJS, you need to use string interpolation, e.g.
// const cacheDictionary = ${JSON.stringify(cacheDictionary)}
// language=JavaScript
const renderJS = (
  cacheDictionary: ParsedCacheDictionaryType,
  whiteListedIframeSources: string[],
  externalSourcePermissions: ExternalSourcePermission[],
  t: TFunction,
) => `
  function reportError (message, type) {

    if (!window.ReactNativeWebView) {
      return window.setTimeout(function() { reportError(message, type) }, 100)
    }

    window.ReactNativeWebView.postMessage(JSON.stringify({ type, message: message }))
  }

  (function catchErrors () {
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      const string = msg.toLowerCase()
      const substring = 'script error'
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
    }
  })();

  (function replaceResourcesWithCached () {
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

  (function addWebviewHeightListeners () {
    const container = document.getElementById('measure-container')

    function adjustHeight () {
      container.setAttribute('style', 'padding: 1px 0;') // Used for measuring collapsed vertical margins

      if (!window.ReactNativeWebView) {
        return window.setTimeout(adjustHeight, 100)
      }

      const height = container.getBoundingClientRect().height - 2
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: '${HEIGHT_MESSAGE_TYPE}', height: height }))
      container.setAttribute('style', '')
    }

    window.addEventListener('load', adjustHeight)
    window.addEventListener('resize', adjustHeight)
    const details = document.querySelectorAll('details')
    details.forEach(detail => detail.addEventListener('toggle', adjustHeight))
  })();

  (function handleIframes () {
    function capitalizeFirstLetter (word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    }
    
    function showBlockMessage(text, element) {
      const textNode = document.createTextNode(text);
      element.parentNode.classList.add("blocked-content")
      element.parentNode.appendChild(textNode)
    }
    
    function showOptIn(text, iframe, source) {
      function onClickHandler() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: '${IFRAME_MESSAGE_TYPE}', allowedSource: {type: source, allowed: true} }))
      }
      const checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.name = "opt-in-checkbox";
      checkbox.id = "opt-in-checkbox";
      checkbox.onclick = onClickHandler;
      const label = document.createElement('label')
      label.htmlFor = "opt-in-checkbox";
      label.appendChild(document.createTextNode(text));
      iframe.parentNode.classList.add("blocked-content")
      iframe.parentNode.appendChild(label);
      iframe.parentNode.appendChild(checkbox);
    }

    function showBlockMessageWithSettings(text, iframe) {
      function onClickHandler() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: '${SETTINGS_MESSAGE_TYPE}', openSettings: true }))
      }
      showBlockMessage(text, iframe)
      const buttonLabel = ${JSON.stringify(t('layout:settings'))}
      const button = document.createElement('button');
      button.name = "opt-in-settings-button";
      button.innerHTML = buttonLabel;
      button.id = "opt-in-settings-button";
      button.onclick = onClickHandler;
      iframe.parentNode.appendChild(button);
    }

    function handleWhiteListedIframeSources (iframe, allowedExternalSourcePermissions, iframeSource) {
        // Add do not track parameter (only working for vimeo)
     if (externalSourcePermissions.some(source => source.type === iframeSource && source.allowed)) {
        const url = new URL(iframe.src)
        url.searchParams.append('dnt', '1')
        iframe.setAttribute('src', url.href)
      }
      else if (externalSourcePermissions.some(source => source.type === iframeSource && !source.allowed)) {
       const translation = ${JSON.stringify(t('remoteContent:knownResourceBlocked'))}
       const message= iframeSource + " "+ translation
       showBlockMessageWithSettings(message, iframe)
       iframe.remove()
     }
     // No permissions set for listed sources
      else {
       const translation = ${JSON.stringify(t('remoteContent:knownResourceOptIn'))}
       const message = translation + iframeSource
       showOptIn(message, iframe, iframeSource)
       iframe.remove()
      }
    }
    
    const iframes = document.querySelectorAll('iframe')
    const whiteListedIframeSources = ${JSON.stringify(whiteListedIframeSources)}
    const externalSourcePermissions = ${JSON.stringify(externalSourcePermissions)}
   
    iframes.forEach((iframe) => {
      const whiteListedIframeSource = whiteListedIframeSources.find(src => iframe.src.indexOf(src) > 0)
      if (whiteListedIframeSource) {
        handleWhiteListedIframeSources(iframe, externalSourcePermissions, capitalizeFirstLetter(whiteListedIframeSource) )

      } else {
        const translation = ${JSON.stringify(t('remoteContent:unknownResourceBlocked'))}
        const message = translation +"\\n"+iframe.src
        showBlockMessage(message, iframe);
        iframe.remove()
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
  whiteListedIframeSources: string[],
  theme: ThemeType,
  language: string,
  externalSourcePermissions: ExternalSourcePermission[],
  t: TFunction,
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
        margin-left: 4px;
      }

      iframe {
        border: none;
        width: calc(100vw);
        height: calc(60vw);
      }

      .blocked-content {
        background-color: ${theme.colors.themeColor};
        padding: 16px;
        display: flex;
        border-radius: 4px;
        overflow-wrap: anywhere;
        box-shadow: 0 2px 5px -3px rgb(0 0 0 /20%);
      }

      #opt-in-settings-button {
        border: none;
        background-color: transparent;
        font-size: ${theme.fonts.contentFontSize};
        margin-left: 8px;
        padding: 0;
        overflow-wrap: normal;
        color: ${theme.colors.tunewsThemeColor};
        
      }

      #opt-in-checkbox {
        display: flex;
        margin-left: 12px;
        align-self: center;
        /* Webview in android doesn't set correct size for checkboxes */
        heigth: 40px;
        width: 40px;
        
      @media not screen and (-webkit-min-device-pixel-ratio: 1) {
        height:  16px;
        width: 16px;
      }

      }
    </style>
  </head>
  <body dir='auto'>
  <div id='measure-container'>${html}</div>
  <script>${renderJS(cacheDictionary, whiteListedIframeSources, externalSourcePermissions, t)}</script>
  </body>
  </html>
`

export default renderHtml
