import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PlaceCategoryModel } from 'shared/api'

import SpacedToggleButtonGroup from './SpacedToggleButtonGroup'
import Checkbox from './base/Checkbox'
import Dialog from './base/Dialog'
import ToggleButton, { toggleButtonWidth } from './base/ToggleButton'

const TileRow = styled(SpacedToggleButtonGroup)({
  display: 'grid',
  gap: '16px',
  justifyContent: 'center',
  gridTemplateColumns: `repeat(auto-fit, ${toggleButtonWidth}px)`,
})

type PlaceFiltersProps = {
  close: () => void
  placeCategories: PlaceCategoryModel[]
  selectedPlaceCategory: PlaceCategoryModel | undefined
  setSelectedPlaceCategory: (placeCategory: PlaceCategoryModel | null) => void
  currentlyOpenFilter: boolean
  setCurrentlyOpenFilter: (currentlyOpen: boolean) => void
  placesCount: number
}

const PlaceFilters = ({
  close,
  placeCategories,
  selectedPlaceCategory,
  setSelectedPlaceCategory,
  currentlyOpenFilter,
  setCurrentlyOpenFilter,
  placesCount,
}: PlaceFiltersProps): ReactElement => {
  const { t } = useTranslation()

  const handleFilterChange = (_: React.MouseEvent<HTMLElement>, newValue: number | null) => {
    const category = placeCategories.find(category => category.id === newValue)
    setSelectedPlaceCategory(category ?? null)
  }

  return (
    <Dialog title={t($ => $.places.filter.adjust)} close={close}>
      <Stack sx={{ gap: 3 }}>
        <Stack sx={{ width: '100%', gap: 1 }}>
          <Typography component='h3' variant='subtitle1'>
            {t($ => $.places.hours.title)}
          </Typography>
          <Stack direction='row' sx={{ alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon />
            <Checkbox
              checked={currentlyOpenFilter}
              setChecked={setCurrentlyOpenFilter}
              label={t($ => $.places.filter.onlyOpen)}
            />
          </Stack>
        </Stack>
        <Stack sx={{ width: '100%', gap: 2 }}>
          <Stack direction='row' sx={{ alignItems: 'center', gap: 1 }}>
            <Typography component='h3' variant='subtitle1'>
              {t($ => $.places.filter.categories)}
            </Typography>
            <Typography variant='subtitle2'>{t($ => $.places.filter.alphabet)}</Typography>
          </Stack>
          <TileRow
            exclusive
            value={selectedPlaceCategory?.id}
            onChange={handleFilterChange}
            aria-label={t($ => $.places.filter.categories)}>
            {placeCategories.map(it => (
              <ToggleButton key={it.id} value={it.id} text={it.name} icon={it.icon} />
            ))}
          </TileRow>
        </Stack>
        <Button onClick={close} variant='contained' disabled={placesCount === 0} fullWidth>
          {t($ => $.places.filter.show, { count: placesCount })}
        </Button>
      </Stack>
    </Dialog>
  )
}

export default PlaceFilters
