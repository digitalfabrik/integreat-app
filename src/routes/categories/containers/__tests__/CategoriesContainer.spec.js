// @flow

import type {
  CategoryRouteStateType,
  CitiesStateType,
  LanguageResourceCacheStateType,
  ResourceCacheStateType,
  StateType
} from '../../../../modules/app/StateType'
import CityModelBuilder from '../../../../testing/builder/CityModelBuilder'
import LanguageModelBuilder from '../../../../testing/builder/LanguageModelBuilder'
import CategoriesMapModelBuilder from '../../../../testing/builder/CategoriesMapModelBuilder'
import { reduce } from 'lodash'
import configureMockStore from 'redux-mock-store'
import React from 'react'
import { Provider } from 'react-redux'
import createNavigationScreenPropMock from '../../../../modules/test-utils/createNavigationScreenPropMock'
import { ScrollView, Text } from 'react-native'
import TestRenderer from 'react-test-renderer'
import { render } from '@testing-library/react-native'
import CategoriesRouteStateView from '../../../../modules/app/CategoriesRouteStateView'
import brightTheme from '../../../../modules/theme/constants/theme'
import moment from 'moment'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import { LOADING_TIMEOUT } from '../../../../modules/common/constants'

jest.mock('react-i18next')
jest.useFakeTimers()

const mockStore = configureMockStore()

class MockCategories extends React.Component<{}> {
  render () {
    return <Text>Categories</Text>
  }
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

  const prepareState = (
    routeState: ?CategoryRouteStateType,
    {
      switchingLanguage,
      cities,
      languages,
      resourceCacheState
    }: {|
      switchingLanguage?: boolean,
      cities?: CitiesStateType,
      languages?: ?Array<LanguageModel>,
      resourceCacheState?: ResourceCacheStateType
    |} = {}
  ): StateType => {
    return {
      darkMode: false,
      cityContent: {
        city: city.code,
        switchingLanguage: switchingLanguage !== undefined ? switchingLanguage : false,
        languages: languages !== undefined ? languages : [language],
        categoriesRouteMapping: routeState ? { 'route-id-0': routeState } : {},
        eventsRouteMapping: {},
        resourceCache: resourceCacheState || { status: 'ready', value: resourceCache },
        searchRoute: null
      },
      contentLanguage: 'de',
      cities: cities || { status: 'ready', models: [city] }
    }
  }

  const rootCategory = categoriesMap.findCategoryByPath(`/${city.code}/${language.code}`)
  const models = reduce(categoriesMap.toArray(), (acc, model) => ({ ...acc, [model.path]: model }), {})
  const children = reduce(
    [rootCategory, ...categoriesMap.getChildren(rootCategory)],
    (acc, model) => ({ ...acc, [model.path]: categoriesMap.getChildren(model).map(child => child.path) }),
    {})

  const successfulRouteState: CategoryRouteStateType = {
    status: 'ready',
    path: rootCategory.path,
    depth: 2,
    language: language.code,
    city: city.code,
    allAvailableLanguages: new Map(languages.map(lng => [lng.code, `/${city.code}/${lng.code}`])),
    models,
    children
  }

  it('should display null if the route is not initialized', () => {
    const state: StateType = prepareState()
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    navigation.state.key = 'route-id-0'
    jest.doMock('../../../../modules/categories/components/Categories', () => MockCategories)
    const CategoriesContainer = require('../CategoriesContainer').default

    const result = TestRenderer.create(
      <Provider store={store}><CategoriesContainer navigation={navigation} /></Provider>
    )
    expect(result.toJSON()).toBeNull()
  })

  const expectError = (state: StateType, message: string) => {
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    navigation.state.key = 'route-id-0'
    jest.doMock('../../../../modules/categories/components/Categories', () => MockCategories)
    const CategoriesContainer = require('../CategoriesContainer').default

    const { getByText } = render(
      <Provider store={store}><CategoriesContainer navigation={navigation} /></Provider>
    )
    expect(getByText(message)).toBeTruthy()
  }

