import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined'
import Chip from '@mui/material/Chip'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PlaceCategoryModel } from 'shared/api'

import Svg from './base/Svg'

type PlaceFiltersOverlayButtonsProps = {
  currentlyOpenFilter: boolean
  placeCategory: PlaceCategoryModel | undefined
  setShowFilterSelection: (show: boolean) => void
  setCurrentlyOpenFilter: (open: boolean) => void
  setPlaceCategoryFilter: (placeCategory: PlaceCategoryModel | null) => void
}

const PlaceFiltersOverlayButtons = ({
  currentlyOpenFilter,
  placeCategory,
  setCurrentlyOpenFilter,
  setPlaceCategoryFilter,
  setShowFilterSelection,
}: PlaceFiltersOverlayButtonsProps): ReactElement => {
  const { t } = useTranslation('places')
  return (
    <>
      <Chip
        label={t('adjustFilters')}
        icon={<EditLocationOutlinedIcon />}
        onClick={() => setShowFilterSelection(true)}
        variant='outlined'
        clickable
      />
      {currentlyOpenFilter && (
        <Chip
          label={t('opened')}
          icon={<AccessTimeIcon />}
          onDelete={() => setCurrentlyOpenFilter(false)}
          onClick={() => setCurrentlyOpenFilter(false)}
          variant='outlined'
          clickable
        />
      )}
      {!!placeCategory && (
        <Chip
          label={placeCategory.name}
          icon={<Svg src={placeCategory.icon} />}
          onClick={() => setPlaceCategoryFilter(null)}
          onDelete={() => setPlaceCategoryFilter(null)}
          variant='outlined'
          clickable
        />
      )}
    </>
  )
}

export default PlaceFiltersOverlayButtons
