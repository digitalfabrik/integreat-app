import CommentIcon from '@mui/icons-material/CommentOutlined'
import ContrastIcon from '@mui/icons-material/Contrast'
import { useTheme } from '@mui/material/styles'
import React, { ReactElement, useContext, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { NEWS_ROUTE, CATEGORIES_ROUTE, FEEDBACK_QUERY_KEY } from 'shared'
import { CategoryModel } from 'shared/api'

import { ReadAloudIcon } from '../assets'
import { TtsContext } from '../contexts/TtsContext'
import useQueryParamVisibility from '../hooks/useQueryParamVisibility'
import useRegionContentParams from '../hooks/useRegionContentParams'
import HeaderMenu, { MenuRef } from './HeaderMenu'
import MenuItem from './MenuItem'
import PdfMenuItem from './PdfMenuItem'
import Svg from './base/Svg'

type RegionContentMenuProps = {
  category?: CategoryModel
  pageTitle: string | null
  fitScreen?: boolean
}

const RegionContentMenu = ({ category, pageTitle, fitScreen }: RegionContentMenuProps): ReactElement => {
  const { route, regionCode, languageCode } = useRegionContentParams()
  const { showTtsPlayer, canRead } = useContext(TtsContext)
  const { toggleTheme, dimensions } = useTheme()
  const { t } = useTranslation('layout')
  const ref = useRef<MenuRef>(null)
  const { open } = useQueryParamVisibility(FEEDBACK_QUERY_KEY)

  const showFeedback = fitScreen || (dimensions.mobile && route !== NEWS_ROUTE)
  const closeMenu = ref.current?.closeMenu

  const items = [
    route === CATEGORIES_ROUTE ? (
      <PdfMenuItem
        key='pdf'
        category={category}
        regionCode={regionCode}
        languageCode={languageCode}
        closeMenu={closeMenu}
      />
    ) : null,
    showFeedback ? (
      <MenuItem
        key='feedback'
        text={t('feedback')}
        icon={<CommentIcon fontSize='small' />}
        onClick={open}
        closeMenu={closeMenu}
      />
    ) : null,
    <MenuItem key='theme' text={t('contrastTheme')} icon={<ContrastIcon fontSize='small' />} onClick={toggleTheme} />,
    <MenuItem
      key='tts'
      icon={<Svg src={ReadAloudIcon} width={20} height={20} />}
      disabled={!canRead}
      text={t('readAloud')}
      tooltip={canRead ? null : t('nothingToReadFullMessage')}
      onClick={showTtsPlayer}
      closeMenu={closeMenu}
    />,
  ]

  return (
    <HeaderMenu pageTitle={pageTitle} fitScreen={fitScreen} ref={ref}>
      {items}
    </HeaderMenu>
  )
}

export default RegionContentMenu
