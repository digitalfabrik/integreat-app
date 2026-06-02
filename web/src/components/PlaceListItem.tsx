import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { PlaceModel } from 'shared/api'

import Link from './base/Link'

const StyledListItemButton = styled(ListItemButton)`
  align-items: flex-start;
  gap: ${props => props.theme.spacing(2)};
  padding: 12px 16px;
  min-height: 80px;
` as typeof ListItemButton

const StyledListItemText = styled(ListItemText)`
  min-width: 1px;
  overflow-wrap: break-word;
  hyphens: auto;
`

const StyledText = styled('p')({
  margin: 0,
})

type PlaceListItemProps = {
  place: PlaceModel
  onClick?: () => void
  distance: number | null
}

const PlaceListItem = ({ place, distance, onClick }: PlaceListItemProps): ReactElement => {
  const { t } = useTranslation('places')
  const [queryParams] = useSearchParams()
  const { title, category, slug } = place
  const slugWithQuery = `${slug}?${queryParams}`

  return (
    <ListItem disablePadding>
      <StyledListItemButton onClick={onClick} id={slug} to={slugWithQuery} component={Link} aria-label={title}>
        <StyledListItemText
          slotProps={{ primary: { component: 'h2' }, secondary: { component: 'div' } }}
          primary={title}
          secondary={
            <>
              {distance !== null && (
                <StyledText>{t('distanceKilometre', { distance: distance.toFixed(1) })}</StyledText>
              )}
              <StyledText>{category.name}</StyledText>
            </>
          }
        />
      </StyledListItemButton>
    </ListItem>
  )
}

export default PlaceListItem
