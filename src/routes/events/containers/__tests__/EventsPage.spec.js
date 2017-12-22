import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ConnectedEventsPage, { EventsPage } from '../EventsPage'
import EventModel from 'modules/endpoint/models/EventModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import Payload from '../../../../modules/endpoint/Payload'

describe('EventsPage', () => {
  const events = [
    new EventModel({
      id: 1234,
      title: 'first Event',
      availableLanguages: {de: '1235', ar: '1236'}
    }),
    new EventModel({
      id: 1235,
      title: 'erstes Event',
      availableLanguages: {en: '1234', ar: '1236'}
    }),
    new EventModel({
      id: 2,
      title: 'second Event'
    })
  ]

  const location = 'augsburg'
  const languages = [
    new LanguageModel('en', 'English'),
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('ar', 'Arabic')
  ]
  const language = 'en'
  const path = '/1235'

  test('should render EventList', () => {
    const mockDispatchLanguageChangeUrls = jest.fn()

    const wrapper = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  dispatchLanguageChangeUrls={mockDispatchLanguageChangeUrls}/>
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should render EventDetail', () => {
    const mockDispatchLanguageChangeUrls = jest.fn()

    const wrapper = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  path={path}
                  dispatchLanguageChangeUrls={mockDispatchLanguageChangeUrls}/>
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should render Spinner', () => {
    const mockDispatchLanguageChangeUrls = jest.fn()

    const wrapper = shallow(
      <EventsPage events={[]}
                  location={location}
                  languages={languages}
                  language={language}
                  path={path}
                  dispatchLanguageChangeUrls={mockDispatchLanguageChangeUrls}/>
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should dispatch once on mount with availableLanguages', () => {
    const mockDispatchLanguageChangeUrls = jest.fn()

    const eventsPage = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  path={path}
                  dispatchLanguageChangeUrls={mockDispatchLanguageChangeUrls}/>
    ).instance()

    expect(mockDispatchLanguageChangeUrls.mock.calls).toHaveLength(1)
    expect(mockDispatchLanguageChangeUrls).toBeCalledWith(
      eventsPage.mapLanguageToUrl, languages, events[1].availableLanguages
    )
  })

  test('should dispatch once on mount without availableLanguages', () => {
    const mockDispatchLanguageChangeUrls = jest.fn()

    const eventsPage = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  dispatchLanguageChangeUrls={mockDispatchLanguageChangeUrls}/>
    ).instance()

    expect(mockDispatchLanguageChangeUrls.mock.calls).toHaveLength(1)
    expect(mockDispatchLanguageChangeUrls).toBeCalledWith(eventsPage.mapLanguageToUrl, languages, {})
  })

  test('should dispatch on prop update with availableLanguages', () => {
    const mockDispatchLanguageChangeUrls = jest.fn()

    const wrapper = shallow(
      <EventsPage events={[]}
                  location={location}
                  languages={languages}
                  language={language}
                  path={path}
                  dispatchLanguageChangeUrls={mockDispatchLanguageChangeUrls}/>
    )

    expect(mockDispatchLanguageChangeUrls.mock.calls).toHaveLength(1)

    wrapper.setProps({events: events, ...wrapper.props})

    expect(mockDispatchLanguageChangeUrls.mock.calls).toHaveLength(2)
    expect(mockDispatchLanguageChangeUrls).toBeCalledWith(
      wrapper.instance().mapLanguageToUrl, languages, events[1].availableLanguages
    )
  })

  test('should not dispatch on prop update', () => {
    const mockDispatchLanguageChangeUrls = jest.fn()

    const wrapper = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  path={path}
                  dispatchLanguageChangeUrls={mockDispatchLanguageChangeUrls}/>
    )

    let mockCalls = mockDispatchLanguageChangeUrls.mock.calls

    wrapper.setProps({events: events, ...wrapper.props})

    expect(mockDispatchLanguageChangeUrls.mock.calls).toHaveLength(mockCalls.length)

    wrapper.setProps({...wrapper.props})

    expect(mockDispatchLanguageChangeUrls.mock.calls).toHaveLength(mockCalls.length)
  })

  test('mapLanguageToUrl', () => {
    const mockDispatchLanguageChangeUrls = jest.fn()

    const mapLanguageToUrl = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  path={path}
                  dispatchLanguageChangeUrls={mockDispatchLanguageChangeUrls}/>
    ).instance().mapLanguageToUrl

    expect(mapLanguageToUrl('en')).toBe('/augsburg/en/events')
    expect(mapLanguageToUrl('en', 1234)).toBe('/augsburg/en/events/1234')
  })

  const mockStore = configureMockStore([thunk])

  test('should map state to props', () => {
    const store = mockStore({
      endpoint: new Payload(false),
      endpoint1: new Payload(false),
      router: {params: {location: 'augsburg', language: 'en', _: ''}}
    })

    const wrapper = mount(
      <Provider store={store}>
        <ConnectedEventsPage store={store}/>
      </Provider>
    )
  })
})
