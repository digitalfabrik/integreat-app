import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson'

export const embedInCollection = (
  features: Feature<Point, GeoJsonProperties>[]
): FeatureCollection<Point, GeoJsonProperties> => {
  return {
    type: 'FeatureCollection',
    features
  }
}
