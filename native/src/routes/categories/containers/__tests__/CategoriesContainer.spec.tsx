import {
  CategoryRouteStateType,
  CitiesStateType,
  LanguageResourceCacheStateType,
  LanguagesStateType,
  ResourceCacheStateType,
  StateType
} from '../../../../modules/app/StateType'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'
import { reduce } from 'lodash'
import configureMockStore from 'redux-mock-store'
import React from 'react'
import { Provider } from 'react-redux'
import createNavigationScreenPropMock from '../../../../testing/createNavigationPropMock'
import { render } from '@testing-library/react-native'
import moment from 'moment'
import { LOADING_TIMEOUT } from '../../../../modules/common/constants'
import { ErrorCode } from '../../../../modules/error/ErrorCodes'
import { CATEGORIES_ROUTE } from 'api-client/src/routes'
import CategoriesContainer from '../CategoriesContainer'
const mockStore = configureMockStore()
jest.mock('react-i18next')
jest.useFakeTimers()
jest.mock('../../../../modules/categories/components/Categories', () => {
  const Text = require('react-native').Text

  return () => <Text>Categories</Text>
})
jest.mock('../../../../modules/error/containers/FailureContainer', () => {
  const Text = require('react-native').Text

  return ({ code }: { code: string }) => <Text>Failure {code}</Text>
})
jest.mock('../../../../modules/common/containers/LanguageNotAvailableContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>LanguageNotAvailable</Text>
})
jest.mock('react-native/Libraries/Components/RefreshControl/RefreshControl', () => {
  const Text = require('react-native').Text

  return ({ refreshing }: { refreshing: boolean }) => (refreshing ? <Text>loading</Text> : null)
})
const route = {
  key: 'route-id-0',
  params: undefined,
  name: CATEGORIES_ROUTE
}
describe('CategoriesContainer', () => {
  const [city] = new CityModelBuilder(1).build()
  const languages = new LanguageModelBuilder(2).build()
  const language = languages[0]
  // a categoriesMap of depth 2
  const categoriesMap = new CategoriesMapModelBuilder(city.code, language.code, 3, 2).build()
  const resourceCache: LanguageResourceCacheStateType = {
    'some-path': {
      'some-url': {
        filePath: 'some-file-path',
        lastUpdate: moment('2016-02-01T10:35:20Z'),
        hash: '12345678'
      }
    }
  }
  const resourceCacheUrl = 'http://localhost:8080'

  const prepareState = (
    routeState?: CategoryRouteStateType,
    {
      switchingLanguage,
      cities,
      languages,
      resourceCacheState
    }: {
      switchingLanguage?: boolean
      cities?: CitiesStateType
      languages?: LanguagesStateType
      resourceCacheState?: ResourceCacheStateType
    } = {}
  ): StateType => {
    return {
      darkMode: false,
      resourceCacheUrl,
      cityContent: {
        city: city.code,
        switchingLanguage: switchingLanguage !== undefined ? switchingLanguage : false,
        languages: languages || {
          status: 'ready',
          models: [language]
        },
        routeMapping: routeState
          ? {
              'route-id-0': routeState
            }
          : {},
        resourceCache: resourceCacheState || {
          status: 'ready',
          progress: 0,
          value: resourceCache
        },
        searchRoute: null
      },
      contentLanguage: 'de',
      cities: cities || {
        status: 'ready',
        models: [city]
      },
      snackbar: []
    }
  }

  const rootCategory = categoriesMap.findCategoryByPath(`/${city.code}/${language.code}`)

  if (!rootCategory) {
    throw Error("The root category was not found. Sth's odd.")
  }

  const models = reduce(categoriesMap.toArray(), (acc, model) => ({ ...acc, [model.path]: model }), {})
  const children = reduce(
    [rootCategory, ...categoriesMap.getChildren(rootCategory)],
    (acc, model) => ({ ...acc, [model.path]: categoriesMap.getChildren(model).map(child => child.path) }),
    {}
  )
  const successfulRouteState: CategoryRouteStateType = {
    routeType: CATEGORIES_ROUTE,
    status: 'ready',
    path: rootCategory.path,
    depth: 2,
    language: language.code,
    city: city.code,
    allAvailableLanguages: new Map(languages.map(lng => [lng.code, `/${city.code}/${lng.code}`])),
    models,
    children
  }
  it('should display nothing if the route is not initialized', () => {
    const state: StateType = prepareState()
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    const { getByText } = render(
      <Provider store={store}>
        <CategoriesContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(() => getByText('Categories')).toThrow()
    expect(() => getByText('Failure')).toThrow()
    expect(() => getByText('LanguageNotAvailable')).toThrow()
    expect(() => getByText('loading')).toThrow()
  })

  const expectError = (state: StateType, code: string) => {
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    const { getByText } = render(
      <Provider store={store}>
        <CategoriesContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(getByText(`Failure ${code}`)).toBeTruthy()
  }

  it('should display error if the route has the status error', () => {
    const state: StateType = prepareState({
      routeType: CATEGORIES_ROUTE,
      status: 'error',
      path: rootCategory.path,
      depth: 2,
      language: language.code,
      city: city.code,
      message: 'Something went wrong with the route',
      code: ErrorCode.UnknownError
    })
    expectError(state, ErrorCode.UnknownError)
  })
  it('should display error if cities could not be loaded', () => {
    const state: StateType = prepareState(successfulRouteState, {
      cities: {
        status: 'error',
        message: 'Something went wrong with the cities',
        code: ErrorCode.UnknownError
      }
    })
    expectError(state, ErrorCode.UnknownError)
  })
  it('should display error if resourceCache could not be loaded', () => {
    const state: StateType = prepareState(successfulRouteState, {
      resourceCacheState: {
        status: 'error',
        message: 'Something went wrong with the resourceCache',
        code: ErrorCode.UnknownError
      }
    })
    expectError(state, ErrorCode.UnknownError)
  })

  const expectLoadingIndicator = (state: StateType) => {
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    const { getByText } = render(
      <Provider store={store}>
        <CategoriesContainer navigation={navigation} route={route} />
      </Provider>
    )
    jest.advanceTimersByTime(LOADING_TIMEOUT)
    expect(getByText('loading')).toBeTruthy()
  }

  it('should display loading indicator if the route is loading long enough', () => {
    const state: StateType = prepareState({
      routeType: CATEGORIES_ROUTE,
      status: 'loading',
      path: rootCategory.path,
      depth: 2,
      language: language.code,
      city: city.code
    })
    expectLoadingIndicator(state)
  })
  it('should display loading indicator if switching languages lasts long enough', () => {
    const state: StateType = prepareState(successfulRouteState, {
      switchingLanguage: true
    })
    expectLoadingIndicator(state)
  })
  it('should display loading indicator if cities are loading long enough', () => {
    const state: StateType = prepareState(successfulRouteState, {
      cities: {
        status: 'loading'
      }
    })
    expectLoadingIndicator(state)
  })
  it('should display loading indicator if languages are loading long enough', () => {
    const state: StateType = prepareState(successfulRouteState, {
      languages: {
        status: 'loading'
      }
    })
    expectLoadingIndicator(state)
  })
  it('should display LanguageNotAvailable if the route has the corresponding status', () => {
    const state = prepareState({
      routeType: CATEGORIES_ROUTE,
      status: 'languageNotAvailable',
      depth: 2,
      city: city.code,
      language: language.code,
      allAvailableLanguages: new Map(languages.map(lng => [lng.code, `/${city.code}/${lng.code}`]))
    })
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    const { getByText } = render(
      <Provider store={store}>
        <CategoriesContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(getByText('LanguageNotAvailable')).toBeTruthy()
  })
  it('should display Categories component if the state is ready', () => {
    const state: StateType = prepareState(successfulRouteState)
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    const { getByText } = render(
      <Provider store={store}>
        <CategoriesContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(getByText('Categories')).toBeTruthy()
  })
})
