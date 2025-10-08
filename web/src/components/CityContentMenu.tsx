import CommentIcon from '@mui/icons-material/CommentOutlined'
import ContrastIcon from '@mui/icons-material/Contrast'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement, useContext, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NEWS_ROUTE, CATEGORIES_ROUTE } from 'shared'
import { CategoryModel, FeedbackRouteType } from 'shared/api'

import { ReadAloudIcon } from '../assets'
import useCityContentParams from '../hooks/useCityContentParams'
import FeedbackContainer from './FeedbackContainer'
import HeaderMenu, { MenuRef } from './HeaderMenu'
import MenuItem from './MenuItem'
import PdfMenuItem from './PdfMenuItem'
import { TtsContext } from './TtsContainer'
import Dialog from './base/Dialog'
import Icon from './base/Icon'

const StyledLegacyIcon = styled(Icon)({
  color: 'inherit',
  width: 20,
  height: 20,
})

type CityContentMenuProps = {
  slug?: string
  category?: CategoryModel
  pageTitle: string | null
}

const CityContentMenu = ({ slug, category, pageTitle }: CityContentMenuProps): ReactElement => {
  const { route, cityCode, languageCode } = useCityContentParams()
  const { enabled: ttsEnabled, showTtsPlayer, canRead } = useContext(TtsContext)
  const { toggleTheme, dimensions } = useTheme()
  const { t } = useTranslation('layout')
  const ref = useRef<MenuRef>(null)

  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const items = [
    route === CATEGORIES_ROUTE && (
      <PdfMenuItem
        key='pdf'
        category={category}
        cityCode={cityCode}
        languageCode={languageCode}
        closeMenu={ref.current?.closeMenu}
      />
    ),
    dimensions.mobile && route !== NEWS_ROUTE && (
      <MenuItem
        key='feedback'
        text={t('feedback')}
        icon={<CommentIcon fontSize='small' />}
        onClick={() => setFeedbackOpen(true)}
        closeMenu={ref.current?.closeMenu}
      />
    ),
    <MenuItem key='theme' text={t('contrastTheme')} icon={<ContrastIcon fontSize='small' />} onClick={toggleTheme} />,
    ttsEnabled && (
      <MenuItem
        key='tts'
        icon={<StyledLegacyIcon src={ReadAloudIcon} />}
        disabled={!canRead}
        text={t('readAloud')}
        tooltip={canRead ? null : t('nothingToReadFullMessage')}
        onClick={showTtsPlayer}
        closeMenu={ref.current?.closeMenu}
      />
    ),
  ].filter((it): it is ReactElement => Boolean(it))

  return (
    <>
      <HeaderMenu pageTitle={pageTitle} ref={ref}>
        {items}
      </HeaderMenu>
      {feedbackOpen && (
        <Dialog
          title={feedbackSubmitted ? t('feedback:thanksHeadline') : t('feedback:headline')}
          close={() => setFeedbackOpen(false)}>
          <FeedbackContainer
            onSubmit={() => setFeedbackSubmitted(true)}
            routeType={route as FeedbackRouteType}
            cityCode={cityCode}
            language={languageCode}
            slug={slug}
            initialRating={null}
          />
        </Dialog>
      )}
    </>
  )
}

export default CityContentMenu
