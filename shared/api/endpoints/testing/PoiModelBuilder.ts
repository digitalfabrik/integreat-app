import { DateTime } from 'luxon'

import ContactModel from '../../models/ContactModel'
import LocationModel from '../../models/LocationModel'
import OpeningHoursModel from '../../models/OpeningHoursModel'
import OrganizationModel from '../../models/OrganizationModel'
import PoiCategoryModel from '../../models/PoiCategoryModel'
import PoiModel from '../../models/PoiModel'

const pois = [
  new PoiModel({
    path: '/augsburg/de/locations/test',
    title: 'Test Title',
    content: 'My extremely long test content',
    thumbnail: 'test',
    availableLanguages: {
      de: '/augsburg/de/locations/test',
      en: '/augsburg/en/locations/test-translated',
    },
    excerpt: 'excerpt',
    metaDescription: 'meta',
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
      new OpeningHoursModel({
        openAllDay: true,
        closedAllDay: false,
        timeSlots: [{ end: '18:00', start: '08:00', timezone: 'Europe/Berlin' }],
        appointmentOnly: false,
      }),
    ],
    appointmentUrl: null,
    contacts: [
      new ContactModel({
        name: 'Max Mustermann',
        areaOfResponsibility: 'Welcoming',
        website: 'https://example.com',
        phoneNumber: '012345',
        email: 'test@example.com',
        mobileNumber: '017012345678',
      }),
    ],
    organization: new OrganizationModel({
      name: 'Tür an Tür',
      url: 'https://tuerantuer.de/digitalfabrik/',
      logo: 'https://integreat-test.tuerantuer.org/media/global/2024/07/1719820470_Aichach-Friedberg-Landkreis.png',
    }),
    barrierFree: true,
  }),
  new PoiModel({
    path: '/augsburg/en/locations/test_path_2',
    title: 'test title 2',
    content: 'test content 2',
    thumbnail: 'test thumbnail 2',
    availableLanguages: {
      de: '/augsburg/de/locations/test',
      en: '/augsburg/en/locations/test-translated',
    },
    excerpt: 'test excerpt 2',
    metaDescription: 'meta 2',
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
      new OpeningHoursModel({
        openAllDay: false,
        closedAllDay: false,
        timeSlots: [{ end: '18:00', start: '08:00', timezone: 'Europe/Berlin' }],
        appointmentOnly: true,
      }),
    ],
    appointmentUrl: 'https://booking.an/appointment',
    contacts: [],
    organization: null,
    barrierFree: false,
  }),
  new PoiModel({
    path: '/augsburg/en/locations/another_test_path',
    title: 'Another test title',
    content: 'another test content',
    thumbnail: 'another test thumbnail',
    availableLanguages: {
      de: '/augsburg/de/locations/test',
      en: '/augsburg/en/locations/test-translated',
    },
    excerpt: 'Another test excerpt',
    metaDescription: null,
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
    appointmentUrl: null,
    contacts: [],
    organization: null,
    barrierFree: null,
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

  build(): PoiModel[] {
    return pois.slice(0, this._poisCount)
  }
}

export default PoiModelBuilder
