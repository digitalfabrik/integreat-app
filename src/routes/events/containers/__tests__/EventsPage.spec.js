import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import moment from 'moment-timezone'

import createReduxStore from 'modules/app/createReduxStore'
import createHistory from 'modules/app/createHistory'

import ConnectedEventsPage, { EventsPage } from '../EventsPage'
import EventModel from 'modules/endpoint/models/EventModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'

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
  const languages = [
    new LanguageModel('en', 'English'),
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('ar', 'Arabic')
  ]
  const language = 'en'
  const id = '1235'

  it('should match snapshot and render EventList', () => {
    const wrapper = shallow(
      <EventsPage events={events}
                  city={city}
                  languages={languages}
                  language={language} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render EventDetail', () => {
    const wrapper = shallow(
      <EventsPage events={events}
                  city={city}
                  languages={languages}
                  language={language}
                  eventId={id} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render Failure if event does not exist', () => {
    const wrapper = shallow(
      <EventsPage events={events}
                  city={city}
                  languages={languages}
                  language={language}
                  eventId={'234729'} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  describe('connect', () => {
    it('should map state and fetched data to props', () => {
      const store = createReduxStore(createHistory, {
        events: {data: events},
        location: {pathname: '/augsburg/en/events', payload: {city: city, language: language, eventId: id}}
      })

      const eventsPage = mount(
        <Provider store={store}>
          <ConnectedEventsPage />
        </Provider>
      ).find(EventsPage)

      expect(eventsPage.props()).toEqual({
        city: city,
        language: language,
        eventId: id,
        events: events
      })
    })
  })

  moment.tz.setDefault()
})
