import { render } from '@testing-library/react-native'
import * as React from 'react'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import configureMockStore from 'redux-mock-store'
import { StateType } from 'src/redux/StateType'
import { StoreActionType } from 'src/redux/StoreActionType'

import {
  CATEGORIES_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  TU_NEWS_TYPE
} from 'api-client'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'

import mockStackHeaderProps from '../../testing/mockStackHeaderProps'
import HeaderContainer from '../HeaderContainer'

const mockStore = configureMockStore<StateType, StoreActionType>()
jest.mock('react-i18next')
jest.useFakeTimers('modern')
jest.mock('../../components/Header', () => {
  const { Text } = require('react-native')

  return (props: Record<string, unknown>) => <Text {...props}>Header</Text>
})

type OwnPropsType = React.ComponentProps<typeof HeaderContainer>

describe('HeaderContainer', () => {
  let store: Store<StateType, StoreActionType>
  let state: StateType
  const city = new CityModelBuilder(1).build()[0]!
  const languages = new LanguageModelBuilder(1).build()
  const language = languages[0]!

  const prepareState = (): StateType => ({
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
        }
      },
      searchRoute: null,
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {
          file: {}
        }
      },
      switchingLanguage: false
    },
    contentLanguage: 'en',
    cities: {
      status: 'ready',
      models: [city]
    },
    snackbar: []
  })

  beforeEach(() => {
    jest.clearAllMocks()
    state = prepareState()
    store = mockStore(state)
  })

  const assertProps = (props: OwnPropsType, expected: { [key: string]: string }, customStore = store) => {
    const { getByText } = render(
      <Provider store={customStore}>
        <HeaderContainer {...props} />
      </Provider>
    )
    const header = getByText('Header')
    expect(header.props).toEqual(expect.objectContaining(expected))
  }

  it('shareUrl should be set correctly for categories route', () => {
    const ownProps = mockStackHeaderProps({
      scene: {
        route: {
          key: 'routeKey1'
        }
      }
    })
    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/abc`
    assertProps(ownProps, {
      shareUrl: expectedShareUrl
    })
  })

  it('shareUrl should be set correctly for events overview route', () => {
    const ownProps = mockStackHeaderProps({
      scene: {
        route: {
          name: EVENTS_ROUTE,
          key: 'routeKeyEvent1'
        }
      }
    })
    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/${EVENTS_ROUTE}`
    assertProps(ownProps, {
      shareUrl: expectedShareUrl
    })
  })

  it('shareUrl should be set correctly for specific event route', () => {
    const ownProps = mockStackHeaderProps({
      scene: {
        route: {
          name: EVENTS_ROUTE,
          key: 'routeKeyEvent2'
        }
      }
    })
    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/${EVENTS_ROUTE}/specific-event`
    assertProps(ownProps, {
      shareUrl: expectedShareUrl
    })
  })

  it('shareUrl should be set correctly for local news route', () => {
    const ownProps = mockStackHeaderProps({
      scene: {
        route: {
          name: NEWS_ROUTE,
          key: 'routeKeyNews1',
          params: {
            cityCode: city.code,
            languageCode: language.code,
            newsType: LOCAL_NEWS_TYPE
          }
        }
      }
    })
    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}`
    assertProps(ownProps, {
      shareUrl: expectedShareUrl
    })
  })

  it('shareUrl should be set correctly for local news details route', () => {
    const ownProps = mockStackHeaderProps({
      scene: {
        route: {
          name: NEWS_ROUTE,
          key: 'routeKeyNews1',
          params: {
            cityCode: city.code,
            languageCode: language.code,
            newsType: LOCAL_NEWS_TYPE,
            newsId: '12345'
          }
        }
      }
    })

    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}/12345`
    assertProps(ownProps, {
      shareUrl: expectedShareUrl
    })
  })

  it('shareUrl should be set correctly for tunews route', () => {
    const ownProps = mockStackHeaderProps({
      scene: {
        route: {
          name: NEWS_ROUTE,
          key: 'routeKeyNews1',
          params: {
            cityCode: city.code,
            languageCode: language.code,
            newsType: TU_NEWS_TYPE
          }
        }
      }
    })
    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/${NEWS_ROUTE}/${TU_NEWS_TYPE}`
    assertProps(ownProps, {
      shareUrl: expectedShareUrl
    })
  })

  it('shareUrl should be set correctly for tunews details route', () => {
    const ownProps = mockStackHeaderProps({
      scene: {
        route: {
          name: NEWS_ROUTE,
          key: 'routeKeyNews1',
          params: {
            cityCode: city.code,
            languageCode: language.code,
            newsType: TU_NEWS_TYPE,
            newsId: '12345'
          }
        }
      }
    })

    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/${NEWS_ROUTE}/${TU_NEWS_TYPE}/12345`
    assertProps(ownProps, {
      shareUrl: expectedShareUrl
    })
  })

  it('shareUrl should be set correctly for offers route', () => {
    const ownProps = mockStackHeaderProps({
      scene: {
        route: {
          name: OFFERS_ROUTE
        }
      }
    })
    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/${OFFERS_ROUTE}`
    assertProps(ownProps, {
      shareUrl: expectedShareUrl
    })
  })

  it('shareUrl should be set correctly for sprungbrett offer route', () => {
    const ownProps = mockStackHeaderProps({
      scene: {
        route: {
          name: SPRUNGBRETT_OFFER_ROUTE
        }
      }
    })
    const shareUrl = `https://integreat.app/${city.code}/${language.code}/${OFFERS_ROUTE}/${SPRUNGBRETT_OFFER_ROUTE}`
    assertProps(ownProps, {
      shareUrl
    })
  })

  it('shareUrl should be set correctly for disclaimer route', () => {
    const ownProps = mockStackHeaderProps({
      scene: {
        route: {
          name: DISCLAIMER_ROUTE,
          params: {
            cityCode: 'nuernberg',
            languageCode: 'ar'
          }
        }
      }
    })
    const expectedShareUrl = `https://integreat.app/nuernberg/ar/${DISCLAIMER_ROUTE}`
    assertProps(ownProps, {
      shareUrl: expectedShareUrl
    })
  })

  it('shareUrl should be set correctly for pois overview route', () => {
    const ownProps = mockStackHeaderProps({
      scene: {
        route: {
          name: POIS_ROUTE,
          key: 'routeKeyPois1'
        }
      }
    })
    const expectedShareUrl = `https://integreat.app/${city.code}/${language.code}/${POIS_ROUTE}`
    assertProps(ownProps, {
      shareUrl: expectedShareUrl
    })
  })
})
