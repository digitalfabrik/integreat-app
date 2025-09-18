import ContrastIcon from '@mui/icons-material/Contrast'
import { useTheme } from '@mui/material/styles'
import React, { memo, ReactNode, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { RATING_NEGATIVE, RATING_POSITIVE } from 'shared'

import { ReadAloudIcon } from '../assets'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { RouteType } from '../routes'
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
  const { toggleTheme } = useTheme()
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('layout')

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

  const items = [
    children,
    hasFeedbackOption && (
      <FeedbackToolbarItem key='positive' route={route} slug={feedbackTarget} rating={RATING_POSITIVE} />
    ),
    hasFeedbackOption && (
      <FeedbackToolbarItem key='negative' route={route} slug={feedbackTarget} rating={RATING_NEGATIVE} />
    ),
    <SharingPopup
      key='share'
      shareUrl={window.location.href}
      flow={iconDirection === 'row' ? 'vertical' : 'horizontal'}
      title={pageTitle}
      portalNeeded={isInBottomActionSheet}
    />,
    ttsEnabled && (
      <ToolbarItem
        key='tts'
        icon={ReadAloudIcon}
        isDisabled={!canRead}
        text={t('readAloud')}
        tooltip={canRead ? null : t('nothingToReadFullMessage')}
        onClick={showTtsPlayer}
      />
    ),
    !viewportSmall && <ToolbarItem key='theme' icon={ContrastIcon} text={t('contrastTheme')} onClick={toggleTheme} />,
  ]
    .filter(Boolean)
    .slice(0, maxItems)

  return (
    <Toolbar iconDirection={iconDirection} hideDivider={hideDivider}>
      {items}
    </Toolbar>
  )
}
export default memo(CityContentToolbar)
