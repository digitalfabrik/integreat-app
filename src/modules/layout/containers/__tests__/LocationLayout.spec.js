import React from 'react'
import { shallow, mount } from 'enzyme'
import CityModel from 'modules/endpoint/models/CityModel'

import EventModel from '../../../endpoint/models/EventModel'
import moment from 'moment-timezone'
import LanguageModel from '../../../endpoint/models/LanguageModel'
import ConnectedLocationLayout, { LocationLayout } from '../LocationLayout'
import createReduxStore from '../../../app/createReduxStore'
import createHistory from '../../../app/createHistory'
import { EXTRAS_ROUTE } from '../../../app/routes/extras'
import { Provider } from 'react-redux'

describe('LocationLayout', () => {
  const matchRoute = id => {}

  const language = 'de'

  const cities = [new CityModel({name: 'Mambo No. 5', code: 'city1'})]

  const languages = [
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('en', 'English'),
    new LanguageModel('ar', 'Arabic')
  ]

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

  const MockNode = () => <div />

  it('should show LocationHeader and LocationFooter if City is available', () => {
    const component = shallow(
      <LocationLayout city='city1'
                      language={language}
                      languages={languages}
                      matchRoute={matchRoute}
                      cities={cities}
                      viewportSmall
                      currentRoute={EXTRAS_ROUTE}>
        <MockNode />
      </LocationLayout>)
    expect(component).toMatchSnapshot()
  })

  it('should show GeneralHeader and GeneralFooter if LocationModel is not available', () => {
    const component = shallow(
      <LocationLayout city='unavailableLocation'
                      language={language}
                      languages={languages}
                      matchRoute={matchRoute}
                      cities={cities}
                      viewportSmall
                      currentRoute='RANDOM_ROUTE'>
        <MockNode />
      </LocationLayout>)
    expect(component).toMatchSnapshot()
  })

  describe('connect()', () => {
    const city = 'augsburg'
    const path = '/:location/:language'

    const store = createReduxStore(createHistory, {
      viewport: {is: {small: false}},
      languages: {data: languages},
      events: {data: events},
      cities: {data: cities}
    })

    it('should map state to props', () => {
      const tree = mount(
        <Provider store={store}>
          <ConnectedLocationLayout />
        </Provider>
      )

      expect(tree.find(LocationLayout).props()).toEqual({
        events: events,
        languages: languages,
        currentRoute: path,
        city: city,
        language: language,
        cities: cities,
        viewportSmall: false,
        dispatch: expect.any(Function)
      })
    })
  })
})
