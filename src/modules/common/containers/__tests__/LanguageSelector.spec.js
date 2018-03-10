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

  it('should match snapshot', () => {
    const wrapper = shallow(
      <LanguageSelector location={location}
                        languageChangeUrls={languageChangeUrls}
                        closeDropDownCallback={() => {}}
                        language={language}
                        languages={languages} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should add vertical class name if verticalLayout is true', () => {
    const wrapper = shallow(<LanguageSelector location={location} languageChangeUrls={languageChangeUrls}
                                              closeDropDownCallback={() => {}} language={language}
                                              languages={languages}
                                              verticalLayout />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('connect', () => {
    it('should have correct props', () => {
      const mockCloseDropDownCallback = jest.fn()

      const store = createReduxStore(createHistory, {
        router: {params: {location: 'augsburg', language: 'de'}},
        languageChangeUrls: languageChangeUrls
      })

      const tree = mount(
        <Provider store={store}>
          <ConnectedLanguageSelector closeDropDownCallback={mockCloseDropDownCallback} languages={languages} />
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
