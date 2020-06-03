// @flow

import React from 'react'
import { mount, shallow } from 'enzyme'
import moment from 'moment'

import ConnectedEventsPage, { EventsPage } from '../EventsPage'
import { CityModel, DateModel, EventModel, LocationModel } from '@integreat-app/integreat-api-client'
import createReduxStore from '../../../../modules/app/createReduxStore'
import { Provider } from 'react-redux'
import createLocation from '../../../../createLocation'
import { EVENTS_ROUTE } from '../../../../modules/app/route-configs/EventsRouteConfig'

describe('EventsPage', () => {
  const events = [
    new EventModel({
      path: '/augsburg/en/events/first_event',
      title: 'first Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/erstes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      date: new DateModel({
        startDate: moment('2017-11-18T09:30:00.000Z'),
        endDate: moment('2017-11-18T19:30:00.000Z'),
        allDay: true
      }),
      location: new LocationModel({
        name: 'name',
        address: 'address',
        town: 'town',
        postcode: 'postcode',
        longitude: null,
        latitude: null
      }),
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      content: 'content',
      thumbnail: 'thumbnail',
      featuredImage: null,
      hash: '2fe6283485a93932'
    }),
    new EventModel({
      path: '/augsburg/en/events/second_event',
      title: 'second Event',
      availableLanguages: new Map(
        [['en', '/augsburg/de/events/zwotes_event'], ['ar', '/augsburg/ar/events/zwotes_event']]),
      date: new DateModel({
        startDate: moment('2017-11-18T09:30:00.000Z'),
        endDate: moment('2017-11-18T19:30:00.000Z'),
        allDay: true
      }),
      location: new LocationModel({
        name: 'name',
        address: 'address',
        town: 'town',
        postcode: 'postcode',
        latitude: null,
        longitude: null
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumbnail',
      featuredImage: null,
      hash: '2fe6283485b93932'
    }),
    new EventModel({
      path: '/augsburg/en/events/third_event',
      title: 'third Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/drittes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      date: new DateModel({
        startDate: moment('2017-11-18T09:30:00.000Z'),
        endDate: moment('2017-11-18T19:30:00.000Z'),
        allDay: true
      }),
      location: new LocationModel({
        name: 'name',
        address: 'address',
        town: 'town',
        postcode: 'postcode',
        latitude: null,
        longitude: null
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumbnail',
      featuredImage: null,
      hash: '2fe6283485c93932'
    })
  ]
  const cities = [new CityModel({
    name: 'Augsburg',
    code: 'augsburg',
    live: true,
    eventsEnabled: true,
    extrasEnabled: true,
    pushNotificationsEnabled: true,
    tunewsEnabled: true,
    sortingName: 'Augsburg',
    prefix: null,
    latitude: null,
    longitude: null,
    aliases: null
  })]

  const city = 'augsburg'

  const language = 'en'
  const t = (key: ?string): string => key || ''

  it('should match snapshot and render EventList', () => {
    const wrapper = shallow(
      <EventsPage events={events}
                  cities={cities}
                  city={city}
                  path='/augsburg/en/events'
                  eventId={undefined}
                  t={t}
                  language={language} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render EventDetail', () => {
    const wrapper = shallow(
      <EventsPage events={events}
                  cities={cities}
                  city={city}
                  t={t}
                  language={language}
                  path='/augsburg/en/events/first_event'
                  eventId='first_event' />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render Failure if event does not exist', () => {
    const wrapper = shallow(
      <EventsPage events={events}
                  cities={cities}
                  city={city}
                  t={t}
                  language={language}
                  path='/augsburg/en/events/invalid_event'
                  eventId='invalid_event' />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const location = createLocation({
      payload: { city: city, language: language, eventId: 'id' },
      pathname: '/augsburg/en/events/id',
      type: EVENTS_ROUTE
    })
    const store = createReduxStore()
    store.getState().location = location

    const tree = mount(
      <Provider store={store}>
        <ConnectedEventsPage events={events} cities={cities} />
      </Provider>
    )

    expect(tree.find(EventsPage).props()).toEqual({
      city,
      language,
      eventId: 'id',
      path: '/augsburg/en/events/id',
      events,
      cities,
      t: expect.any(Function),
      i18n: expect.anything(),
      dispatch: expect.any(Function)
    })
  })
})
