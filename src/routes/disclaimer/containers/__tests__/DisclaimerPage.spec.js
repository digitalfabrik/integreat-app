import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ConnectedDisclaimerPage, { DisclaimerPage } from '../DisclaimerPage'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import DisclaimerModel from 'modules/endpoint/models/DisclaimerModel'
import Payload from 'modules/endpoint/Payload'
import Store from '../../../../Store'

const location = 'augsburg'
const languages = [
  new LanguageModel('en', 'English'),
  new LanguageModel('de', 'Deutsch'),
  new LanguageModel('ar', 'Arabic')
]

const disclaimer = new DisclaimerModel({
  id: 1689, title: 'Feedback, Kontakt und mögliches Engagement', content: 'this is a test content'
})

describe('DisclaimerPage', () => {
  const mockSetLanguageChangeUrls = jest.fn()

  test('should render', () => {
    const wrapper = shallow(
      <DisclaimerPage languages={languages}
                      location={location}
                      disclaimer={disclaimer}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls} />)
    expect(wrapper).toMatchSnapshot()
  })

  test('should dispatch once in componentDidMount', () => {
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

  test('mapLanguageToUrl', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const disclaimerPage = shallow(
      <DisclaimerPage languages={languages}
                      location={location}
                      disclaimer={disclaimer}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    ).instance()
    expect(disclaimerPage.mapLanguageToUrl('en')).toBe('/augsburg/en/disclaimer')
  })

  const mockStore = configureMockStore([thunk])

  describe('connect', () => {
    test('should map state to props', () => {
      const store = new Store()
      store.init({
        disclaimer: new Payload(false),
        languages: new Payload(false),
        router: {params: {location: location}}
      })

      const tree = mount(
        <Provider store={store.redux}>
          <ConnectedDisclaimerPage />
        </Provider>
      )

      const disclaimerPageProps = tree.find(ConnectedDisclaimerPage).childAt(0).props()

      // todo add disclaimer and languages, WEBAPP-167
      expect(disclaimerPageProps).toEqual({
        location: 'augsburg',
        setLanguageChangeUrls: expect.any(Function)
      })
    })

    test('should map dispatch to props', () => {
      const store = mockStore({
        disclaimer: new Payload(false),
        languages: new Payload(false),
        router: {params: {location: location}}
      })

      const mapLanguageToUrl = (language) => language

      const testUrls = {
        en: 'en',
        ar: 'ar',
        de: 'de'
      }

      const tree = mount(
        <Provider store={store}>
          <ConnectedDisclaimerPage />
        </Provider>
      )

      // todo expect setLanguageChangeUrls action to be in store, but as we don't get events and languages from our
      // mocked endpoint no action is dispatched, WEBAPP-167

      const disclaimerPageProps = tree.find(ConnectedDisclaimerPage).childAt(0).props()

      let countActions = store.getActions().length

      disclaimerPageProps.setLanguageChangeUrls(mapLanguageToUrl, languages)
      expect(store.getActions()).toHaveLength(countActions + 1)

      expect(store.getActions()).toContainEqual({
        payload: testUrls,
        type: 'SET_LANGUAGE_CHANGE_URLS'
      })
    })
  })
})
