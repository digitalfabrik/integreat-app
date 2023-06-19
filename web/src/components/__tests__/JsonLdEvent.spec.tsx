import { DateTime } from 'luxon'

import { DateModel, EventModel, FeaturedImageModel, LocationModel } from 'api-client'
import DateFormatter from 'api-client/src/i18n/DateFormatter'

import { createJsonLd } from '../JsonLdEvent'

describe('JsonLdEvent', () => {
  it('should create correct json-ld', () => {
    const dateModel = new DateModel({
      startDate: DateTime.fromISO('2017-W33-4T06:45:32.343'),
      endDate: DateTime.fromISO('2017-W33-5T07:45:32.343'),
      allDay: false,
    })
    const locationModel = new LocationModel({
      id: 1,
      name: 'Café Tür an Tür',
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      postcode: '86153',
      country: 'DE',
      latitude: null,
      longitude: null,
    })
    const eventModel = new EventModel({
      path: '/events/event0',
      title: 'Sample Event',
      content: 'hi',
      thumbnail: '/img/thm.jpg',
      date: dateModel,
      location: locationModel,
      excerpt: 'This is a sample event. Have fun sampling.',
      availableLanguages: new Map([]),
      lastUpdate: DateTime.fromISO('2017-W33-4T04:45:32.343'),
      featuredImage: new FeaturedImageModel({
        description: 'whoohoo',
        thumbnail: {
          url: '/thumbnail.jpg',
          width: 10,
          height: 10,
        },
        medium: {
          url: '/medium.jpg',
          width: 20,
          height: 20,
        },
        large: {
          url: '/medium.jpg',
          width: 30,
          height: 30,
        },
        full: {
          url: '/full.jpg',
          width: 40,
          height: 40,
        },
      }),
    })
    const formatter = new DateFormatter('en')
    expect(createJsonLd(eventModel, formatter)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Sample Event',
      startDate: 'August 17, 2017',
      eventStatus: 'https://schema.org/EventScheduled',
      description: 'This is a sample event. Have fun sampling.',
      location: {
        '@type': 'Place',
        name: 'Café Tür an Tür',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Wertachstr. 29',
          addressLocality: 'Augsburg',
          postalCode: '86153',
          addressCountry: 'DE',
        },
      },
      endDate: '2017-08-18T05:45:32.343Z',
      image: ['/thumbnail.jpg', '/medium.jpg', '/medium.jpg', '/full.jpg'],
    })
  })
})
