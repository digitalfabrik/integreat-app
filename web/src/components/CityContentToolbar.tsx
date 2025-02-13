import React, { memo, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlacesType } from 'react-tooltip'
import { useTheme } from 'styled-components'

import { CopyIcon, DoneIcon, ReadAloudIcon } from '../assets'
import useTtsPlayer from '../hooks/useTtsPlayer'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { RouteType } from '../routes'
import FeedbackToolbarItem from './FeedbackToolbarItem'
import SharingPopup from './SharingPopup'
import Toolbar from './Toolbar'
import ToolbarItem from './ToolbarItem'
import Tooltip from './base/Tooltip'

type CityContentToolbarProps = {
  feedbackTarget?: string
  children?: ReactNode
  iconDirection?: 'row' | 'column'
  hasFeedbackOption?: boolean
  hideDivider?: boolean
  pageTitle: string
  route: RouteType
  isInBottomActionSheet?: boolean
}

const TOOLTIP_TIMEOUT = 3000

const CityContentToolbar = (props: CityContentToolbarProps) => {
  const { viewportSmall } = useWindowDimensions()
  const {
    feedbackTarget,
    children,
    iconDirection = viewportSmall ? 'row' : 'column',
    hasFeedbackOption = true,
    hideDivider,
    route,
    pageTitle,
    isInBottomActionSheet = false,
  } = props
  const [linkCopied, setLinkCopied] = useState<boolean>(false)
  const [ttsToolTip, setTtsToolTip] = useState<boolean>(false)
  const { t } = useTranslation('layout')
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).catch(reportError)
    setLinkCopied(true)
    setTimeout(() => {
      setLinkCopied(false)
    }, TOOLTIP_TIMEOUT)
  }

  const showTtsWarning = () => {
    setTtsToolTip(true)
    setTimeout(() => {
      setTtsToolTip(false)
    }, TOOLTIP_TIMEOUT)
  }

  const theme = useTheme()
  const tooltipDirectionForDesktop: PlacesType = theme.contentDirection === 'ltr' ? 'right' : 'left'
  const tooltipDirection: PlacesType = viewportSmall ? 'top' : tooltipDirectionForDesktop
  const { enabled: isTtsEnabled, setVisible: setTtsPlayerVisible, canRead } = useTtsPlayer()
  const ttsItem = isTtsEnabled ? (
    <ToolbarItem
      icon={ReadAloudIcon}
      text={t('readAloud')}
      onClick={() => {
        if (canRead) {
          setTtsPlayerVisible(true)
        } else {
          showTtsWarning()
          setTtsPlayerVisible(false)
        }
      }}
      id='read-aloud-icon'
    />
  ) : null

  return (
    <Toolbar iconDirection={iconDirection} hideDivider={hideDivider}>
      {children}

      <Tooltip
        id='tts-icon'
        openOnClick
        isOpen={ttsToolTip}
        place={tooltipDirection}
        tooltipContent={t('nothingToReadFullMessage')}>
        {ttsItem}
      </Tooltip>

      <SharingPopup
        shareUrl={window.location.href}
        flow={iconDirection === 'row' ? 'vertical' : 'horizontal'}
        title={pageTitle}
        portalNeeded={isInBottomActionSheet}
      />

      <Tooltip
        id='copy-icon'
        openOnClick
        isOpen={linkCopied}
        place={tooltipDirection}
        tooltipContent={t('common:copied')}>
        <ToolbarItem
          icon={linkCopied ? DoneIcon : CopyIcon}
          text={t('copyUrl')}
          onClick={copyToClipboard}
          id='copy-icon'
        />
      </Tooltip>
      {hasFeedbackOption && <FeedbackToolbarItem route={route} slug={feedbackTarget} positive />}
      {hasFeedbackOption && <FeedbackToolbarItem route={route} slug={feedbackTarget} positive={false} />}
    </Toolbar>
  )
}
export default memo(CityContentToolbar)
