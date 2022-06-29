import distance from '@turf/distance'

import { LocationType } from '../maps'
import CityModel from '../models/CityModel'

const NUMBER_OF_CLOSEST_CITIES = 3
const MAXIMAL_DISTANCE = 90

const distanceToCity = (userLocation: LocationType, cityModel: CityModel): number => {
  const coordinates = [
    {
      longitude: cityModel.longitude,
      latitude: cityModel.latitude
    },
    ...Object.values(cityModel.aliases ?? {})
  ]
  return Math.min(...coordinates.map(it => distance(userLocation, [it.longitude, it.latitude])))
}

const getNearbyCities = (userLocation: LocationType, cities: CityModel[]): CityModel[] =>
  cities
    .filter(it => distanceToCity(userLocation, it) < MAXIMAL_DISTANCE)
    .sort((a: CityModel, b: CityModel) => distanceToCity(userLocation, a) - distanceToCity(userLocation, b))
    .slice(0, NUMBER_OF_CLOSEST_CITIES)

export default getNearbyCities
