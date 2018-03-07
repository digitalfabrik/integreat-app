import { shallow, mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'

import createReduxStore from 'modules/app/createReduxStore'
import createHistory from 'modules/app/createHistory'
import EndpointBuilder from 'modules/endpoint/EndpointBuilder'
import EndpointProvider from 'modules/endpoint/EndpointProvider'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import ExtraModel from 'modules/endpoint/models/ExtraModel'
import ConnectedExtrasPage, { ExtrasPage } from '../ExtrasPage'

describe('ExtrasPage', () => {
  const location = 'augsburg'
  const language = 'de'

  const languages = [
    new LanguageModel('en', 'English'),
    new LanguageModel('de', 'Deutsch')
  ]

  const sprungbrettExtra = new ExtraModel({
    alias: 'sprungbrett', path: 'path to fetch jobs from', name: 'Sprungbrett', thumbnail: 'xy'
  })

  const extras = [
    sprungbrettExtra,
    new ExtraModel({alias: 'ihk-lehrstellenboerse', path: 'ihk-jobborese.com', name: 'Jobboerse', thumbnail: 'xy'}),
    new ExtraModel({alias: 'ihk-praktikumsboerse', path: 'ihk-pratkitkumsboerse.com', name: 'Praktikumsboerse', thumbnail: 'xy'})
  ]

  it('should render a sprungbrett page if it is the selected extra', () => {
    const extrasPage = shallow(
      <ExtrasPage setLanguageChangeUrls={() => {}}
                  languages={languages}
                  location={location}
                  language={language}
                  extras={extras}
                  extra={'sprungbrett'} />
    )
    expect(extrasPage).toMatchSnapshot()
  })

  it('should render extra tiles if no extra is selected', () => {
    const extrasPage = shallow(
      <ExtrasPage setLanguageChangeUrls={() => {}}
                  languages={languages}
                  location={location}
                  language={language}
                  extras={extras} />
    )
    expect(extrasPage).toMatchSnapshot()
  })

  it('should render a failure if the selected extra does not exist', () => {
    const extrasPage = shallow(
      <ExtrasPage setLanguageChangeUrls={() => {}}
                  languages={languages}
                  location={location}
                  language={language}
                  extras={extras}
                  extra={'no valid extra'} />
    )
    expect(extrasPage).toMatchSnapshot()
  })

  it('should set language change urls on mount', () => {
    const setLanguageChangeUrls = jest.fn()
    shallow(
      <ExtrasPage setLanguageChangeUrls={setLanguageChangeUrls}
                  languages={languages}
                  location={location}
                  language={language}
                  extras={extras} />
    )
    expect(setLanguageChangeUrls.mock.calls).toHaveLength(1)
  })

  it('should update language change urls only on relevant prop change', () => {
    const setLanguageChangeUrls = jest.fn()
    const extrasPage = shallow(
      <ExtrasPage setLanguageChangeUrls={setLanguageChangeUrls}
                  languages={languages}
                  location={location}
                  language={language}
                  extras={extras} />
    )
    expect(setLanguageChangeUrls.mock.calls).toHaveLength(1)
    extrasPage.setProps({extra: 'sprungbrett', ...extrasPage.props})
    expect(setLanguageChangeUrls.mock.calls).toHaveLength(2)

    extrasPage.setProps({extra: 'sprungbrett', ...extrasPage.props})
    expect(setLanguageChangeUrls.mock.calls).toHaveLength(2)
  })

  describe('connect', () => {
    const extrasEndpoint = new EndpointBuilder('extras')
      .withStateToUrlMapper(() => 'https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(extras)
      .build()

    const languagesEndpoint = new EndpointBuilder('languages')
      .withStateToUrlMapper(() => 'https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(languages)
      .build()

    it('should map state to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location, language: language, extra: 'extra'}}
      })

      const sprungbrettPage = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[extrasEndpoint, languagesEndpoint]}>
            <ConnectedExtrasPage />
          </EndpointProvider>
        </Provider>
      ).find(ExtrasPage)

      expect(sprungbrettPage.props()).toEqual({
        location: location,
        language: language,
        extras: extras,
        languages: languages,
        extra: 'extra',
        setLanguageChangeUrls: expect.any(Function)
      })
    })

    it('should map dispatch to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location, language: language, extra: 'extra'}}
      })

      const mapLanguageToUrl = language => `/${language}`

      const languageChangeUrls = {
        en: '/en',
        de: '/de'
      }

      expect(store.getState().languageChangeUrls).not.toEqual(languageChangeUrls)

      const eventsPage = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[extrasEndpoint, languagesEndpoint]}>
            <ConnectedExtrasPage />
          </EndpointProvider>
        </Provider>
      ).find(ExtrasPage)

      eventsPage.props().setLanguageChangeUrls(mapLanguageToUrl, languages)
      expect(store.getState().languageChangeUrls).toEqual(languageChangeUrls)
    })
  })
})
