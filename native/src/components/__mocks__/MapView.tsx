import React, { ReactElement, ReactNode } from 'react'

import { MapFeature } from 'shared'

import TextButton from '../base/TextButton'

const MockMapView = ({
  features,
  selectFeature,
  Overlay,
}: {
  features: MapFeature[]
  selectFeature: (feature: MapFeature | null) => void
  Overlay: ReactNode
}): ReactElement => (
  <>
    {features.map(feature => {
      const title =
        feature.properties.pois.length === 1 ? feature.properties.pois[0]?.title : feature.id?.toString() ?? 'null'
      return <TextButton key={title} onPress={() => selectFeature(feature)} text={`Feature-${title}`} />
    })}
    <TextButton onPress={() => selectFeature(null)} text='Map Press' />
    {Overlay}
  </>
)

export default MockMapView
