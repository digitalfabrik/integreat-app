import ContrastIcon from '@mui/icons-material/Contrast'
import { useTheme } from '@mui/material/styles'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { CATEGORIES_ROUTE, NEWS_ROUTE, RATING_NEGATIVE, RATING_POSITIVE } from 'shared'
import { CategoryModel } from 'shared/api'

import { ReadAloudIcon } from '../assets'
import useCityContentParams from '../hooks/useCityContentParams'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { RouteType } from '../routes'
import FeedbackToolbarItem from './FeedbackToolbarItem'
import PdfToolbarItem from './PdfToolbarItem'
import SharingPopupToolbarItem from './SharingPopupToolbarItem'
import Toolbar from './Toolbar'
import ToolbarItem from './ToolbarItem'
import { TtsContext } from './TtsContainer'
import Icon from './base/Icon'

type CityContentToolbarProps = {
  slug?: string
  category?: CategoryModel
  iconDirection?: 'row' | 'column'
  pageTitle: string
  isInBottomActionSheet?: boolean
  maxItems?: number
}

const CityContentToolbar = (props: CityContentToolbarProps): ReactElement => {
  const { route, cityCode, languageCode } = useCityContentParams()
  const { enabled: ttsEnabled, showTtsPlayer, canRead } = useContext(TtsContext)
  const { toggleTheme } = useTheme()
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('layout')

  const {
    slug,
    category,
    iconDirection = viewportSmall ? 'row' : 'column',
    pageTitle,
    isInBottomActionSheet = false,
    maxItems,
  } = props

  const items = [
    route === CATEGORIES_ROUTE && (
      <PdfToolbarItem key='pdf' category={category} cityCode={cityCode} languageCode={languageCode} />
    ),
    route !== NEWS_ROUTE && (
      <FeedbackToolbarItem key='positive' route={route as RouteType} slug={slug} rating={RATING_POSITIVE} />
    ),
    route !== NEWS_ROUTE && (
      <FeedbackToolbarItem key='negative' route={route as RouteType} slug={slug} rating={RATING_NEGATIVE} />
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
