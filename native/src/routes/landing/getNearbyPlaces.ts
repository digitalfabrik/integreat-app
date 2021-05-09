// @flow

import { CityModel } from 'api-client'

const NUMBER_OF_CLOSEST_CITIES = 3
const MAXIMAL_DISTANCE = 90

const degreesToRadians = (deg: number): number => {
  const degreesSemicircle = 180
  return (Math.PI * deg) / degreesSemicircle
}

const calculateDistance = (longitude0: number, latitude0: number, longitude1: number, latitude1: number): number => {
  const earthRadius = 6371
  return (
    Math.acos(
      Math.cos(longitude0) * Math.cos(longitude1) * Math.cos(latitude0 - latitude1) +
        Math.sin(longitude1) * Math.sin(longitude0)
    ) * earthRadius
  )
}

const currentDistance = (cityModel: CityModel, longitude: number, latitude: number) => {
  const cityLongitude = cityModel.longitude
  const cityLatitude = cityModel.latitude
  if (cityLongitude === null || cityLatitude === null) {
    return Infinity
  }
  const longitude0 = degreesToRadians(longitude)
  const latitude0 = degreesToRadians(latitude)
  type CoordinatesType = {| longitude: number, latitude: number |}
  // $FlowFixMe https://github.com/facebook/flow/issues/2221
  const coordinates: Array<CoordinatesType> = Object.values(cityModel.aliases || {})
  coordinates.push({ longitude: cityLongitude, latitude: cityLatitude })
  const distances: Array<number> = coordinates.map((coords: CoordinatesType) => {
    const longitude1 = degreesToRadians(coords.longitude)
    const latitude1 = degreesToRadians(coords.latitude)
    return calculateDistance(longitude0, latitude0, longitude1, latitude1)
  })
  return Math.min(...distances)
}

const compareDistance = (cityModelA: CityModel, cityModelB: CityModel, longitude: number, latitude: number) => {
  const d0 = currentDistance(cityModelA, longitude, latitude)
  const d1 = currentDistance(cityModelB, longitude, latitude)
  return d0 - d1
}

const getNearbyPlaces = (cities: Array<CityModel>, longitude: number, latitude: number): Array<CityModel> => {
  return cities
    .sort((a: CityModel, b: CityModel) => compareDistance(a, b, longitude, latitude))
    .slice(0, NUMBER_OF_CLOSEST_CITIES)
    .filter(_city => currentDistance(_city, longitude, latitude) < MAXIMAL_DISTANCE)
}

export default getNearbyPlaces
