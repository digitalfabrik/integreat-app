import React, { memo, ReactNode, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyIcon, DoneIcon, ReadAloudIcon } from '../assets'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { RouteType } from '../routes'
import ContrastThemeToggle from './ContrastThemeToggle'
import FeedbackToolbarItem from './FeedbackToolbarItem'
import SharingPopup from './SharingPopup'
import Toolbar from './Toolbar'
import ToolbarItem from './ToolbarItem'
import { TtsContext } from './TtsContainer'

type CityContentToolbarProps = {
  feedbackTarget?: string
  children?: ReactNode
  iconDirection?: 'row' | 'column'
  hasFeedbackOption?: boolean
  hideDivider?: boolean
  pageTitle: string
  route: RouteType
  isInBottomActionSheet?: boolean
  maxItems?: number
}

const CityContentToolbar = (props: CityContentToolbarProps) => {
  const { enabled: ttsEnabled, showTtsPlayer, canRead } = useContext(TtsContext)

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
    maxItems,
  } = props
  const { t } = useTranslation('layout')
  const items = [
    children,
    hasFeedbackOption ? <FeedbackToolbarItem route={route} slug={feedbackTarget} positive /> : undefined,
    hasFeedbackOption ? <FeedbackToolbarItem route={route} slug={feedbackTarget} positive={false} /> : undefined,
    <SharingPopup
      shareUrl={window.location.href}
      flow={iconDirection === 'row' ? 'vertical' : 'horizontal'}
      title={pageTitle}
      portalNeeded={isInBottomActionSheet}
    />,
    ttsEnabled ? (
      <ToolbarItem
        icon={ReadAloudIcon}
        isDisabled={!canRead}
        text={t('readAloud')}
        tooltip={canRead ? null : t('nothingToReadFullMessage')}
        onClick={showTtsPlayer}
        id='read-aloud-icon'
      />
    ) : undefined,
    !viewportSmall ? <ContrastThemeToggle /> : undefined,
  ]
    .filter(it => it !== undefined)
    .slice(0, maxItems)

  return (
    <Toolbar iconDirection={iconDirection} hideDivider={hideDivider}>
      {items}
    </Toolbar>
  )
}
export default memo(CityContentToolbar)
