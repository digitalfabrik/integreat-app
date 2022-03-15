import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheetRef } from 'react-spring-bottom-sheet'

import { PoiFeature } from 'api-client'

import BottomActionSheet from './BottomActionSheet'

type PoisMobileProps = {
  mapView: ReactElement | null
  currentFeature: PoiFeature | null
  poiList: ReactElement
  toolbar: ReactElement
}

const PoisMobile = React.forwardRef(
  ({ mapView, currentFeature, toolbar, poiList }: PoisMobileProps, ref: React.Ref<BottomSheetRef>): ReactElement => {
    const { t } = useTranslation('pois')
    return (
      <>
        {mapView}
        <BottomActionSheet title={currentFeature?.properties.title || t('listTitle')} toolbar={toolbar} ref={ref}>
          {!currentFeature && poiList}
        </BottomActionSheet>
      </>
    )
  }
)

export default PoisMobile
