import Button from '@mui/material/Button'
import React, { ReactElement, ReactNode } from 'react'

import { MapFeature } from 'shared'

const MockMapView = ({
  features,
  selectFeature,
  overlay,
}: {
  features: MapFeature[]
  selectFeature: (feature: MapFeature | null) => void
  overlay: ReactNode
}): ReactElement => (
  <>
    {features.map(feature => {
      const title =
        feature.properties.places.length === 1
          ? feature.properties.places[0]?.title
          : (feature.id?.toString() ?? 'null')
      return (
        <Button key={title} onClick={() => selectFeature(feature)}>
          Feature-{title}
        </Button>
      )
    })}
    <Button onClick={() => selectFeature(null)}>Map Press</Button>
    {overlay}
  </>
)

export default MockMapView
