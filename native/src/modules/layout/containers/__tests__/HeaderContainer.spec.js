// @flow

import * as React from 'react'
import configureMockStore from 'redux-mock-store'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import type { StateType } from '../../../app/StateType'
import {
  CATEGORIES_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE
} from 'api-client'
import HeaderContainer from '../HeaderContainer'
import { render } from '@testing-library/react-native'
import { Provider } from 'react-redux'

const mockStore = configureMockStore()
jest.mock('react-i18next')
jest.useFakeTimers()

jest.mock('../../components/Header', () => {
  const Text = require('react-native').Text
  // $FLowFixMe props are incompatible with text props, but this is just for testing purposes to assert on props
  return (props: { ... }) => <Text {...props}>Header</Text>
})

describe('HeaderContainer', () => {
  let store, state

  beforeEach(() => {
    jest.clearAllMocks()
    state = prepareState()
    store = mockStore(state)
  })

  const [city] = new CityModelBuilder(1).build()
  const languages = new LanguageModelBuilder(1).build()
  const language = languages[0]
  const prepareState = (): StateType => {
    return {
      darkMode: false,
      resourceCacheUrl: 'http://localhost:8080',
      cityContent: {
        city: city.code,
        languages: {
          status: 'ready',
          models: [language]
        },
        routeMapping: {
          routeKey1: {
            routeType: CATEGORIES_ROUTE,
            status: 'ready',
            path: `${city.code}/${language.code}/abc`,
            depth: 1,
            language: language.code,
            city: city.code,
            allAvailableLanguages: new Map(),
            models: {},
            children: {}
          },
          routeKeyEvent1: {
            routeType: EVENTS_ROUTE,
            status: 'ready',
            path: null,
            language: language.code,
            city: city.code,
            models: [],
            allAvailableLanguages: new Map()
          },
          routeKeyEvent2: {
            routeType: EVENTS_ROUTE,
            status: 'ready',
            path: `${city.code}/${language.code}/${EVENTS_ROUTE}/specific-event`,
            language: language.code,
            city: city.code,
            models: [],
            allAvailableLanguages: new Map()
          },
          routeKeyPois1: {
            routeType: POIS_ROUTE,
            status: 'ready',
            path: null,
            language: language.code,
            city: city.code,
            allAvailableLanguages: new Map(),
            models: []
          },
          routeKeyNews1: {
            routeType: NEWS_ROUTE,
            status: 'ready',
            models: [],
            hasMoreNews: false,
            page: 1,
            newsId: null,
            language: language.code,
            city: city.code,
            type: LOCAL_NEWS_TYPE,
            allAvailableLanguages: new Map()
          }
        },
        searchRoute: null,
        resourceCache: {
          status: 'ready',
          progress: 0,
          value: { file: {} }
        },
        switchingLanguage: false
      },
      contentLanguage: 'en',
      cities: {
        status: 'ready',
        models: [city]
      },
      snackbar: []
    }
  }

  const assertProps = (props, expected, customStore = store) => {
    const { getByText } = render(
      <Provider store={customStore}>
        {/* $FlowFixMe not all props passed */}
        <HeaderContainer {...props} />
      </Provider>
    )
    const header = getByText('Header')
    expect(header.props).toEqual(expect.objectContaining(expected))
  }

  it('shareUrl should be set correctly for categories route', () => {
    const ownProps = {
      scene: {
        route: {
          key: 'routeKey1'
        }
      }
    }
    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/abc`
    assertProps(ownProps, { shareUrl: expectedShareUrl })
  })

  it('shareUrl should be set correctly for events overview route', () => {
    const ownProps = {
      scene: {
        route: {
          name: EVENTS_ROUTE,
          key: 'routeKeyEvent1'
        }
      }
    }
    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/${EVENTS_ROUTE}`
    assertProps(ownProps, { shareUrl: expectedShareUrl })
  })

  it('shareUrl should be set correctly for specific event route', () => {
    const ownProps = {
      scene: {
        route: {
          name: EVENTS_ROUTE,
          key: 'routeKeyEvent2'
        }
      }
    }
    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/${EVENTS_ROUTE}/specific-event`
    assertProps(ownProps, { shareUrl: expectedShareUrl })
  })

  it('shareUrl should be set correctly for local news route', () => {
    const ownProps = {
      scene: {
        route: {
          name: NEWS_ROUTE,
          key: 'routeKeyNews1'
        }
      }
    }

    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}`
    assertProps(ownProps, { shareUrl: expectedShareUrl })
  })

  it('shareUrl should be set correctly for local news details route', () => {
    const ownProps = {
      scene: {
        route: {
          name: NEWS_ROUTE,
          key: 'routeKeyNews1'
        }
      }
    }

    const state = prepareState()
    // $FlowFixMe Everything correct here, nothing to see.
    state.cityContent.routeMapping.routeKeyNews1.newsId = '12345'

    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}/12345`
    assertProps(ownProps, { shareUrl: expectedShareUrl }, mockStore(state))
  })

  it('shareUrl should be set correctly for offers route', () => {
    const ownProps = {
      scene: {
        route: {
          name: OFFERS_ROUTE
        }
      }
    }

    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/${OFFERS_ROUTE}`
    assertProps(ownProps, { shareUrl: expectedShareUrl })
  })

  it('shareUrl should be set correctly for sprungbrett offer route', () => {
    const ownProps = {
      scene: {
        route: {
          name: SPRUNGBRETT_OFFER_ROUTE
        }
      }
    }

    const shareUrl = `https://integreat.app/${city.code}/${language.code}/${OFFERS_ROUTE}/${SPRUNGBRETT_OFFER_ROUTE}`
    assertProps(ownProps, { shareUrl })
  })

  it('shareUrl should be set correctly for disclaimer route', () => {
    const ownProps = {
      scene: {
        route: {
          name: DISCLAIMER_ROUTE,
          params: { cityCode: 'nuernberg', languageCode: 'ar' }
        }
      }
    }

    const expectedShareUrl = `https://integreat.app/nuernberg/ar/${DISCLAIMER_ROUTE}`
    assertProps(ownProps, { shareUrl: expectedShareUrl })
  })

  it('shareUrl should be set correctly for pois overview route', () => {
    const ownProps = {
      scene: {
        route: {
          name: POIS_ROUTE,
          key: 'routeKeyPois1'
        }
      }
    }

    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/${POIS_ROUTE}`
    assertProps(ownProps, { shareUrl: expectedShareUrl })
  })
})
