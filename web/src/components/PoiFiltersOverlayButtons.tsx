import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PoiCategoryModel } from 'shared/api'

import { ClockIcon, EditLocationIcon } from '../assets'
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
        text={t('adjustFilters')}
        icon={EditLocationIcon}
        onClick={() => setShowFilterSelection(!poiFiltersShown)}
      />
      {currentlyOpenFilter && (
        <ChipButton
          text={t('opened')}
          ariaLabel={t('clearFilter', { filter: t('opened') })}
          icon={ClockIcon}
          onClick={() => setCurrentlyOpenFilter(false)}
          closeButton
        />
      )}
      {!!poiCategory && (
        <ChipButton
          text={poiCategory.name}
          ariaLabel={t('clearFilter', { filter: poiCategory.name })}
          icon={poiCategory.icon}
          onClick={() => setPoiCategoryFilter(null)}
          closeButton
        />
      )}
    </>
  )
}

export default PoiFiltersOverlayButtons
