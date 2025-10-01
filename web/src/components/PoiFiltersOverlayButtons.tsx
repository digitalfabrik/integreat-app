import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PoiCategoryModel } from 'shared/api'

import ChipButton from './base/ChipButton'

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
      <ChipButton
        text={t('adjustFilters')}
        icon={EditLocationOutlinedIcon}
        onClick={() => setShowFilterSelection(true)}
      />
      {currentlyOpenFilter && (
        <ChipButton
          text={t('opened')}
          label={t('clearFilter', { filter: t('opened') })}
          icon={AccessTimeIcon}
          onClick={() => setCurrentlyOpenFilter(false)}
          closeButton
        />
      )}
      {!!poiCategory && (
        <ChipButton
          text={poiCategory.name}
          label={t('clearFilter', { filter: poiCategory.name })}
          icon={poiCategory.icon}
          onClick={() => setPoiCategoryFilter(null)}
          closeButton
        />
      )}
    </>
  )
}

export default PoiFiltersOverlayButtons
