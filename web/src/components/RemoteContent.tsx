import Dompurify from 'dompurify'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ExternalSourcePermissions } from 'shared'

import { ExternalLinkIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import { helpers } from '../constants/theme'
import useLocalStorage from '../hooks/useLocalStorage'
import useWindowDimensions from '../hooks/useWindowDimensions'
import {
  LOCAL_STORAGE_ITEM_EXTERNAL_SOURCES,
  handleAllowedIframeSources,
  hideIframe,
  preserveIFrameSourcesFromContent,
} from '../utils/iframes'

const SandBox = styled.div<{ centered: boolean; smallText: boolean }>`
  font-family: ${props => props.theme.fonts.web.contentFont};
  font-size: ${props => (props.smallText ? helpers.adaptiveFontSize : props.theme.fonts.contentFontSize)};
  line-height: ${props => props.theme.fonts.contentLineHeight};
  display: flow-root; /* clearfix for the img floats */

  ${props => (props.centered ? 'text-align: center;' : '')}
  ${props => (props.centered ? 'list-style-position: inside;' : '')}
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;

    &.alignright {
      float: inline-end;
    }

    &.alignleft {
      float: inline-start;
    }

    &.aligncenter {
      display: block;
      margin: auto;
    }
  }

  figure {
    margin-inline-start: 0;
    text-align: center;
    margin: 15px auto;

    @media only screen and (width <= 640px) {
      width: 100% !important;
    }
  }

  figcaption {
    font-size: ${props => props.theme.fonts.hintFontSize};
    font-style: italic;
    padding: 0 15px;
  }

  table {
    display: block;
    width: 100% !important;
    height: auto !important; /* need important because of badly formatted remote content */
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
    border: 1px solid ${props => props.theme.colors.backgroundAccentColor};
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

  .link-external::after {
    content: '';
    display: inline-block;
    background-image: url('${ExternalLinkIcon}');
    width: ${props => (props.smallText ? helpers.adaptiveFontSize : props.theme.fonts.contentFontSize)};
    height: ${props => (props.smallText ? helpers.adaptiveFontSize : props.theme.fonts.contentFontSize)};
    background-size: contain;
    background-repeat: no-repeat;
    vertical-align: middle;
    margin: 0 4px;
  }

  iframe {
    border: none;
    border-bottom: 1px solid ${props => props.theme.colors.borderColor};

    @media ${dimensions.smallViewport} {
      max-width: 100%;
    }
  }

  .iframe-container {
    display: flex;
    padding: 4px;
    flex-direction: column;
    border: 1px solid ${props => props.theme.colors.borderColor};
    border-radius: 4px;
    box-shadow:
      0 1px 3px rgb(0 0 0 / 10%),
      0 1px 2px rgb(0 0 0 / 15%);
  }

  .iframe-info-text {
    display: flex;
    padding: 12px;
    justify-content: space-between;
    font-size: ${props => props.theme.fonts.decorativeFontSizeSmall};
  }

  .iframe-info-text > input {
    margin-inline-start: 12px;
    cursor: pointer;
  }

  .iframe-info-text > label {
    cursor: pointer;
  }

  .iframe-source {
    display: contents;
    font-weight: bold;
  }

  #opt-in-settings-link {
    margin-inline-start: 12px;
    padding: 0;
    cursor: pointer;
    align-self: center;
  }
`

type RemoteContentProps = {
  html: string
  onInternalLinkClick: (url: string) => void
  centered?: boolean
  smallText?: boolean
}

const HIJACK = new RegExp(buildConfig().internalLinksHijackPattern)
const DOMPURIFY_TAG_IFRAME = 'iframe'
const DOMPURIFY_ATTRIBUTE_FULLSCREEN = 'allowfullscreen'

export type IframeSources = Record<number, string>
export const IFRAME_BLANK_SOURCE = 'about:blank'

const RemoteContent = ({
  html,
  onInternalLinkClick,
  centered = false,
  smallText = false,
}: RemoteContentProps): ReactElement => {
  const sandBoxRef = React.createRef<HTMLDivElement>()
  const { value: externalSourcePermissions, updateLocalStorageItem } = useLocalStorage<ExternalSourcePermissions>(
    LOCAL_STORAGE_ITEM_EXTERNAL_SOURCES,
  )

  const [contentIframeSources, setContentIframeSources] = useState<IframeSources>({})
  const { viewportSmall, width: deviceWidth } = useWindowDimensions()
  const { t } = useTranslation()

  const handleClick = useCallback(
    (event: MouseEvent): void => {
      event.preventDefault()
      const target = event.currentTarget

      if (target instanceof HTMLAnchorElement) {
        const href = target.href
        const url = new URL(decodeURIComponent(href))
        onInternalLinkClick(decodeURIComponent(`${url.pathname}${url.search}${url.hash}`))
      }
    },
    [onInternalLinkClick],
  )

  const onUpdateLocalStorage = useCallback(
    (source: string): void => updateLocalStorageItem({ ...externalSourcePermissions, [source]: true }),
    [externalSourcePermissions, updateLocalStorageItem],
  )

  useEffect(() => {
    if (!sandBoxRef.current) {
      return
    }
    const currentSandBoxRef = sandBoxRef.current
    const collection = currentSandBoxRef.getElementsByTagName('a')
    Array.from(collection).forEach(node => {
      if (HIJACK.test(node.href)) {
        node.addEventListener('click', handleClick)
      }
    })

    const iframes = currentSandBoxRef.getElementsByTagName('iframe')
    Array.from(iframes).forEach((iframe: HTMLIFrameElement, index: number) => {
      if (iframe.src !== IFRAME_BLANK_SOURCE) {
        preserveIFrameSourcesFromContent(index, iframe.src, setContentIframeSources, contentIframeSources)
      }

      const storedIframeSource = contentIframeSources[index]
      const supportedSource = storedIframeSource
        ? buildConfig().supportedIframeSources.find(src => storedIframeSource.includes(src))
        : undefined

      hideIframe(iframe)
      if (supportedSource && storedIframeSource) {
        handleAllowedIframeSources(
          iframe,
          externalSourcePermissions,
          storedIframeSource,
          t,
          onUpdateLocalStorage,
          index,
          supportedSource,
          viewportSmall,
          deviceWidth,
        )
      }
    })
  }, [
    t,
    html,
    handleClick,
    sandBoxRef,
    externalSourcePermissions,
    contentIframeSources,
    onUpdateLocalStorage,
    viewportSmall,
    deviceWidth,
  ])

  const dangerouslySetInnerHTML = {
    __html: Dompurify.sanitize(html, {
      ADD_TAGS: [DOMPURIFY_TAG_IFRAME],
      ADD_ATTR: [DOMPURIFY_ATTRIBUTE_FULLSCREEN],
    }),
  }

  return (
    <SandBox
      dir='auto'
      centered={centered}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      ref={sandBoxRef}
      smallText={smallText}
    />
  )
}

export default RemoteContent
