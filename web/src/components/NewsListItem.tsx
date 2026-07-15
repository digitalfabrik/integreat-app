import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getExcerpt, NEWS_ROUTE, parseHTML, pathnameFromRouteInformation } from 'shared'
import { NewsModel } from 'shared/api'

import { EXCERPT_MAX_CHARS } from '../constants'
import LastUpdateInfo from './LastUpdateInfo'
import NewsSourceChip from './NewsSourceChip'
import Link from './base/Link'

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  justifyContent: 'space-between',
  gap: 32,

  [theme.breakpoints.down('sm')]: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 8,
  },
})) as typeof ListItemButton

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    gridColumn: '1/3',
  },
}))

const StyledStack = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'contents',
  },
}))

type NewsListItemProps = {
  news: NewsModel
  regionCode: string
  languageCode: string
}

const NewsListItem = ({ news, regionCode, languageCode }: NewsListItemProps): ReactElement => {
  const { t } = useTranslation('news')
  const excerpt = getExcerpt(parseHTML(news.content), { maxChars: EXCERPT_MAX_CHARS, replaceLineBreaks: false })

  return (
    <ListItem disablePadding>
      <StyledListItemButton
        component={Link}
        to={pathnameFromRouteInformation({ route: NEWS_ROUTE, regionCode, languageCode, id: news.id })}>
        <StyledStack maxWidth='100%' width='100%'>
          <StyledListItemText
            slotProps={{ primary: { component: 'h2' } }}
            primary={
              <Stack direction='row' alignItems='center' justifyContent='space-between' gap={2}>
                {news.title}
                <NewsSourceChip source={news.source} />
              </Stack>
            }
            secondary={excerpt}
          />
          <LastUpdateInfo lastUpdate={news.lastUpdate} withText={false} />
        </StyledStack>
        <Typography color='primary' variant='button'>
          {t('common:more')}
        </Typography>
      </StyledListItemButton>
    </ListItem>
  )
}

export default NewsListItem
