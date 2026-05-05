import distance from '@turf/distance'

import RegionModel from '../api/models/RegionModel'
import { LocationType } from '../constants/maps'

const NUMBER_OF_CLOSEST_REGIONS = 3
const MAXIMAL_DISTANCE = 90

const distanceToRegion = (userLocation: LocationType, regionModel: RegionModel): number => {
  const coordinates = [
    {
      longitude: regionModel.longitude,
      latitude: regionModel.latitude,
    },
    ...Object.values(regionModel.aliases ?? {}),
  ]
  return Math.min(...coordinates.map(it => distance(userLocation, [it.longitude, it.latitude])))
}

const getNearbyRegions = (userLocation: LocationType, regions: RegionModel[]): RegionModel[] =>
  regions
    .filter(it => distanceToRegion(userLocation, it) < MAXIMAL_DISTANCE)
    .sort((a: RegionModel, b: RegionModel) => distanceToRegion(userLocation, a) - distanceToRegion(userLocation, b))
    .slice(0, NUMBER_OF_CLOSEST_REGIONS)

export default getNearbyRegions
