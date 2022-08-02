import moment from 'moment'

import LocationModel from '../models/LocationModel'
import PoiModel from '../models/PoiModel'

const availableLanguages = new Map([
  ['de', '/augsburg/de/locations/test'],
  ['en', '/en/test'],
])

const pois = [
  new PoiModel({
    path: '/augsburg/de/locations/test',
    title: 'Test Title',
    content: 'My extremely long test content',
    thumbnail: 'test',
    availableLanguages,
    excerpt: 'excerpt',
    website: 'https://example.com',
    phoneNumber: '012345',
    email: 'test@example.com',
    location: new LocationModel({
      id: 1,
      country: 'Test Country',
      address: 'Test Address 1',
      town: 'Test Town',
      postcode: '12345',
      latitude: 29.979848,
      longitude: 31.133859,
      name: 'Test Title',
    }),
    lastUpdate: moment('2011-02-04T00:00:00.000Z'),
  }),
  new PoiModel({
    path: '/augsburg/en/locations/test_path_2',
    title: 'test title 2',
    content: 'test content 2',
    thumbnail: 'test thumbnail 2',
    availableLanguages,
    excerpt: 'test excerpt 2',
    website: null,
    phoneNumber: null,
    email: null,
    location: new LocationModel({
      id: 1,
      country: 'test country 2',
      address: 'test address 2',
      town: 'test town 2',
      postcode: 'test postcode 2',
      latitude: 15,
      longitude: 15,
      name: 'name 2',
    }),
    lastUpdate: moment('2011-02-04T00:00:00.000Z'),
  }),
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
