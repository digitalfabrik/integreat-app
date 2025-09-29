import ContrastIcon from '@mui/icons-material/Contrast'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RATING_POSITIVE, RATING_NEGATIVE, NEWS_ROUTE, CATEGORIES_ROUTE } from 'shared'
import { CategoryModel } from 'shared/api'

import { ReadAloudIcon } from '../assets'
import useCityContentParams from '../hooks/useCityContentParams'
import { RouteType } from '../routes'
import CityContentFooter from './CityContentFooter'
import FeedbackToolbarItem from './FeedbackToolbarItem'
import PdfToolbarItem from './PdfToolbarItem'
import Sidebar from './Sidebar'
import SidebarActionItem from './SidebarActionItem'
import { TtsContext } from './TtsContainer'
import Icon from './base/Icon'
import List from './base/List'

const StyledLegacyIcon = styled(Icon)({
  color: 'inherit',
})

type CityContentSidebarProps = {
  slug?: string
  category?: CategoryModel
}

const CityContentSidebar = ({ slug, category }: CityContentSidebarProps): ReactElement => {
  const { route, cityCode, languageCode } = useCityContentParams()
  const { enabled: ttsEnabled, showTtsPlayer, canRead } = useContext(TtsContext)
  const [open, setOpen] = useState(false)
  const { toggleTheme } = useTheme()
  const { t } = useTranslation('layout')

  const Items = [
    ttsEnabled && (
      <SidebarActionItem
        key='tts'
        icon={<StyledLegacyIcon src={ReadAloudIcon} />}
        disabled={!canRead}
        text={t('readAloud')}
        tooltip={canRead ? null : t('nothingToReadFullMessage')}
        onClick={() => {
          showTtsPlayer()
          setOpen(false)
        }}
      />
    ),
    <SidebarActionItem key='theme' text={t('contrastTheme')} icon={<ContrastIcon />} onClick={toggleTheme} />,
    route === CATEGORIES_ROUTE && (
      <PdfToolbarItem
        key='pdf'
        category={category}
        cityCode={cityCode}
        languageCode={languageCode}
        Component={SidebarActionItem}
      />
    ),
  ].filter((it): it is ReactElement => Boolean(it))

  const FeedbackCard = route !== NEWS_ROUTE && (
    <Card>
      <CardContent>
        <Typography textAlign='center'>{t('feedback:giveFeedback')}</Typography>
      </CardContent>
      <CardActions>
        <FeedbackToolbarItem key='positive' route={route as RouteType} slug={slug} rating={RATING_POSITIVE} />
        <FeedbackToolbarItem key='negative' route={route as RouteType} slug={slug} rating={RATING_NEGATIVE} />
      </CardActions>
    </Card>
  )

  return (
    <Sidebar
      setOpen={setOpen}
      open={open}
      Footer={<CityContentFooter city={cityCode} language={languageCode} mode='sidebar' />}>
      <Stack justifyContent='space-between' height='100%'>
        <List items={Items} />
        {FeedbackCard}
      </Stack>
    </Sidebar>
  )
}

export default CityContentSidebar
