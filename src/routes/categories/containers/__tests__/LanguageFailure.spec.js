import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'

import createHistory from 'modules/app/createHistory'
import createReduxStore from 'modules/app/createReduxStore'
import EndpointBuilder from 'modules/endpoint/EndpointBuilder'
import EndpointProvider from 'modules/endpoint/EndpointProvider'

import LocationModel from 'modules/endpoint/models/LocationModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import ConnectedLanguageFailure, { LanguageFailure } from '../LanguageFailure'

describe('LanguageFailure', () => {
  const location = 'augsburg'

  const languages = [
    new LanguageModel('en', 'English'),
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('ar', 'Arabic')
  ]

  const locations = [
    new LocationModel({name: 'Augsburg', code: 'augsburg'}),
    new LocationModel({name: 'Stadt Regensburg', code: 'regensburg'}),
    new LocationModel({name: 'Werne', code: 'werne'})
  ]

  const language = 'tu'

  test('should match snapshot', () => {
    const wrapper = shallow(
      <LanguageFailure locations={locations}
                       languages={languages}
                       location={location}
                       language={language}
                       t={key => key}
                       setLanguageChangeUrls={() => {}} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  test('should dispatch once on mount', () => {
    const mockSetLanguageChangeUrls = jest.fn()
    const categoriesPage = shallow(
      <LanguageFailure locations={locations}
                       languages={languages}
                       location={location}
                       language={language}
                       setLanguageChangeUrls={mockSetLanguageChangeUrls}
                       t={key => key} />
    ).instance()

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(1)
    expect(mockSetLanguageChangeUrls).toBeCalledWith(categoriesPage.mapLanguageToUrl, languages)
  })

  test('should map language to url', () => {
    const mapLanguageToUrl = shallow(
      <LanguageFailure locations={locations}
                       languages={languages}
                       location={location}
                       language={language}
                       setLanguageChangeUrls={() => {}}
                       t={key => key} />
    ).instance().mapLanguageToUrl

    expect(mapLanguageToUrl(language)).toBe(`/${location}/${language}`)
  })

  describe('connect', () => {
    const languagesEndpoint = new EndpointBuilder('languages')
      .withStateToUrlMapper(() => 'https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(languages)
      .build()

    const locationsEndpoint = new EndpointBuilder('locations')
      .withStateToUrlMapper(() => 'https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(locations)
      .build()

    const pathname = '/augsburg/tu'
    const id = '1234'

    test('should map state to props', () => {
      const store = createReduxStore(createHistory, {
        router: {
          params: {location, language},
          pathname,
          query: {id}
        },
        languageChangeUrls: {}
      })

      const languageFailure = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[locationsEndpoint, languagesEndpoint]}>
            <ConnectedLanguageFailure />
          </EndpointProvider>
        </Provider>
      ).find(LanguageFailure)

      expect(languageFailure.props()).toEqual({
        location: location,
        setLanguageChangeUrls: expect.any(Function),
        t: expect.any(Function),
        locations: locations,
        languages: languages
      })
    })

    test('should map dispatch to props', () => {
      const store = createReduxStore(createHistory, {
        router: {
          params: {location: location, language: language},
          pathname: pathname,
          query: {id: id}
        },
        languageChangeUrls: {}
      })

      const languageChangeUrls = {
        en: '/augsburg/en',
        ar: '/augsburg/ar',
        de: '/augsburg/de'
      }

      expect(store.getState().languageChangeUrls).not.toEqual(languageChangeUrls)

      mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[locationsEndpoint, languagesEndpoint]}>
            <ConnectedLanguageFailure />
          </EndpointProvider>
        </Provider>
      ).find(LanguageFailure)

      expect(store.getState().languageChangeUrls).toEqual(languageChangeUrls)
    })
  })
})
