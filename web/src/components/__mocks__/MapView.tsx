import Button from '@mui/material/Button'
import React, { ReactElement, ReactNode } from 'react'

import { MapFeature } from 'shared'

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
        feature.properties.pois.length === 1 ? feature.properties.pois[0]?.title : (feature.id?.toString() ?? 'null')
      return (
        <Button key={title} onClick={() => selectFeature(feature)}>
          Feature-${title}
        </Button>
      )
    })}
    <Button onClick={() => selectFeature(null)}>Map Press</Button>
    {Overlay}
  </>
)

export default MockMapView
