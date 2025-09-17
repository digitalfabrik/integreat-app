import ContrastIcon from '@mui/icons-material/Contrast'
import { useTheme } from '@mui/material/styles'
import React, { ReactElement, ReactNode, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { RATING_NEGATIVE, RATING_POSITIVE } from 'shared'

import { ReadAloudIcon } from '../assets'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { RouteType } from '../routes'
import FeedbackToolbarItem from './FeedbackToolbarItem'
import SharingPopupToolbarItem from './SharingPopupToolbarItem'
import Toolbar from './Toolbar'
import ToolbarItem from './ToolbarItem'
import { TtsContext } from './TtsContainer'
import Icon from './base/Icon'

type CityContentToolbarProps = {
  feedbackTarget?: string
  children?: ReactNode
  iconDirection?: 'row' | 'column'
  hasFeedbackOption?: boolean
  pageTitle: string
  route: RouteType
  isInBottomActionSheet?: boolean
  maxItems?: number
}

const CityContentToolbar = (props: CityContentToolbarProps): ReactElement => {
  const { enabled: ttsEnabled, showTtsPlayer, canRead } = useContext(TtsContext)
  const { toggleTheme } = useTheme()
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('layout')

  const {
    feedbackTarget,
    children,
    iconDirection = viewportSmall ? 'row' : 'column',
    hasFeedbackOption = true,
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
    <SharingPopupToolbarItem
      key='share'
      flow={iconDirection === 'row' ? 'vertical' : 'horizontal'}
      title={pageTitle}
      portalNeeded={isInBottomActionSheet}
    />,
    ttsEnabled && (
      <ToolbarItem
        key='tts'
        icon={<Icon src={ReadAloudIcon} />}
        disabled={!canRead}
        text={t('readAloud')}
        tooltip={canRead ? null : t('nothingToReadFullMessage')}
        onClick={showTtsPlayer}
      />
    ),
    !viewportSmall && (
      <ToolbarItem key='theme' icon={<ContrastIcon />} text={t('contrastTheme')} onClick={toggleTheme} />
    ),
  ]
    .filter(Boolean)
    .slice(0, maxItems)

  return <Toolbar>{items}</Toolbar>
}
export default CityContentToolbar
