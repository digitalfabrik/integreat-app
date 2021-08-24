import { Feature, FeatureCollection, Point } from 'geojson'

export const embedInCollection = (features: Feature<Point>[]): FeatureCollection<Point> => {
  return {
    type: 'FeatureCollection',
    features
  }
}
