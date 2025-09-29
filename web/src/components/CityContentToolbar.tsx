import ContrastIcon from '@mui/icons-material/Contrast'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { CATEGORIES_ROUTE, NEWS_ROUTE, RATING_NEGATIVE, RATING_POSITIVE } from 'shared'
import { CategoryModel } from 'shared/api'

import { ReadAloudIcon } from '../assets'
import useCityContentParams from '../hooks/useCityContentParams'
import { RouteType } from '../routes'
import FeedbackToolbarItem from './FeedbackToolbarItem'
import PdfToolbarItem from './PdfToolbarItem'
import SharingPopupToolbarItem from './SharingPopupToolbarItem'
import ToolbarItem from './ToolbarItem'
import { TtsContext } from './TtsContainer'
import Icon from './base/Icon'

export const TOOLBAR_ELEMENT_ID = 'toolbar'

type CityContentToolbarProps = {
  slug?: string
  category?: CategoryModel
  direction?: 'row' | 'column'
  pageTitle: string
}

const CityContentToolbar = (props: CityContentToolbarProps): ReactElement => {
  const { route, cityCode, languageCode } = useCityContentParams()
  const { enabled: ttsEnabled, showTtsPlayer, canRead } = useContext(TtsContext)
  const { toggleTheme } = useTheme()
  const { t } = useTranslation('layout')

  const { slug, category, direction = 'column', pageTitle } = props

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
    <SharingPopupToolbarItem key='share' flow={direction === 'row' ? 'vertical' : 'horizontal'} title={pageTitle} />,
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
    <ToolbarItem key='theme' icon={<ContrastIcon />} text={t('contrastTheme')} onClick={toggleTheme} />,
  ].filter(Boolean)

  return (
    <Stack id={TOOLBAR_ELEMENT_ID} direction={direction} width={direction === 'row' ? '100%' : undefined}>
      {items}
    </Stack>
  )
}
export default CityContentToolbar
