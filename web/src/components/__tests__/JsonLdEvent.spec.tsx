import { DateTime } from 'luxon'

import { DateModel, EventModel, FeaturedImageModel, LocationModel } from 'shared/api'

import { createJsonLd } from '../JsonLdEvent'

describe('JsonLdEvent', () => {
  it('should create correct json-ld', () => {
    const dateModel = new DateModel({
      startDate: DateTime.fromISO('2017-11-18T09:30:00.000Z'),
      endDate: DateTime.fromISO('2017-11-19T09:30:00.000Z'),
      allDay: false,
      recurrenceRule: null,
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
      lastUpdate: DateTime.fromISO('2017-11-18T09:30:00.000Z'),
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
    expect(createJsonLd(eventModel)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Sample Event',
      startDate: '2017-11-18T10:30:00.000+01:00',
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
      endDate: '2017-11-19T10:30:00.000+01:00',
      image: ['/thumbnail.jpg', '/medium.jpg', '/medium.jpg', '/full.jpg'],
    })
  })
})
