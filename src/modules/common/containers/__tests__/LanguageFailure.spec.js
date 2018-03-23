import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'

import createHistory from 'modules/app/createHistory'
import createReduxStore from 'modules/app/createReduxStore'

import CityModel from 'modules/endpoint/models/CityModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import ConnectedLanguageFailure, { LanguageFailure } from '../LanguageFailure'
import routesMap from '../../../app/routesMap'
import { CATEGORIES_ROUTE } from '../../../app/routes/categories'

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

  describe('connect', () => {
    const pathname = '/augsburg/tu'

    it('should map state to props', () => {
      const store = createReduxStore(createHistory, {
        location: {
          payload: {city: city, language: language, categoryPath: 'willkommen'},
          pathname: pathname,
          routesMap: routesMap,
          type: CATEGORIES_ROUTE
        },
        cities: {data: cities},
        languages: {data: languages}
      })

      const languageFailure = mount(
        <Provider store={store}>
          <ConnectedLanguageFailure />
        </Provider>
      ).find(LanguageFailure)

      expect(languageFailure.props()).toEqual({
        city: city,
        t: expect.any(Function),
        cities: cities,
        languages: languages
      })
    })
  })
})
