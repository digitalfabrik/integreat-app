import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PoiCategoryModel } from 'shared/api'

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

type PoiFiltersProps = {
  close: () => void
  poiCategories: PoiCategoryModel[]
  selectedPoiCategory: PoiCategoryModel | undefined
  setSelectedPoiCategory: (poiCategory: PoiCategoryModel | null) => void
  currentlyOpenFilter: boolean
  setCurrentlyOpenFilter: (currentlyOpen: boolean) => void
  poisCount: number
}

const PoiFilters = ({
  close,
  poiCategories,
  selectedPoiCategory,
  setSelectedPoiCategory,
  currentlyOpenFilter,
  setCurrentlyOpenFilter,
  poisCount,
}: PoiFiltersProps): ReactElement => {
  const { t } = useTranslation('pois')

  const handleFilterChange = (_: React.MouseEvent<HTMLElement>, newValue: number | null) => {
    const category = poiCategories.find(category => category.id === newValue)
    setSelectedPoiCategory(category ?? null)
  }

  return (
    <Dialog title={t('adjustFilters')} close={close}>
      <Stack gap={3}>
        <Stack width='100%' gap={1}>
          <Typography component='h3' variant='title3'>
            {t('openingHours')}
          </Typography>
          <Stack direction='row' alignItems='center' gap={1}>
            <AccessTimeIcon />
            <Checkbox
              checked={currentlyOpenFilter}
              setChecked={setCurrentlyOpenFilter}
              label={t('onlyCurrentlyOpen')}
            />
          </Stack>
        </Stack>
        <Stack width='100%' gap={2}>
          <Stack direction='row' alignItems='center' gap={1}>
            <Typography component='h3' variant='title3'>
              {t('poiCategories')}
            </Typography>
            <Typography variant='label3'>{t('alphabetLetters')}</Typography>
          </Stack>
          <TileRow exclusive value={selectedPoiCategory?.id} onChange={handleFilterChange}>
            {poiCategories.map(it => (
              <ToggleButton key={it.id} value={it.id} text={it.name} icon={it.icon} />
            ))}
          </TileRow>
        </Stack>
        <Button onClick={close} variant='contained' disabled={poisCount === 0} fullWidth>
          {t('showPois', { count: poisCount })}
        </Button>
      </Stack>
    </Dialog>
  )
}

export default PoiFilters
