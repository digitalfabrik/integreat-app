import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PoiModel } from 'shared/api'

import { PoiThumbnailPlaceholder } from '../assets'
import Link from './base/Link'

const StyledListItemButton = styled(ListItemButton)(() => ({
  alignItems: 'flex-start',
  gap: 16,
})) as typeof ListItemButton

const StyledListItemAvatar = styled(ListItemAvatar)(() => ({
  '& .MuiAvatar-root': {
    marginTop: 8,
    width: '94px',
    height: '94px',
    borderRadius: '10px',
  },
}))

const StyledListItemText = styled(ListItemText)`
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  word-break: break-word;
  hyphens: auto;
`

const StyledTypography = styled(Typography)<TypographyProps>(() => ({
  '& p': {
    margin: 0,
  },
}))

type PoiListItemProps = {
  poi: PoiModel
  selectPoi: () => void
  distance: number | null
}

const PoiListItem = ({ poi, distance, selectPoi }: PoiListItemProps): ReactElement => {
  const { t } = useTranslation('pois')
  const { thumbnail, title, category, slug } = poi

  return (
    <>
      <ListItem disablePadding>
        <StyledListItemButton onClick={selectPoi} id={slug} to={slug} component={Link} aria-label={title}>
          <StyledListItemAvatar>
            <Avatar src={thumbnail || PoiThumbnailPlaceholder} alt='' variant='square' />
          </StyledListItemAvatar>
          <StyledListItemText
            slotProps={{
              primary: {
                component: 'div',
              },
              secondary: {
                component: 'div',
              },
            }}
            primary={
              <StyledTypography variant='title2' component='h2'>
                {title}
              </StyledTypography>
            }
            secondary={
              <StyledTypography variant='body1' component='div'>
                {distance !== null && <p>{t('distanceKilometre', { distance: distance.toFixed(1) })}</p>}
                <p>{category.name}</p>
              </StyledTypography>
            }
          />
        </StyledListItemButton>
      </ListItem>
      <Divider sx={{ '&:last-child': { display: 'none' } }} />
    </>
  )
}

export default PoiListItem
