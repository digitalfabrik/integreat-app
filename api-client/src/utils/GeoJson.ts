import { Feature, FeatureCollection } from 'geojson'

export const embedInCollection = (features: Feature[]): FeatureCollection => {
  return {
    type: 'FeatureCollection',
    features
  }
}
