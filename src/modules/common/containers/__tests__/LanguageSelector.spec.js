import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'

import ConnectedLanguageSelector, { LanguageSelector } from '../LanguageSelector'
import createReduxStore from '../../../app/createReduxStore'
import createHistory from '../../../app/createHistory'
import LanguageModel from '../../../endpoint/models/LanguageModel'

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
    test('should have correct props', () => {
      const mockCloseDropDownCallback = jest.fn()

      const store = createReduxStore(createHistory, {
        router: {params: {location: 'augsburg', language: 'de'}},
        languageChangeUrls: languageChangeUrls
      })

      const tree = mount(
        <Provider store={store}>
          <ConnectedLanguageSelector closeDropDownCallback={mockCloseDropDownCallback} />
        </Provider>
      )

      const languageSelector = tree.find(LanguageSelector)

      expect(languageSelector.props()).toEqual({
        closeDropDownCallback: mockCloseDropDownCallback,
        languages: languages,
        language: language,
        location: location,
        languageChangeUrls: languageChangeUrls,
        // props of withFetcher
        dispatch: expect.any(Function),
        languagesPayload: expect.any(Object),
        requestAction: expect.any(Function),
        urlParams: expect.any(Object)
      })
    })
  })
})
