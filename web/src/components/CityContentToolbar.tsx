import React, { memo, ReactNode, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { ReadAloudIcon } from '../assets'
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
}

const COPY_TIMEOUT = 3000

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
  } = props
  const { t } = useTranslation('layout')

  return (
    <Toolbar iconDirection={iconDirection} hideDivider={hideDivider}>
      {children}

      {ttsEnabled && (
        <ToolbarItem
          icon={ReadAloudIcon}
          isDisabled={!canRead}
          text={t('readAloud')}
          tooltip={canRead ? null : t('nothingToReadFullMessage')}
          onClick={showTtsPlayer}
          id='read-aloud-icon'
        />
      )}

      <SharingPopup
        shareUrl={window.location.href}
        flow={iconDirection === 'row' ? 'vertical' : 'horizontal'}
        title={pageTitle}
        portalNeeded={isInBottomActionSheet}
      />

      {hasFeedbackOption && <FeedbackToolbarItem route={route} slug={feedbackTarget} positive />}
      {hasFeedbackOption && <FeedbackToolbarItem route={route} slug={feedbackTarget} positive={false} />}
      {!viewportSmall && <ContrastThemeToggle />}
    </Toolbar>
  )
}
export default memo(CityContentToolbar)
