import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'

import createReduxStore from 'modules/app/createReduxStore'
import createHistory from 'modules/app/createHistory'

import ConnectedDisclaimerPage, { DisclaimerPage } from '../DisclaimerPage'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import DisclaimerModel from 'modules/endpoint/models/DisclaimerModel'

describe('DisclaimerPage', () => {
  const location = 'augsburg'

  const languages = [
    new LanguageModel('en', 'English'),
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('ar', 'Arabic')
  ]

  const disclaimer = new DisclaimerModel({
    id: 1689, title: 'Feedback, Kontakt und mögliches Engagement', content: 'this is a test content'
  })

  it('should match snapshot', () => {
    const wrapper = shallow(
      <DisclaimerPage languages={languages}
                      location={location}
                      disclaimer={disclaimer}
                      setLanguageChangeUrls={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should dispatch once on mount', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const disclaimerPage = shallow(
      <DisclaimerPage languages={languages}
                      location={location}
                      disclaimer={disclaimer}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    ).instance()

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(1)
    expect(mockSetLanguageChangeUrls).toBeCalledWith(disclaimerPage.mapLanguageToUrl, languages)
  })

  it('should mapLanguageToUrl correctly', () => {
    const disclaimerPage = shallow(
      <DisclaimerPage languages={languages}
                      location={location}
                      disclaimer={disclaimer}
                      setLanguageChangeUrls={() => {}} />
    ).instance()
    expect(disclaimerPage.mapLanguageToUrl('en')).toBe('/augsburg/en/disclaimer')
  })

  describe('connect', () => {
    const store = createReduxStore(createHistory, {
      router: {params: {location: location}}
    })

    it('should map state and fetched data to props', () => {
      const disclaimerPage = mount(
        <Provider store={store}>
          <ConnectedDisclaimerPage languages={languages} disclaimer={disclaimer} />
        </Provider>
      ).find(DisclaimerPage)

      expect(disclaimerPage.props()).toEqual({
        location: location,
        setLanguageChangeUrls: expect.any(Function),
        disclaimer: disclaimer,
        languages: languages
      })
    })

    it('should map dispatch to props', () => {
      const mapLanguageToUrl = language => `/${language}`

      const languageChangeUrls = {
        en: '/en',
        ar: '/ar',
        de: '/de'
      }

      const disclaimerPage = mount(
        <Provider store={store}>
          <ConnectedDisclaimerPage languages={languages} disclaimer={disclaimer} />
        </Provider>
      ).find(DisclaimerPage)

      disclaimerPage.props().setLanguageChangeUrls(mapLanguageToUrl, languages)

      expect(store.getState().languageChangeUrls).toEqual(languageChangeUrls)
    })
  })
})
