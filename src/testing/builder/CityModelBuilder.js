// @flow

import { CityModel } from '@integreat-app/integreat-api-client'

const cities = [
  new CityModel({
    name: 'Stadt Augsburg',
    code: 'augsburg',
    live: true,
    eventsEnabled: true,
    extrasEnabled: true,
    sortingName: 'Augsburg',
    prefix: 'Stadt'
  }),
  new CityModel({
    name: 'Oldtown',
    code: 'oldtown',
    live: false,
    eventsEnabled: true,
    extrasEnabled: true,
    sortingName: 'Oldtown',
    prefix: 'GoT'
  })
]

class CityModelBuilder {
  _citiesCount: number

  constructor (citiesCount: number) {
    if (this._citiesCount > cities.length) {
      throw new Error(`Only ${cities.length} city models can be created`)
    }
    this._citiesCount = citiesCount
  }

  build (): Array<CityModel> {
    return cities.slice(0, this._citiesCount)
  }
}

export default CityModelBuilder
