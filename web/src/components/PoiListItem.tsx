import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PoiModel } from 'shared/api'

import Link from './base/Link'

const StyledListItemButton = styled(ListItemButton)`
  align-items: flex-start;
  gap: ${props => props.theme.spacing(2)};
  padding: 12px 16px;
  min-height: 80px;
` as typeof ListItemButton

const StyledListItemText = styled(ListItemText)`
  min-width: 1px;
  word-break: break-word;
  hyphens: auto;
`

const StyledText = styled('p')({
  margin: 0,
})

type PoiListItemProps = {
  poi: PoiModel
  selectPoi: () => void
  distance: number | null
}

const PoiListItem = ({ poi, distance, selectPoi }: PoiListItemProps): ReactElement => {
  const { t } = useTranslation('pois')
  const { title, category, slug } = poi

  return (
    <ListItem disablePadding>
      <StyledListItemButton onClick={selectPoi} id={slug} to={slug} component={Link} aria-label={title}>
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

export default PoiListItem
