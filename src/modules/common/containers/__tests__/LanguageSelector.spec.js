import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'

import ConnectedLanguageSelector, { LanguageSelector } from '../LanguageSelector'
import createReduxStore from '../../../app/createReduxStore'
import createHistory from '../../../app/createHistory'
import LanguageModel from '../../../endpoint/models/LanguageModel'
import EndpointBuilder from '../../../endpoint/EndpointBuilder'
import EndpointProvider from '../../../endpoint/EndpointProvider'

describe('LanguageSelector', () => {
  const location = 'augsburg'
  const language = 'de'
  const languages = [
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('en', 'English'),
    new LanguageModel('ar', 'Arabic')
  ]

  const languageChangeUrls = {
    en: 'test/url/en',
    de: 'test/url/de',
    ar: 'test/url/ar'
  }

  test('should match snapshot', () => {
    const mockCloseDropDownCallback = jest.fn()

    const wrapper = shallow(
      <LanguageSelector location={location}
                        languageChangeUrls={languageChangeUrls}
                        closeDropDownCallback={mockCloseDropDownCallback}
                        language={language}
                        languages={languages} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  describe('connect', () => {
    const languagesEndpoint = new EndpointBuilder('languages')
      .withRouterToUrlMapper(() => 'https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(languages)
      .build()

    test('should have correct props', () => {
      const mockCloseDropDownCallback = jest.fn()

      const store = createReduxStore(createHistory, {
        router: {params: {location: 'augsburg', language: 'de'}},
        languageChangeUrls: languageChangeUrls
      })

      const tree = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[languagesEndpoint]}>
            <ConnectedLanguageSelector closeDropDownCallback={mockCloseDropDownCallback} />
          </EndpointProvider>
        </Provider>
      )

      const languageSelector = tree.find(LanguageSelector)

      expect(languageSelector.props()).toEqual({
        closeDropDownCallback: mockCloseDropDownCallback,
        languages: languages,
        language: language,
        location: location,
        languageChangeUrls: languageChangeUrls,
        dispatch: expect.any(Function)
      })
    })
  })
})
