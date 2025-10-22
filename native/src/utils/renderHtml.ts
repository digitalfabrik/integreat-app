import { TFunction } from 'i18next'
import { DefaultTheme } from 'styled-components/native'

import { ExternalSourcePermissions } from 'shared'

import { ParsedCacheDictionaryType } from '../components/Page'
import {
  ALLOW_EXTERNAL_SOURCE_MESSAGE_TYPE,
  ERROR_MESSAGE_TYPE,
  getFontFaceSource,
  HEIGHT_MESSAGE_TYPE,
  OPEN_SETTINGS_MESSAGE_TYPE,
  WARNING_MESSAGE_TYPE,
} from '../constants/webview'

// To use parameters or external constants in renderJS, you need to use string interpolation, e.g.
// const cacheDictionary = ${JSON.stringify(cacheDictionary)}
// language=JavaScript
const renderJS = (
  cacheDictionary: ParsedCacheDictionaryType,
  supportedIframeSources: string[],
  externalSourcePermissions: ExternalSourcePermissions,
  t: TFunction,
  theme: DefaultTheme,
  deviceWidth: number,
  pageContainerPadding: number,
) => `
  function reportError(message, type) {
    if (!window.ReactNativeWebView) {
      return window.setTimeout(function () {
        reportError(message, type)
      }, 100)
    }

    window.ReactNativeWebView.postMessage(JSON.stringify({ type, message: message }))
  }

  (function catchErrors() {
    window.onerror = function (msg, url, lineNo, columnNo, error) {
      const string = msg.toLowerCase()
      const substring = 'script error'
      if (string.indexOf(substring) > -1) {
        reportError(
          'Script Error: See Browser Console for Detail: ' + msg + JSON.stringify(error),
          '${ERROR_MESSAGE_TYPE}',
        )
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
        reportError(
          e.message + 'occurred while decoding and looking for ' + item.href + ' in the dictionary',
          '${WARNING_MESSAGE_TYPE}',
        )
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
        reportError(
          e.message + 'occurred while decoding and looking for ' + item.src + ' in the dictionary',
          '${WARNING_MESSAGE_TYPE}',
        )
      }
    }
  })();

  (function adjustForContrastTheme() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      if (element instanceof HTMLElement && element.style.color === 'rgb(0, 0, 0)') {
        element.style.removeProperty('color');
      }
      
      if (element instanceof HTMLImageElement && element.src.endsWith('.svg')) {
        if (${theme.isContrastTheme}) {
          element.style.setProperty('filter', 'invert(1)')
        } else {
          element.style.removeProperty('filter')
        }
      }
    });
  })();


  (function addWebviewHeightListeners() {
    const container = document.getElementById('measure-container')

    function adjustHeight() {
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

    function getContainer (element, className)  {
      const container = document.createElement('div')
      container.id = className
      container.classList.add(className)
      element.appendChild(container)
      return container
    }
    
    function showMessage(text, element, iframeSource) {
      const textNode = document.createTextNode(text)
      if (iframeSource) {
        showSource(element, iframeSource)
      }
      element.appendChild(textNode)
    }

    function showSource(element, source) {
      const span = document.createElement('span')
      span.classList.add('iframe-source')
      element.appendChild(span)
      span.appendChild(document.createTextNode(source))
      element.appendChild(document.createElement('br'))
    }

    function showSettingsButton(element) {
      function onClickHandler() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: '${OPEN_SETTINGS_MESSAGE_TYPE}' }))
      }

      const buttonLabel = '${t('layout:settings')}'
      const button = document.createElement('button')
      button.name = 'opt-in-settings-button'
      button.innerHTML = buttonLabel
      button.id = button.name
      button.onclick = onClickHandler
      element.appendChild(button)
    }

    function showMessageWithSettings(text, iframeContainer, iframeSource) {
      const container = getContainer(iframeContainer, 'iframe-info-text')
      showMessage(text, container, iframeSource)
      showSettingsButton(container)
    }

    function showOptIn(text, iframeContainer, source) {
      function onClickHandler() {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: '${ALLOW_EXTERNAL_SOURCE_MESSAGE_TYPE}', source }),
        )
      }
      
      const container = getContainer(iframeContainer, 'iframe-info-text')
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.name = 'opt-in-checkbox'
      checkbox.id = checkbox.name
      checkbox.onclick = onClickHandler
      const label = document.createElement('label')
      label.htmlFor = checkbox.name
      showSource(label, source)
      label.appendChild(document.createTextNode(text))
      container.appendChild(label)
      container.appendChild(checkbox)
    }
    
    function handleSupportedIframeSources(iframe, iframeSource) {
      const externalSourcePermissions = ${JSON.stringify(externalSourcePermissions)}
      const iframeContainer = document.createElement('div')
      iframeContainer.classList.add('iframe-container')
      iframe.parentNode.appendChild(iframeContainer)
      iframeContainer.appendChild(iframe)
      // Scale the iframe height depending on device width and outside margin
      const deviceWidth = '${deviceWidth}'
      const pageContainerPadding = '${pageContainerPadding}'
      const scaledHeight = (deviceWidth / Number(iframe.width)) * Number(iframe.height) - pageContainerPadding
      iframe.setAttribute('height', scaledHeight)
      if (externalSourcePermissions[iframeSource] === undefined) {
        const message = '${t('consent:knownResourceOptIn')}'
        showOptIn(message, iframeContainer, iframeSource)
        iframe.remove()
      } else if (externalSourcePermissions[iframeSource]) {
        // Add do not track parameter (only working for vimeo)
        if (iframeSource === 'vimeo.com') {
          const url = new URL(iframe.src)
          url.searchParams.append('dnt', '1')
          iframe.setAttribute('src', url.href)
        }
        const message = '${t('consent:knownResourceContentMessage')}'
        showMessageWithSettings(message, iframeContainer, iframeSource)
      } else {
        const message = '${t('consent:knownResourceBlocked')}'
        showMessageWithSettings(message, iframeContainer, iframeSource)
        iframe.remove()
      }
    }

    const iframes = document.querySelectorAll('iframe')
    const supportedIframeSources = ${JSON.stringify(supportedIframeSources)}

    iframes.forEach(iframe => {
      const supportedIframeSource = supportedIframeSources.find(src => iframe.src.includes(src))
      if (supportedIframeSource) {
        handleSupportedIframeSources(iframe, supportedIframeSource)
      } else {
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
  supportedIframeSources: string[],
  theme: DefaultTheme,
  language: string,
  externalSourcePermissions: ExternalSourcePermissions,
  t: TFunction,
  deviceWidth: number,
  pageContainerPadding: number,
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
        color: ${theme.colors.textColor}
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
      
      a {
        color: ${theme.colors.linkColor};
      }

      .link-external::after {
        /* ExternalIcon, WebView can't handle imported svg as background */
        content: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18'><path d='M16 15.9996l-14 0l0 -14l7 0l0 -2l-7 0a2 2 0 0 0 -2 2l0 14a2 2 0 0 0 2 2l14 0c1.1 0 2 -0.9 2 -2l0 -7l-2 0l0 7zm-5 -16l0 2l3.59 0l-9.83 9.83 1.41 1.41 9.83 -9.83l0 3.59l2 0l0 -7l-7 0z' fill='rgb(11, 87, 208)'/></svg>");
        display: inline-block;
        width: ${theme.fonts.contentFontSize};
        height: ${theme.fonts.contentFontSize};
        background-size: contain;
        background-repeat: no-repeat;
        vertical-align: -2px;
        margin: 0 4px;
      }

      iframe {
        border: none;
        border-bottom: 1px solid ${theme.colors.borderColor};
        max-width: 100%;
      }

      .iframe-container {
        display: flex;
        padding: 4px;
        flex-direction: column;
        border: 1px solid ${theme.colors.borderColor};
        border-radius: 4px;
        box-shadow: 0 1px 3px rgb(0 0 0 / 10%),
        0 1px 2px rgb(0 0 0 / 15%);
      }

      .iframe-info-text {
        display: flex;
        flex-direction: row;
        font-size: ${theme.fonts.decorativeFontSizeSmall};
        padding: 12px;
        justify-content: space-between;
      }

      .iframe-source {
        display: contents;
        font-weight: bold;
      }

      .contact-card {
        display: inline-block;
        text-align: start;
        box-sizing: border-box;
        padding: 16px;
        border-radius: 4px;
        background-repeat: no-repeat;
        background-color: rgb(127 127 127 / 15%);
        background-image: linear-gradient(to right, ${theme.isContrastTheme ? 'rgb(127 127 127 / 0)' : 'rgb(255 255 255 / 90%)'} 0 100%),
          url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTMuMDE4IDEyLjQ4aC0yLjAzNkE5LjA5IDkuMDkgMCAwIDAgMS45MiAyMS42YS40OC40OCAwIDAgMCAuNDguNDhoMTkuMmEuNTMuNTMgMCAwIDAgLjQ4LS41MzggOS4wOCA5LjA4IDAgMCAwLTkuMDYyLTkuMDYyTTE2LjggNi43MmE0LjggNC44IDAgMCAxLTQuOCA0LjggNC44IDQuOCAwIDAgMS00LjgtNC44IDQuOCA0LjggMCAwIDEgNC44LTQuOCA0LjggNC44IDAgMCAxIDQuOCA0LjgiLz48L3N2Zz4=');
        background-blend-mode: difference;
        background-position: calc(100% + 32px) 100%, calc(100% + 24px) calc(100% + 24px);
        background-size: 104px;
        box-shadow: 0 1px 1px rgb(0 0 0 / 40%);
        width: 100%;

        p {
          margin-top: 4px;
          margin-bottom: 0;
        }

        h4 {
          margin-bottom: 12px;
          margin-top: 0;
        }

        img {
          margin-inline-end: 8px;
        }
      }

      #opt-in-settings-button {
        border: none;
        background-color: transparent;
        margin-left: 12px;
        padding: 0;
        overflow-wrap: normal;
        color: ${theme.colors.tunewsThemeColor};
      }

      #opt-in-checkbox {
        display: flex;
        margin-left: 12px;
        align-self: center;
      }

    </style>
  </head>
  <body dir='auto'>
  <div id='measure-container'>${html}</div>
  <script>${renderJS(
    cacheDictionary,
    supportedIframeSources,
    externalSourcePermissions,
    t,
    theme,
    deviceWidth,
    pageContainerPadding,
  )}</script>
  </body>
  </html>
`

export default renderHtml
