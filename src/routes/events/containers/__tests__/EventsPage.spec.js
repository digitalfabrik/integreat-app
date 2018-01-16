import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import moment from 'moment-timezone'

import createReduxStore from 'modules/app/createReduxStore'
import createHistory from 'modules/app/createHistory'
import EndpointBuilder from 'modules/endpoint/EndpointBuilder'
import EndpointProvider from 'modules/endpoint/EndpointProvider'

import ConnectedEventsPage, { EventsPage } from '../EventsPage'
import EventModel from 'modules/endpoint/models/EventModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'

describe('EventsPage', () => {
  // we need UTC here, see https://medium.com/front-end-hacking/jest-snapshot-testing-with-dates-and-times-f3badb8f1d87
  // otherwise snapshot testing is not working
  moment.tz.setDefault('UTC') // fixme: leaks test

  const events = [
    new EventModel({
      id: 1234,
      title: 'first Event',
      availableLanguages: {de: '1235', ar: '1236'},
      startDate: moment('2017-11-18 09:30:00'),
      endDate: moment('2017-11-18 19:30:00'),
      allDay: true
    }),
    new EventModel({
      id: 1235,
      title: 'erstes Event',
      availableLanguages: {en: '1234', ar: '1236'},
      startDate: moment('2017-11-18 09:30:00'),
      endDate: moment('2017-11-18 19:30:00'),
      allDay: true
    }),
    new EventModel({
      id: 2,
      title: 'second Event',
      startDate: moment('2017-11-18 09:30:00'),
      endDate: moment('2017-11-18 19:30:00'),
      allDay: true
    })
  ]

  const location = 'augsburg'
  const languages = [
    new LanguageModel('en', 'English'),
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('ar', 'Arabic')
  ]
  const language = 'en'
  const id = '1235'

  test('should match snapshot and render EventList', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const wrapper = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should match snapshot and render EventDetail', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const wrapper = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  id={id}
                  setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should match snapshot and render Spinner', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const wrapper = shallow(
      <EventsPage events={[]}
                  location={location}
                  languages={languages}
                  language={language}
                  id={id}
                  setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should dispatch once on mount with availableLanguages', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const eventsPage = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  id={id}
                  setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    ).instance()

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(1)
    expect(mockSetLanguageChangeUrls).toBeCalledWith(
      eventsPage.mapLanguageToUrl, languages, events[1].availableLanguages
    )
  })

  test('should dispatch once on mount without availableLanguages', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const eventsPage = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    ).instance()

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(1)
    expect(mockSetLanguageChangeUrls).toBeCalledWith(eventsPage.mapLanguageToUrl, languages, {})
  })

  test('should dispatch on prop update with availableLanguages', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const wrapper = shallow(
      <EventsPage events={[]}
                  location={location}
                  languages={languages}
                  language={language}
                  id={id}
                  setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    )

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(1)

    wrapper.setProps({events: events, ...wrapper.props})

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(2)
    expect(mockSetLanguageChangeUrls).toBeCalledWith(
      wrapper.instance().mapLanguageToUrl, languages, events[1].availableLanguages
    )
  })

  test('should not dispatch on irrelevant prop update', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const wrapper = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  id={id}
                  setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    )

    const mockCalls = mockSetLanguageChangeUrls.mock.calls

    wrapper.setProps({events: events, ...wrapper.props})

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(mockCalls.length)

    wrapper.setProps({...wrapper.props})

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(mockCalls.length)
  })

  test('should mapLanguageToUrl correctly', () => {
  test('should map languages to url', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const mapLanguageToUrl = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  id={id}
                  setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    ).instance().mapLanguageToUrl

    expect(mapLanguageToUrl('en')).toBe('/augsburg/en/events')
    expect(mapLanguageToUrl('en', 1234)).toBe('/augsburg/en/events/1234')
  })

  describe('connect', () => {
    const eventsEndpoint = new EndpointBuilder('events')
      .withUrl('https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(events)
      .build()

    const languagesEndpoint = new EndpointBuilder('languages')
      .withUrl('https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(languages)
      .build()

    test('should map state and fetched data to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location, language: language, id: id}, languageChangeUrls: {}}
      })

      const eventsPage = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[eventsEndpoint, languagesEndpoint]}>
            <ConnectedEventsPage />
          </EndpointProvider>
        </Provider>
      ).find(EventsPage)

      expect(eventsPage.props()).toEqual({
        location: location,
        language: language,
        id: id,
        setLanguageChangeUrls: expect.any(Function),
        events: events,
        languages: languages
      })
    })

    test('should map dispatch to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location, language: language, id: id}, languageChangeUrls: {}}
      })

      const mapLanguageToUrl = (language, id) => `/${language}/${id}`

      const languageChangeUrls = {
        en: '/en/1235',
        de: '/de/undefined',
        ar: '/ar/1236'
      }

      const availableLanguages = {
        en: '1235',
        ar: '1236'
      }

      expect(store.getState().languageChangeUrls).not.toEqual(languageChangeUrls)

      const eventsPage = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[eventsEndpoint, languagesEndpoint]}>
            <ConnectedEventsPage />
          </EndpointProvider>
        </Provider>
      ).find(EventsPage)

      eventsPage.props().setLanguageChangeUrls(mapLanguageToUrl, languages, availableLanguages)
      expect(store.getState().languageChangeUrls).toEqual(languageChangeUrls)
    })
  })
})
