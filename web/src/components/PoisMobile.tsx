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
  direction: UiDirectionType
  setBottomActionSheetHeight: (height: number) => void
  isBottomSheetFullscreen: boolean
  restoreScrollPosition: boolean
}

const PoisMobile = React.forwardRef(
  (
    {
      mapView,
      currentFeature,
      toolbar,
      poiList,
      poi,
      direction,
      setBottomActionSheetHeight,
      isBottomSheetFullscreen,
      restoreScrollPosition,
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
          restoreScrollPosition={restoreScrollPosition}
          setBottomActionSheetHeight={setBottomActionSheetHeight}
          direction={direction}>
          {currentFeature && poi ? (
            <PoiDetails
              poi={poi}
              feature={currentFeature}
              direction={direction}
              isBottomSheetFullscreen={isBottomSheetFullscreen}
            />
          ) : (
            poiList
          )}
        </BottomActionSheet>
      </>
    )
  }
)

export default PoisMobile
