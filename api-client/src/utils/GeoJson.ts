import { Feature, FeatureCollection } from 'geojson'
import LocationModel from '../models/LocationModel'

export const convertToPoint = (location: LocationModel): Feature => {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [Number(location.longitude), Number(location.latitude)]
    },
    properties: {
      name: location._name
    }
  }
}

export const embedInCollection = (features: Feature[]): FeatureCollection => {
  return {
    type: 'FeatureCollection',
    features
  }
}
