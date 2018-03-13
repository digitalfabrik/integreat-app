import React from 'react'
import { Provider } from 'react-redux'
import EndpointBuilder from 'modules/endpoint/EndpointBuilder'
import { mount, shallow } from 'enzyme'
import ConnectedEventsNavigationItem, { EventsNavigationItem } from '../EventsNavigationItem'
import EndpointProvider from '../../../endpoint/EndpointProvider'
import createReduxStore from '../../../app/createReduxStore'
import createHistory from '../../../app/createHistory'
import Payload from '../../../endpoint/Payload'
import EventModel from '../../../endpoint/models/EventModel'
import moment from 'moment-timezone'

describe('EventsNavigationItem', () => {
  const language = 'de'
  const href = 'href1'
  const text = 'text1'
  const tooltip = 'tooltip1'
  const selected = false

  const events = [
    new EventModel({
      id: 1234,
      title: 'first Event',
      availableLanguages: {de: '1235', ar: '1236'},
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    }),
    new EventModel({
      id: 2,
      title: 'second Event',
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    })]

  it('should render active if events are available', () => {
    const component = shallow(
      <EventsNavigationItem href={href} text={href} tooltip={tooltip} selected={selected} events={events} />)
    expect(component).toMatchSnapshot()
  })

  it('should render inactive if events are undefined or empty', () => {
    const component = shallow(
      <EventsNavigationItem href='href1' text='text1' tooltip='tooltip1' selected={selected} events={undefined} />)
    expect(component).toMatchSnapshot()
    component.setProps({...component.props(), events: []})
    expect(component).toMatchSnapshot()
  })

  describe('connect()', () => {
    const location = 'augsburg'
    const route = '/:location/:language'

    const createComponent = (fetching = false, failure = false) => {
      const eventsEndpoint = new EndpointBuilder('events')
        .withStateToUrlMapper(() => 'https://weird-endpoint/api.json')
        .withMapper(json => json)
        .withResponseOverride(events)
        .withErrorOverride(failure ? 'Error No. 5' : undefined)
        .build()

      const store = createReduxStore(createHistory, {
        events: new Payload(fetching),
        router: {params: {location, language}, route}
      })
      return mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[eventsEndpoint]}>
            <ConnectedEventsNavigationItem href='href1' text='text1' tooltip='tooltip1' selected={false} />
          </EndpointProvider>
        </Provider>
      )
    }

    it('should be rendered if still fetching', () => {
      const navigationItem = createComponent(true).find(EventsNavigationItem)
      expect(navigationItem.props()).toEqual({events: undefined, href, selected, text, tooltip})
    })

    it('should be rendered if an error occured', () => {
      const navigationItem = createComponent(false, true).find(EventsNavigationItem)
      expect(navigationItem.props()).toEqual({events: undefined, href, selected, text, tooltip, error: 'Error No. 5'})
    })

    it('should be rendered if events are available', () => {
      const navigationItem = createComponent(false, false).find(EventsNavigationItem)
      expect(navigationItem.props()).toEqual({events, href, selected, text, tooltip})
    })
  })
})
