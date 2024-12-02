import React, { memo, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlacesType } from 'react-tooltip'
import { useTheme } from 'styled-components'

import { CopyIcon, DoneIcon } from '../assets'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { RouteType } from '../routes'
import FeedbackToolbarIcons from './FeedbackToolbarIcons'
import SharingPopup from './SharingPopup'
import Toolbar from './Toolbar'
import ToolbarIcon from './ToolbarIcon'
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

const COPY_TIMEOUT = 3000

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
  const { t } = useTranslation('layout')
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).catch(reportError)
    setLinkCopied(true)
    setTimeout(() => {
      setLinkCopied(false)
    }, COPY_TIMEOUT)
  }

  const theme = useTheme()
  const tooltipDirectionForDesktop: PlacesType = theme.contentDirection === 'ltr' ? 'right' : 'left'
  const tooltipDirection: PlacesType = viewportSmall ? 'top' : tooltipDirectionForDesktop

  return (
    <Toolbar iconDirection={iconDirection} hideDivider={hideDivider}>
      {children}
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
        <ToolbarIcon
          icon={linkCopied ? DoneIcon : CopyIcon}
          text={t('copyUrl')}
          onClick={copyToClipboard}
          id='copy-icon'
        />
      </Tooltip>
      {hasFeedbackOption && <FeedbackToolbarIcons route={route} slug={feedbackTarget} />}
    </Toolbar>
  )
}
export default memo(CityContentToolbar)
