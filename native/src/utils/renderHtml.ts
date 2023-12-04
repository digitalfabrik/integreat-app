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

  (function catchErrors() {
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

  (function handleIframes() {
    function capitalizeFirstLetter(word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    }

    function showMessage(text, element, className) {
      const textNode = document.createTextNode(text)
      if (className) {
        element.classList.add(className)
      }
      element.appendChild(textNode)
    }

    function showSettingsButton(element) {
      function onClickHandler () {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: '${SETTINGS_MESSAGE_TYPE}', openSettings: true }))
      }

      const buttonLabel = ${JSON.stringify(t('layout:settings'))}
      const button = document.createElement('button')
      button.name = 'opt-in-settings-button'
      button.innerHTML = buttonLabel
      button.id = 'opt-in-settings-button'
      button.onclick = onClickHandler
      element.appendChild(button)
    }

    function showMessageWithSettings(text, iframeContainer) {
      showMessage(text, iframeContainer, 'iframe-info-text')
      showSettingsButton(iframeContainer)

    }

    function showOptIn(text, iframeContainer, source) {
      function onClickHandler () {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: '${IFRAME_MESSAGE_TYPE}', allowedSource: { type: source, allowed: true } }))
      }

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.name = 'opt-in-checkbox'
      checkbox.id = 'opt-in-checkbox'
      checkbox.onclick = onClickHandler
      const label = document.createElement('label')
      label.htmlFor = 'opt-in-checkbox'
      label.appendChild(document.createTextNode(text))
      iframeContainer.appendChild(label)
      iframeContainer.appendChild(checkbox)
    }

    function showBlockMessageWithSettings(text, iframeContainer) {
      showMessage(text, iframeContainer)
      showSettingsButton(iframeContainer)
    }

    function handleWhiteListedIframeSources(iframe, allowedExternalSourcePermissions, iframeSource, iframeContainer) {
      if (externalSourcePermissions.some(source => source.type === iframeSource && source.allowed)) {
        // Add do not track parameter (only working for vimeo)
        if (iframeSource === 'Vimeo') {
          const url = new URL(iframe.src)
          url.searchParams.append('dnt', '1')
          iframe.setAttribute('src', url.href)
        }
        const message = ${JSON.stringify(
          t('remoteContent:knownResourceContentMessageOne'),
        )} + iframeSource + '. ' + ${JSON.stringify(t('remoteContent:knownResourceContentMessageTwo'))}
          showMessageWithSettings(message, iframeContainer)
      } else if (externalSourcePermissions.some(source => source.type === iframeSource && !source.allowed)) {
          const translation = ${JSON.stringify(t('remoteContent:knownResourceBlocked'))}
          const message = iframeSource + ' ' + translation
          showBlockMessageWithSettings(message, iframeContainer)
          iframe.remove()
      }
      // No permissions set for listed sources
      else {
        const translation = ${JSON.stringify(t('remoteContent:knownResourceOptIn'))}
        const message = translation + iframeSource
        showOptIn(message, iframeContainer, iframeSource)
        iframe.remove()
      }
    }

    const iframes = document.querySelectorAll('iframe')
    const whiteListedIframeSources = ${JSON.stringify(whiteListedIframeSources)}
    const externalSourcePermissions = ${JSON.stringify(externalSourcePermissions)}

    iframes.forEach((iframe) => {
      const iframeContainer = document.createElement('div')
      iframeContainer.classList.add('iframe-container')
      iframe.parentNode.appendChild(iframeContainer)
      const whiteListedIframeSource = whiteListedIframeSources.find(src => iframe.src.indexOf(src) > 0)
      if (whiteListedIframeSource) {
        handleWhiteListedIframeSources(iframe,
          externalSourcePermissions,
          capitalizeFirstLetter(whiteListedIframeSource),
          iframeContainer)
      } else {
        const translation = ${JSON.stringify(t('remoteContent:unknownResourceBlocked'))}
        const message = translation + '\\n' + iframe.src
        showMessage(message, iframeContainer)
        iframe.remove()
      }
    })
  })()
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
        background-color: ${theme.colors.backgroundAccentColor};
      }

      .iframe-container {
        padding: 12px;
        background-color: ${theme.colors.themeColor};
        display: flex;
        border-bottom-radius: 4px;
        overflow-wrap: anywhere;
        font-size: ${theme.fonts.hintFontSize};
      }

      .iframe-info-text {
        font-size: ${theme.fonts.decorativeFontSizeSmall};
        background-color: ${theme.colors.backgroundAccentColor};
      }

      .iframe-info-text > #opt-in-settings-button {
        font-size: ${theme.fonts.decorativeFontSizeSmall};
      }

      #opt-in-settings-button {
        border: none;
        background-color: transparent;
        margin-left: 8px;
        padding: 0;
        overflow-wrap: normal;
        color: ${theme.colors.tunewsThemeColor};
        font-size: ${theme.fonts.hintFontSize};
      }

      #opt-in-checkbox {
        display: flex;
        margin-left: 12px;
        align-self: center;
        /* Webview in android doesn't set correct size for checkboxes */
        heigth: 40px;
        width: 40px;

      @media not screen and (-webkit-min-device-pixel-ratio: 1) {
        height: 16px;
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
