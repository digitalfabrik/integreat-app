import { DateTime } from 'luxon'

import LocationModel from '../../models/LocationModel'
import OpeningHoursModel from '../../models/OpeningHoursModel'
import PoiCategoryModel from '../../models/PoiCategoryModel'
import PoiModel from '../../models/PoiModel'

const availableLanguages = new Map([
  ['de', '/augsburg/de/locations/test'],
  ['en', '/augsburg/en/locations/test-translated'],
])

const pois = [
  new PoiModel({
    path: '/augsburg/de/locations/test',
    title: 'Test Title',
    content: 'My extremely long test content',
    thumbnail: 'test',
    availableLanguages,
    excerpt: 'excerpt',
    metaDescription: 'meta',
    website: 'https://example.com',
    phoneNumber: '012345',
    email: 'test@example.com',
    category: new PoiCategoryModel({
      color: '#1DC6C6',
      iconName: 'gastronomy',
      id: 10,
      name: 'Gastronomie',
      icon: 'https://exmaple.com/icon',
    }),
    location: new LocationModel({
      id: 0,
      country: 'Test Country',
      address: 'Test Address 1',
      town: 'Test Town',
      postcode: '12345',
      longitude: 30,
      latitude: 30,
      name: 'Test Title',
    }),
    lastUpdate: DateTime.fromISO('2011-02-04T00:00:00.000Z'),
    temporarilyClosed: false,
    openingHours: [
      new OpeningHoursModel({ allDay: true, closed: false, timeSlots: [{ end: '18:00', start: '08:00' }] }),
    ],
  }),
  new PoiModel({
    path: '/augsburg/en/locations/test_path_2',
    title: 'test title 2',
    content: 'test content 2',
    thumbnail: 'test thumbnail 2',
    availableLanguages,
    excerpt: 'test excerpt 2',
    metaDescription: 'meta 2',
    website: null,
    phoneNumber: null,
    email: null,
    category: new PoiCategoryModel({
      color: '#3700D2',
      iconName: 'service',
      id: 6,
      name: 'Dienstleistung',
      icon: 'https://exmaple.com/icon',
    }),
    location: new LocationModel({
      id: 1,
      country: 'test country 2',
      address: 'test address 2',
      town: 'test town 2',
      postcode: 'test postcode 2',
      longitude: 15,
      latitude: 15,
      name: 'name 2',
    }),
    lastUpdate: DateTime.fromISO('2011-02-04T00:00:00.000Z'),
    temporarilyClosed: false,
    openingHours: [
      new OpeningHoursModel({ allDay: false, closed: false, timeSlots: [{ end: '18:00', start: '08:00' }] }),
    ],
  }),
  new PoiModel({
    path: '/augsburg/en/locations/another_test_path',
    title: 'Another test title',
    content: 'another test content',
    thumbnail: 'another test thumbnail',
    availableLanguages,
    excerpt: 'Another test excerpt',
    metaDescription: null,
    website: null,
    phoneNumber: null,
    email: null,
    category: new PoiCategoryModel({
      color: '#1DC6C6',
      iconName: 'gastronomy',
      id: 10,
      name: 'Gastronomie',
      icon: 'https://exmaple.com/icon',
    }),
    location: new LocationModel({
      id: 2,
      country: 'another test country',
      address: 'another test address',
      town: 'another test town',
      postcode: 'anothre test postcode',
      longitude: 30 + 0.00001,
      latitude: 30 - 0.00001,
      name: 'another name',
    }),
    lastUpdate: DateTime.fromISO('2011-02-04T00:00:00.000Z'),
    temporarilyClosed: false,
    openingHours: null,
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
