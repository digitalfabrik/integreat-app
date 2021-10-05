import { PoiFeature, PoiFeatureCollection } from '../maps'

export const embedInCollection = (features: PoiFeature[]): PoiFeatureCollection => {
  return {
    type: 'FeatureCollection',
    features
  }
}
