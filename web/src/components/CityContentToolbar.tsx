import React, { memo, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyIcon, DoneIcon } from '../assets'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { RouteType } from '../routes'
import FeedbackToolbarItem from './FeedbackToolbarItem'
import SharingPopup from './SharingPopup'
import Toolbar from './Toolbar'
import ToolbarItem from './ToolbarItem'
import Tooltip from './Tooltip'

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

  return (
    <Toolbar iconDirection={iconDirection} hideDivider={hideDivider}>
      {children}
      <SharingPopup
        shareUrl={window.location.href}
        flow={iconDirection === 'row' ? 'vertical' : 'horizontal'}
        title={pageTitle}
        portalNeeded={isInBottomActionSheet}
      />
      <Tooltip text={t('common:copied')} flow='up' active={linkCopied} trigger='click'>
        <ToolbarItem icon={linkCopied ? DoneIcon : CopyIcon} text={t('copyUrl')} onClick={copyToClipboard} />
      </Tooltip>
      {hasFeedbackOption && (
        <FeedbackToolbarItem route={route} slug={feedbackTarget} isInBottomActionSheet={isInBottomActionSheet} />
      )}
    </Toolbar>
  )
}
export default memo(CityContentToolbar)
