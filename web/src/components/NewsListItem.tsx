import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getExcerpt } from 'shared'

import { EXCERPT_MAX_CHARS } from '../constants'
import LastUpdateInfo from './LastUpdateInfo'
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

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',

  [theme.breakpoints.down('sm')]: {
    padding: 0,
    width: 'fit-content',
  },
}))

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
  title: string
  content: string
  timestamp: DateTime
  to: string
}

const NewsListItem = ({ title, content, timestamp, to }: NewsListItemProps): ReactElement => {
  const { t } = useTranslation('news')
  const excerpt = getExcerpt(content, { maxChars: EXCERPT_MAX_CHARS, replaceLineBreaks: false })

  return (
    <ListItem disablePadding>
      <StyledListItemButton component={Link} to={to}>
        <StyledStack maxWidth='100%'>
          <StyledListItemText slotProps={{ primary: { component: 'h2' } }} primary={title} secondary={excerpt} />
          <LastUpdateInfo lastUpdate={timestamp} withText={false} />
        </StyledStack>
        <StyledButton disableRipple>{t('common:more')}</StyledButton>
      </StyledListItemButton>
    </ListItem>
  )
}

export default NewsListItem
