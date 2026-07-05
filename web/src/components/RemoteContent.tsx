import { useTheme } from '@mui/material/styles'
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { ExternalSourcePermissions, sanitizeContent } from 'shared'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'
import useLocalStorage, { EXTERNAL_SOURCES_STORAGE_KEY } from '../hooks/useLocalStorage'
import {
  handleAllowedIframeSources,
  hideIframe,
  IframeSources,
  IFRAME_BLANK_SOURCE,
  preserveIFrameSourcesFromContent,
} from '../utils/iframes'
import openLink from '../utils/openLink'
import RemoteContentSandBox from './RemoteContentSandBox'

type RemoteContentProps = {
  html: string
  centered?: boolean
  smallText?: boolean
  onLinkClick?: (url: string) => void
}

const RemoteContent = ({
  html,
  centered = false,
  smallText = false,
  onLinkClick,
}: RemoteContentProps): ReactElement => {
  const navigate = useNavigate()
  const sandBoxRef = React.createRef<HTMLDivElement>()
  const [externalSources, setExternalSources] = useLocalStorage<ExternalSourcePermissions>({
    key: EXTERNAL_SOURCES_STORAGE_KEY,
    initialValue: {},
  })

  const [contentIframeSources, setContentIframeSources] = useState<IframeSources>({})
  const { mobile, window } = useDimensions()
  const { t } = useTranslation()
  const { isContrastTheme } = useTheme()

  const handleAnchorClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      const target = event.currentTarget as HTMLAnchorElement
      if (onLinkClick) {
        onLinkClick(target.href)
      } else {
        openLink(navigate, target.href)
      }
    },
    [onLinkClick, navigate],
  )

  const addExternalSource = useCallback(
    (source: string): void => setExternalSources({ ...externalSources, [source]: true }),
    [externalSources, setExternalSources],
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
      if (element instanceof HTMLImageElement && element.src.endsWith('.svg')) {
        if (isContrastTheme) {
          element.style.setProperty('filter', 'invert(1)')
        } else {
          element.style.removeProperty('filter')
        }
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
          externalSources,
          storedIframeSource,
          t,
          addExternalSource,
          index,
          supportedSource,
          mobile,
          window.width,
        )
      }
    })
  }, [
    t,
    html,
    handleAnchorClick,
    sandBoxRef,
    externalSources,
    contentIframeSources,
    addExternalSource,
    mobile,
    window.width,
    isContrastTheme,
  ])

  const dangerouslySetInnerHTML = useMemo(
    () => ({ __html: sanitizeContent(html, { supportedIframeSources: buildConfig().supportedIframeSources }) }),
    [html],
  )

  return (
    <RemoteContentSandBox
      dir='auto'
      centered={centered}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      ref={sandBoxRef}
      smallText={smallText}
    />
  )
}

export default RemoteContent
