import moment from 'moment'

import LocationModel from '../models/LocationModel'
import PoiModel from '../models/PoiModel'

const availableLanguages = new Map([
  ['de', '/de/test'],
  ['en', '/en/test']
])

const pois = [
  new PoiModel({
    path: 'test',
    title: 'test',
    content: 'test',
    thumbnail: 'test',
    availableLanguages: availableLanguages,
    excerpt: 'test',
    location: new LocationModel({
      id: 1,
      country: 'country',
      region: 'region',
      state: 'state',
      address: 'address',
      town: 'town',
      postcode: 'postcode',
      latitude: '15',
      longitude: '15',
      name: 'name'
    }),
    lastUpdate: moment('2011-02-04T00:00:00.000Z'),
    hash: 'test'
  }),
  new PoiModel({
    path: '/augsburg/en/locations/test_path_2',
    title: 'test title 2',
    content: 'test content 2',
    thumbnail: 'test thumbnail 2',
    availableLanguages: availableLanguages,
    excerpt: 'test excerpt 2',
    location: new LocationModel({
      id: 1,
      country: 'test country 2',
      region: 'test region 2',
      state: 'test state 2',
      address: 'test address 2',
      town: 'test town 2',
      postcode: 'test postcode 2',
      latitude: '15',
      longitude: '15',
      name: 'name'
    }),
    lastUpdate: moment('2011-02-04T00:00:00.000Z'),
    hash: 'test hash'
  })
]

class PoiModelBuilder {
  _poisCount: number

  constructor(poisCount: number) {
    this._poisCount = poisCount

    if (this._poisCount > pois.length) {
      throw new Error(`Only ${pois.length} poi models can be created`)
    }
  }

  build(): Array<PoiModel> {
    return pois.slice(0, this._poisCount)
  }
}

export default PoiModelBuilder
