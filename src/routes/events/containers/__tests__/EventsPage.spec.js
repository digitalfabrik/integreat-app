import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import ConnectedEventsPage, { EventsPage } from '../EventsPage'
import EventModel from 'modules/endpoint/models/EventModel'
import configureMockStore from 'redux-mock-store'
import CityModel from '../../../../modules/endpoint/models/CityModel'

describe('EventsPage', () => {
  const events = [
    new EventModel({
      id: '1234',
      title: 'first Event',
      availableLanguages: {de: '1235', ar: '1236'},
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    }),
    new EventModel({
      id: '1235',
      title: 'erstes Event',
      availableLanguages: {en: '1234', ar: '1236'},
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    }),
    new EventModel({
      id: '2',
      title: 'second Event',
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    })
  ]

  const city = 'augsburg'
  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: false
    })
  ]
  const language = 'en'
  const id = '1235'
  const t = key => key

  it('should match snapshot and render EventList', () => {
    const wrapper = shallow(
      <EventsPage events={events}
                  city={city}
                  cities={cities}
                  t={t}
                  language={language} />
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
                  eventId={id} />
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
                  eventId={'234729'} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const location = {payload: {city: city, language: language, eventId: id}}

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      events: {data: events},
      cities: {data: cities}
    })

    const categoriesPage = shallow(
      <ConnectedEventsPage store={store} />
    )

    expect(categoriesPage.props()).toMatchObject({
      city,
      language,
      eventId: id,
      events,
      cities
    })
  })

  moment.tz.setDefault()
})
