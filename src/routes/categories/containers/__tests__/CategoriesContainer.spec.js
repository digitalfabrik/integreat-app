// @flow

import type {
  CategoryRouteStateType,
  LanguageResourceCacheStateType,
  StateType
} from '../../../../modules/app/StateType'
import CityModelBuilder from '../../../../testing/builder/CityModelBuilder'
import LanguageModelBuilder from '../../../../testing/builder/LanguageModelBuilder'
import CategoriesMapModelBuilder from '../../../../testing/builder/CategoriesMapModelBuilder'
import { flatMap, reduce } from 'lodash'
import configureMockStore from 'redux-mock-store'
import React from 'react'
import { Provider } from 'react-redux'
import createNavigationScreenPropMock from '../../../../modules/test-utils/createNavigationScreenPropMock'
import { Text } from 'react-native'
import TestRenderer from 'react-test-renderer'
import { render } from '@testing-library/react-native'
import CategoriesRouteStateView from '../../../../modules/app/CategoriesRouteStateView'
import brightTheme from '../../../../modules/theme/constants/theme'
import moment from 'moment'

jest.mock('react-i18next')

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
  const categoriesMap = new CategoriesMapModelBuilder(city.code, language.code).build()
  const resourceCache: LanguageResourceCacheStateType = {
    'some-path': {
      'some-url': {
        filePath: 'some-file-path',
        lastUpdate: moment('2016-02-01T10:35:20Z'),
        hash: '12345678'
      }
    }
  }

  const prepareState = (routeState: ?CategoryRouteStateType, params = { switchingLanguage: false }): StateType => {
    return {
      darkMode: false,
      cityContent: {
        city: city.code,
        switchingLanguage: params.switchingLanguage,
        languages: [language],
        categoriesRouteMapping: routeState ? { 'route-id-0': routeState } : {},
        eventsRouteMapping: {},
        resourceCache: { status: 'ready', value: resourceCache },
        searchRoute: null
      },
      contentLanguage: 'de',
      cities: { status: 'ready', models: [city] }
    }
  }

  const rootCategory = categoriesMap.findCategoryByPath(`/${city.code}/${language.code}`)
  const models = reduce(
    flatMap(
      flatMap(categoriesMap.getChildren(rootCategory), child => [child, ...categoriesMap.getChildren(child)]),
      child => [child, ...categoriesMap.getChildren(child)]
    ),
    (acc, model) => ({ ...acc, [model.path]: model }),
    { [rootCategory.path]: rootCategory })
  const children = reduce(
    flatMap(categoriesMap.getChildren(rootCategory), child => [child, ...categoriesMap.getChildren(child)]),
    (acc, model) => ({ ...acc, [model.path]: categoriesMap.getChildren(model).map(child => child.path) }),
    { [rootCategory.path]: categoriesMap.getChildren(rootCategory).map(child => child.path) })

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

  it('should display error if the route has the status error', () => {
    const state: StateType = prepareState({
      status: 'error',
      path: rootCategory.path,
      depth: 2,
      language: language.code,
      city: city.code,
      message: 'Something went wrong'
    })
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    navigation.state.key = 'route-id-0'
    jest.doMock('../../../../modules/categories/components/Categories', () => MockCategories)
    const CategoriesContainer = require('../CategoriesContainer').default

    const { getByText } = render(
      <Provider store={store}><CategoriesContainer navigation={navigation} /></Provider>
    )
    expect(getByText('Something went wrong')).toBeTruthy()
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
