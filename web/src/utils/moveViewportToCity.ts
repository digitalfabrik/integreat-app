import WebMercatorViewport from '@math.gl/web-mercator'

import { defaultMercatorViewportConfig, MapViewMercatorViewport } from 'shared'
import { CityModel } from 'shared/api'

const moveViewportToCity = (city: CityModel, zoom: number | undefined): MapViewMercatorViewport => {
  const mercatorViewport = new WebMercatorViewport(defaultMercatorViewportConfig)
  const boundingBox = city.boundingBox
  const viewport = mercatorViewport.fitBounds([
    [boundingBox[0], boundingBox[1]],
    [boundingBox[2], boundingBox[3]],
  ])
  return { ...viewport, zoom: zoom ?? viewport.zoom }
}

export default moveViewportToCity
