import { Feature, FeatureCollection, Point } from 'geojson'

import { GeoJsonPoiProperties } from '../maps'

export const embedInCollection = (
  features: Feature<Point, GeoJsonPoiProperties>[]
): FeatureCollection<Point, GeoJsonPoiProperties> => {
  return {
    type: 'FeatureCollection',
    features
  }
}
