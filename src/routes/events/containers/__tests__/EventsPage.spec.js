// @flow

import React from 'react'
import { shallow, mount } from 'enzyme'
import moment from 'moment-timezone'

import ConnectedEventsPage, { EventsPage } from '../EventsPage'
import EventModel from 'modules/endpoint/models/EventModel'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import createReduxStore from '../../../../modules/app/createReduxStore'
import createHistory from '../../../../modules/app/createHistory'
import { Provider } from 'react-redux'

describe('EventsPage', () => {
  const events = [
    new EventModel({
      id: 1,
      path: '/augsburg/en/events/first_event',
      title: 'first Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/erstes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true,
      address: 'address',
      content: 'content',
      excerpt: 'excerpt',
      thumbnail: 'thumbnail',
      town: 'town'
    }),
    new EventModel({
      id: 2,
      path: '/augsburg/en/events/second_event',
      title: 'second Event',
      availableLanguages: new Map(
        [['en', '/augsburg/de/events/zwotes_event'], ['ar', '/augsburg/ar/events/zwotes_event']]),
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true,
      address: 'address',
      content: 'content',
      excerpt: 'excerpt',
      thumbnail: 'thumbnail',
      town: 'town'
    }),
    new EventModel({
      id: 3,
      path: '/augsburg/en/events/third_event',
      title: 'third Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/drittes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true,
      address: 'address',
      content: 'content',
      excerpt: 'excerpt',
      thumbnail: 'thumbnail',
      town: 'town'
    })
  ]

  const city = 'augsburg'
  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: false,
      sortingName: 'Augsburg'
    })
  ]
  const language = 'en'
  const t = (key: ?string): string => key || ''

  it('should match snapshot and render EventList', () => {
    const wrapper = shallow(
      <EventsPage events={events}
                  city={city}
                  cities={cities}
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
      <EventsPage events={events}
                  city={city}
                  cities={cities}
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
      <EventsPage events={events}
                  city={city}
                  cities={cities}
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
    const store = createReduxStore(createHistory, {})
    store.getState().location = location

    const tree = mount(
      <Provider store={store}>
        <ConnectedEventsPage cities={cities} events={events} />
      </Provider>
    )

    expect(tree.find(EventsPage).props()).toEqual({
      city,
      language,
      eventId: 'id',
      path: '/augsburg/en/events/id',
      events,
      cities,
      dispatch: expect.any(Function),
      t: expect.any(Function)
    })
  })

  moment.tz.setDefault()
})
