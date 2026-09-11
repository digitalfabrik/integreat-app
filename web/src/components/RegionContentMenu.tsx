import CommentIcon from '@mui/icons-material/CommentOutlined'
import ContrastIcon from '@mui/icons-material/Contrast'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined'
import { useTheme } from '@mui/material/styles'
import React, { ReactElement, useContext, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'

import { NEWS_ROUTE, CATEGORIES_ROUTE, FEEDBACK_QUERY_KEY, regionContentPath } from 'shared'
import { CategoryModel } from 'shared/api'

import { ReadAloudIcon } from '../assets'
import { TtsContext } from '../contexts/TtsContext'
import useLocalStorage, { TOUR_DIALOG_VISIBLE_STORAGE_KEY } from '../hooks/useLocalStorage'
import useQueryParam from '../hooks/useQueryParam'
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
  const [_, setFeedbackQueryParam] = useQueryParam(FEEDBACK_QUERY_KEY)
  const [, setTourDialogVisible] = useLocalStorage({
    key: TOUR_DIALOG_VISIBLE_STORAGE_KEY,
    initialValue: true,
  })
  const { route, regionCode, languageCode } = useRegionContentParams()
  const { showTtsPlayer, canRead } = useContext(TtsContext)
  const { toggleTheme, dimensions } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const ref = useRef<MenuRef>(null)
  const homePath = regionContentPath({ regionCode, languageCode })

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
        text={t($ => $.layout.feedback)}
        icon={<CommentIcon fontSize='small' />}
        onClick={() => setFeedbackQueryParam(true)}
        closeMenu={closeMenu}
      />
    ) : null,
    <MenuItem
      key='theme'
      text={t($ => $.layout.contrastTheme)}
      icon={<ContrastIcon fontSize='small' />}
      onClick={toggleTheme}
    />,
    <MenuItem
      key='tts'
      icon={<Svg src={ReadAloudIcon} width={20} height={20} />}
      disabled={!canRead}
      text={t($ => $.layout.readAloud)}
      tooltip={canRead ? null : t($ => $.layout.nothingToReadFullMessage)}
      onClick={showTtsPlayer}
      closeMenu={closeMenu}
    />,
    <MenuItem
      key='tour'
      text={t($ => $.tour.startTour)}
      icon={<HelpOutlineIcon fontSize='small' />}
      onClick={() => {
        setTourDialogVisible(true)
        if (pathname === homePath) {
          window.location.reload()
          return
        }
        navigate(homePath)
      }}
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
