import moment from 'moment'
import PoiModel from '../models/PoiModel'
import LocationModel from '../models/LocationModel'
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
    path: 'test',
    title: 'test',
    content: 'test',
    thumbnail: 'test',
    availableLanguages: availableLanguages,
    excerpt: 'test',
    location: new LocationModel({
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
  })
]

class PoiModelBuilder {
  _poisCount: number

  constructor(poisCount: number) {
    if (this._poisCount > pois.length) {
      throw new Error(`Only ${pois.length} poi models can be created`)
    }

    this._poisCount = poisCount
  }

  build(): Array<PoiModel> {
    return pois.slice(0, this._poisCount)
  }
}

export default PoiModelBuilder
