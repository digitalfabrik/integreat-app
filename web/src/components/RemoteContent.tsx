import Dompurify from 'dompurify'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
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
}

const DOMPURIFY_TAG_IFRAME = 'iframe'
const DOMPURIFY_ATTRIBUTE_FULLSCREEN = 'allowfullscreen'
const DOMPURIFY_ATTRIBUTE_TARGET = 'target'

export type IframeSources = Record<number, string>
export const IFRAME_BLANK_SOURCE = 'about:blank'

const RemoteContent = ({ html, centered = false, smallText = false }: RemoteContentProps): ReactElement => {
  const navigate = useNavigate()
  const sandBoxRef = React.createRef<HTMLDivElement>()
  const { value: externalSourcePermissions, updateLocalStorageItem } = useLocalStorage<ExternalSourcePermissions>({
    key: LOCAL_STORAGE_ITEM_EXTERNAL_SOURCES,
    initialValue: {},
  })

  const [contentIframeSources, setContentIframeSources] = useState<IframeSources>({})
  const { viewportSmall, width: deviceWidth } = useWindowDimensions()
  const { t } = useTranslation()

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
  ])

  const dangerouslySetInnerHTML = {
    __html: Dompurify.sanitize(html, {
      ADD_TAGS: [DOMPURIFY_TAG_IFRAME],
      ADD_ATTR: [DOMPURIFY_ATTRIBUTE_FULLSCREEN, DOMPURIFY_ATTRIBUTE_TARGET],
    }),
  }

  return (
    <RemoteContentSandBox
      dir='auto'
      $centered={centered}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      ref={sandBoxRef}
      $smallText={smallText}
    />
  )
}

export default RemoteContent
