import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined'
import Chip from '@mui/material/Chip'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PoiCategoryModel } from 'shared/api'

import Icon from './base/Icon'

type PoiFiltersOverlayButtonsProps = {
  currentlyOpenFilter: boolean
  poiCategory: PoiCategoryModel | undefined
  setShowFilterSelection: (show: boolean) => void
  setCurrentlyOpenFilter: (open: boolean) => void
  setPoiCategoryFilter: (poiCategory: PoiCategoryModel | null) => void
}

const PoiFiltersOverlayButtons = ({
  currentlyOpenFilter,
  poiCategory,
  setCurrentlyOpenFilter,
  setPoiCategoryFilter,
  setShowFilterSelection,
}: PoiFiltersOverlayButtonsProps): ReactElement => {
  const { t } = useTranslation('pois')
  return (
    <>
      <Chip
        label={t('adjustFilters')}
        icon={<EditLocationOutlinedIcon />}
        onClick={() => setShowFilterSelection(true)}
        clickable
      />
      {currentlyOpenFilter && (
        <Chip
          label={t('opened')}
          icon={<AccessTimeIcon />}
          onDelete={() => setCurrentlyOpenFilter(false)}
          onClick={() => setCurrentlyOpenFilter(false)}
          clickable
        />
      )}
      {!!poiCategory && (
        <Chip
          label={poiCategory.name}
          icon={<Icon src={poiCategory.icon} />}
          onClick={() => setPoiCategoryFilter(null)}
          onDelete={() => setPoiCategoryFilter(null)}
          clickable
        />
      )}
    </>
  )
}

export default PoiFiltersOverlayButtons
