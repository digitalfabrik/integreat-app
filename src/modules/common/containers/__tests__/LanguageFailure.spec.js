// @flow

import React from 'react'
import { shallow } from 'enzyme'

import CityModel from '../../../../modules/endpoint/models/CityModel'
import ConnectedLanguageFailure, { LanguageFailure } from '../LanguageFailure'
import configureMockStore from 'redux-mock-store'

describe('LanguageFailure', () => {
  const city = 'augsburg'

  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      eventsEnabled: true,
      extrasEnabled: false,
      sortingName: 'augsburg',
      live: true
    }),
    new CityModel({
      name: 'Stadt Regensburg',
      code: 'regensburg',
      eventsEnabled: true,
      extrasEnabled: true,
      sortingName: 'regensburg',
      live: true
    }),
    new CityModel({
      name: 'Werne',
      code: 'werne',
      eventsEnabled: true,
      extrasEnabled: true,
      sortingName: 'regensburg',
      live: false
    })
  ]

  const language = 'tu'

  it('should match snapshot', () => {
    const wrapper = shallow(
      <LanguageFailure cities={cities}
                       city={city}
                       language={language}
                       t={key => key || 'null'} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const mockStore = configureMockStore()
    const store = mockStore({
      cities: {data: cities}
    })

    const languageFailure = shallow(
      <ConnectedLanguageFailure store={store} />
    )

    expect(languageFailure.props()).toMatchObject({
      cities
    })
  })
})
