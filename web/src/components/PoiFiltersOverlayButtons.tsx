import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PoiCategoryModel } from 'shared/api'

import ChipButton from './base/ChipButton'

type PoiFiltersOverlayButtonsProps = {
  poiFiltersShown: boolean
  currentlyOpenFilter: boolean
  poiCategory: PoiCategoryModel | undefined
  setShowFilterSelection: (show: boolean) => void
  setCurrentlyOpenFilter: (open: boolean) => void
  setPoiCategoryFilter: (poiCategory: PoiCategoryModel | null) => void
}

const PoiFiltersOverlayButtons = ({
  poiFiltersShown,
  currentlyOpenFilter,
  poiCategory,
  setCurrentlyOpenFilter,
  setPoiCategoryFilter,
  setShowFilterSelection,
}: PoiFiltersOverlayButtonsProps): ReactElement => {
  const { t } = useTranslation('pois')
  return (
    <>
      <ChipButton
        label={t('adjustFilters')}
        icon={<EditLocationOutlinedIcon />}
        onClick={() => setShowFilterSelection(!poiFiltersShown)}
      />
      {currentlyOpenFilter && (
        <ChipButton
          label={t('opened')}
          icon={<AccessTimeIcon />}
          onClick={() => setCurrentlyOpenFilter(false)}
          onDelete={() => setCurrentlyOpenFilter(false)}
        />
      )}
      {!!poiCategory && (
        <ChipButton
          label={poiCategory.name}
          icon={poiCategory.icon}
          onClick={() => setPoiCategoryFilter(null)}
          onDelete={() => setPoiCategoryFilter(null)}
        />
      )}
    </>
  )
}

export default PoiFiltersOverlayButtons
