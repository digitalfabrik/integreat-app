// @flow

import React from 'react'
import { shallow } from 'enzyme'
import { Helmet } from 'react-helmet'
import EventJsonLd from '../EventJsonLd'
import moment from 'moment'
import { DateModel, EventModel, FeaturedImageModel, LocationModel } from 'api-client'
import DateFormatter from 'api-client/src/i18n/DateFormatter'

describe('EventJsonLd', () => {
  it('should output valid json-ld', () => {
    const dateModel = new DateModel({
      startDate: moment('2017-11-18T09:30:00.000Z'),
      endDate: moment('2017-11-19T09:30:00.000Z'),
      allDay: false
    })
    const locationModel = new LocationModel({
      name: 'Café Tür an Tür',
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      state: 'Bayern',
      postcode: '86153',
      region: 'Schwaben',
      country: 'DE'
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
      lastUpdate: moment('2017-11-18T09:30:00.000Z'),
      hash: 'hash123',
      featuredImage: new FeaturedImageModel({
        description: 'whoohoo',
        thumbnail: { url: '/thumbnail.jpg', width: 10, height: 10 },
        medium: { url: '/medium.jpg', width: 20, height: 20 },
        large: { url: '/medium.jpg', width: 30, height: 30 },
        full: { url: '/full.jpg', width: 40, height: 40 }
      })
    })

    const wrapper = shallow(<EventJsonLd event={eventModel} formatter={new DateFormatter(undefined, 'en')} />)
    const helmet = wrapper.find(Helmet)
    expect(helmet.children().matchesElement(<script type='application/ld+json'>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: 'Sample Event',
          startDate: '2017-11-18T10:30:00+01:00',
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
              addressRegion: 'Schwaben',
              addressCountry: 'DE'
            }
          },
          endDate: '2017-11-19T10:30:00+01:00',
          image: ['/thumbnail.jpg', '/medium.jpg', '/medium.jpg', '/full.jpg']
        })}
      </script>
    )).toBe(true)
  })
})
