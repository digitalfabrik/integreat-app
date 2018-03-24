import React from 'react'
import { shallow } from 'enzyme'

import CityModel from 'modules/endpoint/models/CityModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import ConnectedLanguageFailure, { LanguageFailure } from '../LanguageFailure'
import { ThemeProvider } from 'styled-components'
import theme from '../../../../modules/app/constants/theme'
import configureMockStore from 'redux-mock-store'

describe('LanguageFailure', () => {
  const city = 'augsburg'

  const languages = [
    new LanguageModel('en', 'English'),
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('ar', 'Arabic')
  ]

  const cities = [
    new CityModel({name: 'Augsburg', code: 'augsburg'}),
    new CityModel({name: 'Stadt Regensburg', code: 'regensburg'}),
    new CityModel({name: 'Werne', code: 'werne'})
  ]

  const language = 'tu'

  it('should match snapshot', () => {
    const wrapper = shallow(
      <LanguageFailure cities={cities}
                       languages={languages}
                       city={city}
                       language={language}
                       t={key => key} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const location = {payload: {city}}

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      languages: {data: languages},
      cities: {data: cities}
    })

    const languageFailure = shallow(
      <ConnectedLanguageFailure store={store} />
    )

    expect(languageFailure.props()).toEqual({
      city,
      cities,
      languages,
      dispatch: expect.any(Function),
      store,
      storeSubscription: expect.any(Object)
    })
  })
})
