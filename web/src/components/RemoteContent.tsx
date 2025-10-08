import { useTheme } from '@emotion/react'
import Dompurify from 'dompurify'
import { decode } from 'html-entities'
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ExternalSourcePermissions } from 'shared'

import buildConfig from '../constants/buildConfig'
import useLocalStorage from '../hooks/useLocalStorage'
import useWindowDimensions from '../hooks/useWindowDimensions'
import {
  LOCAL_STORAGE_ITEM_EXTERNAL_SOURCES,
  handleAllowedIframeSources,
  hideIframe,
  preserveIFrameSourcesFromContent,
} from '../utils/iframes'
import openLink from '../utils/openLink'
import RemoteContentSandBox from './RemoteContentSandBox'

type RemoteContentProps = {
  html: string
  centered?: boolean
  smallText?: boolean
  highlightedSentence?: string
}

const DOMPURIFY_TAG_IFRAME = 'iframe'
const DOMPURIFY_ATTRIBUTE_FULLSCREEN = 'allowfullscreen'
const DOMPURIFY_ATTRIBUTE_TARGET = 'target'

export type IframeSources = Record<number, string>
export const IFRAME_BLANK_SOURCE = 'about:blank'

const RemoteContent = ({
  html,
  centered = false,
  smallText = false,
  highlightedSentence,
}: RemoteContentProps): ReactElement => {
  const navigate = useNavigate()
  const sandBoxRef = React.createRef<HTMLDivElement>()
  const { value: externalSourcePermissions, updateLocalStorageItem } = useLocalStorage<ExternalSourcePermissions>({
    key: LOCAL_STORAGE_ITEM_EXTERNAL_SOURCES,
    initialValue: {},
  })

  const [contentIframeSources, setContentIframeSources] = useState<IframeSources>({})
  const { viewportSmall, width: deviceWidth } = useWindowDimensions()
  const { t } = useTranslation()
  const { isContrastTheme } = useTheme()

  const handleAnchorClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      const target = event.currentTarget as HTMLAnchorElement
      openLink(navigate, target.href)
    },
    [navigate],
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

    const allElements = currentSandBoxRef.querySelectorAll('*')
    allElements.forEach(element => {
      if (element instanceof HTMLElement && element.style.color === 'rgb(0, 0, 0)') {
        element.style.removeProperty('color')
      }
      if (element instanceof HTMLImageElement && element.src.endsWith('.svg') && isContrastTheme) {
        element.style.setProperty('filter', 'invert(1)')
      }
    })

    const anchors = currentSandBoxRef.getElementsByTagName('a')
    Array.from(anchors).forEach(anchor => anchor.addEventListener('click', handleAnchorClick))

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
    handleAnchorClick,
    sandBoxRef,
    externalSourcePermissions,
    contentIframeSources,
    onUpdateLocalStorage,
    viewportSmall,
    deviceWidth,
    isContrastTheme,
  ])

  // TODO Highlight sentence with a-tags correctly
  const replaceSentence = (decodedHTML: string, highlightedSentence: string, sentenceIndices: number[]) =>
    decodedHTML.replace(new RegExp(`(${highlightedSentence})(?!(?:[^<]+>|[^>]*</(img|a)>))`, 'g'), () =>
      sentenceIndices.length > 0
        ? `<mark class="highlight-sentence">${highlightedSentence}</mark>`
        : highlightedSentence,
    )

  const decodedHTML = decode(html)
  const highlightedHtml = highlightedSentence
    ? replaceSentence(decodedHTML, highlightedSentence, Array.from(Array(highlightedSentence.length).keys()))
    : decodedHTML

  const dangerouslySetInnerHTML = useMemo(
    () => ({
      __html: Dompurify.sanitize(highlightedHtml, {
        ADD_TAGS: [DOMPURIFY_TAG_IFRAME],
        ADD_ATTR: [DOMPURIFY_ATTRIBUTE_FULLSCREEN, DOMPURIFY_ATTRIBUTE_TARGET],
      }),
    }),
    [highlightedHtml],
  )

  return (
    <RemoteContentSandBox
      dir='auto'
      centered={centered}
      charLength={highlightedHtml.length}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      ref={sandBoxRef}
      smallText={smallText}
    />
  )
}

export default RemoteContent
