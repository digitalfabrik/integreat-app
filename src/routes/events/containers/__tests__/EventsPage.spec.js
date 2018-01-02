import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ConnectedEventsPage, { EventsPage } from '../EventsPage'
import EventModel from 'modules/endpoint/models/EventModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import DateModel from 'modules/endpoint/models/DateModel'
import Payload from 'modules/endpoint/Payload'

const mockSetLanguageChangeUrls = jest.fn()

describe('EventsPage', () => {
  beforeEach(() => {
    mockSetLanguageChangeUrls.mockClear()
  })
  const events = [
    new EventModel({
      id: 1234,
      title: 'first Event',
      availableLanguages: {de: '1235', ar: '1236'},
      date: new DateModel({startDate: new Date('2017-11-18' + 'T' + '09:30:00' + 'Z'),
        endDate: new Date('2017-11-18' + 'T' + '19:30:00' + 'Z'),
        allDay: true
      })
    }),
    new EventModel({
      id: 1235,
      title: 'erstes Event',
      availableLanguages: {en: '1234', ar: '1236'},
      date: new DateModel({startDate: new Date('2017-11-18' + 'T' + '09:30:00' + 'Z'),
        endDate: new Date('2017-11-18' + 'T' + '19:30:00' + 'Z'),
        allDay: true
      })
    }),
    new EventModel({
      id: 2,
      title: 'second Event',
      date: new DateModel({startDate: new Date('2017-11-18' + 'T' + '09:30:00' + 'Z'),
        endDate: new Date('2017-11-18' + 'T' + '19:30:00' + 'Z'),
        allDay: true
      })
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

  test('should render EventList', () => {
    const wrapper = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should render EventDetail', () => {
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

  test('should render Spinner', () => {
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

  test('should not dispatch on prop update', () => {
    const wrapper = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  id={id}
                  setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    )

    let mockCalls = mockSetLanguageChangeUrls.mock.calls

    wrapper.setProps({events: events, ...wrapper.props})

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(mockCalls.length)

    wrapper.setProps({...wrapper.props})

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(mockCalls.length)
  })

  test('mapLanguageToUrl', () => {
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

  const mockStore = configureMockStore([thunk])

  describe('connect', () => {
    test('should map state to props', () => {
      const store = mockStore({
        events: new Payload(false),
        languages: new Payload(false),
        router: {params: {location: 'augsburg', language: 'en', id: '1234'}}
      })

      const tree = mount(
        <Provider store={store}>
          <ConnectedEventsPage />
        </Provider>
      )

      const eventsPageProps = tree.find(ConnectedEventsPage).childAt(0).props()

      // todo add events and languages
      expect(eventsPageProps).toEqual({
        location: 'augsburg',
        language: 'en',
        id: '1234',
        setLanguageChangeUrls: expect.any(Function)
      })
    })

    test('should map dispatch to props', () => {
      const store = mockStore({
        events: new Payload(false),
        languages: new Payload(false),
        router: {params: {location: location, language: language}}
      })

      const mapLanguageToUrl = (language, id) => 'test' + language + id

      const testUrls = {
        en: 'testenundefined',
        de: 'testde1235',
        ar: 'testar1236'
      }

      const availableLanguages = {
        de: '1235',
        ar: '1236'
      }

      const tree = mount(
        <Provider store={store}>
          <ConnectedEventsPage />
        </Provider>
      )

      // todo expect setLanguageChangeUrls action to be in store, but as we don't get events and languages from our
      // mocked endpoint no action is dispatched

      const eventsPageProps = tree.find(ConnectedEventsPage).childAt(0).props()

      let countActions = store.getActions().length

      eventsPageProps.setLanguageChangeUrls(mapLanguageToUrl, languages, availableLanguages)
      expect(store.getActions()).toHaveLength(countActions + 1)

      expect(store.getActions()).toContainEqual({
        payload: testUrls,
        type: 'SET_LANGUAGE_CHANGE_URLS'
      })
    })
  })
})
