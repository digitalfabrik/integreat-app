import React from 'react'
import { shallow } from 'enzyme'

import CityModel from 'modules/endpoint/models/CityModel'
import ConnectedLanguageFailure, { LanguageFailure } from '../LanguageFailure'
import configureMockStore from 'redux-mock-store'

describe('LanguageFailure', () => {
  const city = 'augsburg'

  const cities = [
    new CityModel({name: 'Augsburg', code: 'augsburg'}),
    new CityModel({name: 'Stadt Regensburg', code: 'regensburg'}),
    new CityModel({name: 'Werne', code: 'werne'})
  ]

  const language = 'tu'

  it('should match snapshot', () => {
    const wrapper = shallow(
      <LanguageFailure cities={cities}
                       city={city}
                       language={language}
                       t={key => key} />
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
