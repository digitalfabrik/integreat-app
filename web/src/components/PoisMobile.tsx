import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheetRef } from 'react-spring-bottom-sheet'

import { PoiFeature, PoiModel } from 'api-client'
import { UiDirectionType } from 'translations'

import BottomActionSheet from './BottomActionSheet'
import PoiDetails from './PoiDetails'

type PoisMobileProps = {
  mapView: ReactElement | null
  currentFeature: PoiFeature | null
  poiList: ReactElement
  toolbar: ReactElement
  poi?: PoiModel
  selectFeature: (feature: PoiFeature | null) => void
  direction: UiDirectionType
  setBottomActionSheetHeight: (height: number) => void
}

const PoisMobile = React.forwardRef(
  (
    {
      mapView,
      currentFeature,
      toolbar,
      poiList,
      poi,
      selectFeature,
      direction,
      setBottomActionSheetHeight,
    }: PoisMobileProps,
    ref: React.Ref<BottomSheetRef>
  ): ReactElement => {
    const { t } = useTranslation('pois')
    return (
      <>
        {mapView}
        <BottomActionSheet
          title={!currentFeature ? t('listTitle') : undefined}
          toolbar={toolbar}
          ref={ref}
          setBottomActionSheetHeight={setBottomActionSheetHeight}
          direction={direction}>
          {currentFeature && poi ? (
            <PoiDetails poi={poi} feature={currentFeature} selectFeature={selectFeature} direction={direction} />
          ) : (
            poiList
          )}
        </BottomActionSheet>
      </>
    )
  }
)

export default PoisMobile