  it('should display error if the route has the status error', () => {
    const state: StateType = prepareState({
      status: 'error',
      path: rootCategory.path,
      depth: 2,
      language: language.code,
      city: city.code,
      message: 'Something went wrong with the route'
    })
    expectError(state, 'Something went wrong with the route')
  })

  it('should display error if cities could not be loaded', () => {
    const state: StateType = prepareState(successfulRouteState, {
      cities: {
        status: 'error',
        message: 'Something went wrong with the cities'
      }
    })
    expectError(state, 'Something went wrong with the cities')
  })

  it('should display error if resourceCache could not be loaded', () => {
    const state: StateType = prepareState(successfulRouteState, {
      resourceCacheState: {
        status: 'error',
        message: 'Something went wrong with the resourceCache'
      }
    })
    expectError(state, 'Something went wrong with the resourceCache')
  })

  const expectLoadingIndicator = (state: StateType) => {
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    navigation.state.key = 'route-id-0'
    jest.doMock('../../../../modules/categories/components/Categories', () => MockCategories)
    const CategoriesContainer = require('../CategoriesContainer').default
    const result = TestRenderer.create(
      <Provider store={store}><CategoriesContainer navigation={navigation} /></Provider>
    )
    jest.advanceTimersByTime(LOADING_TIMEOUT)
    const refreshControl = result.root.findByType(ScrollView).props.refreshControl
    expect(refreshControl.props.refreshing).toBe(true)
  }

  it('should display loading indicator if the route is loading long enough', () => {
    const state: StateType = prepareState({
      status: 'loading',
      path: rootCategory.path,
      depth: 2,
      language: language.code,
      city: city.code
    })
    expectLoadingIndicator(state)
  })

  it('should display loading indicator if switching languages lasts long enough', () => {
    const state: StateType = prepareState(successfulRouteState, { switchingLanguage: true })
    expectLoadingIndicator(state)
  })

  it('should display loading indicator if cities are loading long enough', () => {
    const state: StateType = prepareState(successfulRouteState, { cities: { status: 'loading' } })
    expectLoadingIndicator(state)
  })

  it('should display loading indicator if languages are loading long enough', () => {
    const state: StateType = prepareState(successfulRouteState, { languages: null })
    expectLoadingIndicator(state)
  })

  it('should display LanguageNotAvailable if the route has the corresponding status', () => {
    const state = prepareState({
      status: 'languageNotAvailable',
      depth: 2,
      city: city.code,
      language: language.code,
      allAvailableLanguages: new Map(languages.map(lng => [lng.code, `/${city.code}/${lng.code}`]))
    })
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    navigation.state.key = 'route-id-0'
    jest.doMock('../../../../modules/categories/components/Categories', () => MockCategories)
    const CategoriesContainer = require('../CategoriesContainer').default

    const { getByText } = render(
      <Provider store={store}><CategoriesContainer navigation={navigation} /></Provider>
    )
    expect(getByText('chooseALanguage')).toBeTruthy()
  })

  it('should display Categories component if the state is ready', () => {
    const state: StateType = prepareState(successfulRouteState)
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    navigation.state.key = 'route-id-0'
    jest.doMock('../../../../modules/categories/components/Categories', () => MockCategories)
    const CategoriesContainer = require('../CategoriesContainer').default
    const result = TestRenderer.create(
      <Provider store={store}><CategoriesContainer navigation={navigation} /></Provider>
    )
    const categoriesInstance = result.root.findByType(MockCategories)
    expect(categoriesInstance.props).toEqual({
      cities: [city],
      cityCode: city.code,
      language: language.code,
      navigateToCategory: expect.any(Function),
      navigateToIntegreatUrl: expect.any(Function),
      navigation,
      resourceCache,
      stateView: expect.any(CategoriesRouteStateView),
      t: expect.any(Function),
      theme: brightTheme
    })
    const stateView = categoriesInstance.props.stateView
    expect([stateView.root(), stateView.children()]).toEqual([rootCategory, categoriesMap.getChildren(rootCategory)])
  })
})
