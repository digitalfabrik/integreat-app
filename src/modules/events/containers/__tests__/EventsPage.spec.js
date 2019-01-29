// @flow

import React from 'react'
import { shallow, mount } from 'enzyme'
import moment from 'moment-timezone'

import ConnectedEventsPage, { Events } from '../Events'
import { EventModel, DateModel, LocationModel } from '@integreat-app/integreat-api-client'
import createReduxStore from '../../../../modules/app/createReduxStore'
import { Provider } from 'react-redux'

describe('Events', () => {
  const events = [
    new EventModel({
      id: 1,
      path: '/augsburg/en/events/first_event',
      title: 'first Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/erstes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      content: 'content',
      thumbnail: 'thumbnail'
    }),
    new EventModel({
      id: 2,
      path: '/augsburg/en/events/second_event',
      title: 'second Event',
      availableLanguages: new Map(
        [['en', '/augsburg/de/events/zwotes_event'], ['ar', '/augsburg/ar/events/zwotes_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumbnail'
    }),
    new EventModel({
      id: 3,
      path: '/augsburg/en/events/third_event',
      title: 'third Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/drittes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumbnail'
    })
  ]

  const city = 'augsburg'

  const language = 'en'
  const t = (key: ?string): string => key || ''

  it('should match snapshot and render EventList', () => {
    const wrapper = shallow(
      <Events events={events}
              city={city}
              path={'/augsburg/en/events'}
              eventId={undefined}
              t={t}
              language={language}
              dispatch={() => {}}
              routesMap={{}} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render EventDetail', () => {
    const wrapper = shallow(
      <Events events={events}
              city={city}
              t={t}
              language={language}
              path={'/augsburg/en/events/first_event'}
              eventId={'first_event'}
              dispatch={() => {}}
              routesMap={{}} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render Failure if event does not exist', () => {
    const wrapper = shallow(
      <Events events={events}
              city={city}
              t={t}
              language={language}
              path={'/augsburg/en/events/invalid_event'}
              eventId={'invalid_event'}
              dispatch={() => {}}
              routesMap={{}} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const location = {payload: {city: city, language: language, eventId: 'id'}, pathname: '/augsburg/en/events/id'}
    const store = createReduxStore()
    store.getState().location = location

    const tree = mount(
      <Provider store={store}>
        <ConnectedEventsPage events={events} />
      </Provider>
    )

    expect(tree.find(Events).props()).toEqual({
      city,
      language,
      eventId: 'id',
      path: '/augsburg/en/events/id',
      events,
      dispatch: expect.any(Function),
      t: expect.any(Function)
    })
  })

  moment.tz.setDefault()
})
