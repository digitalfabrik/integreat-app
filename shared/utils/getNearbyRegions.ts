import distance from '@turf/distance'

import RegionModel from '../api/models/RegionModel'
import { LocationType } from '../constants/maps'

const NUMBER_OF_CLOSEST_CITIES = 3
const MAXIMAL_DISTANCE = 90

const distanceToCity = (userLocation: LocationType, cityModel: RegionModel): number => {
  const coordinates = [
    {
      longitude: cityModel.longitude,
      latitude: cityModel.latitude,
    },
    ...Object.values(cityModel.aliases ?? {}),
  ]
  return Math.min(...coordinates.map(it => distance(userLocation, [it.longitude, it.latitude])))
}

const getNearbyRegions = (userLocation: LocationType, cities: RegionModel[]): RegionModel[] =>
  cities
    .filter(it => distanceToCity(userLocation, it) < MAXIMAL_DISTANCE)
    .sort((a: RegionModel, b: RegionModel) => distanceToCity(userLocation, a) - distanceToCity(userLocation, b))
    .slice(0, NUMBER_OF_CLOSEST_CITIES)

export default getNearbyRegions
