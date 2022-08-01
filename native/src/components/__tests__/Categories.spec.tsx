import * as React from 'react'
import TestRenderer from 'react-test-renderer'

import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'

import CategoriesRouteStateView from '../../models/CategoriesRouteStateView'
import Categories from '../Categories'
import Page from '../Page'

jest.mock('../Page', () => {
  const { Text } = require('react-native')

  return () => <Text>Page</Text>
})
jest.mock('../PageDetail', () => {
  const { Text } = require('react-native')

  return () => <Text>PageDetail</Text>
})
describe('Categories', () => {
  it('should pass an empty object to Page if the resource cache doesnt contain an appropriate entry', () => {
    const cityModel = new CityModelBuilder(1).build()[0]!
    const language = new LanguageModelBuilder(1).build()[0]!
    const categoriesMapModel = new CategoriesMapModelBuilder(cityModel.code, language.code).build()
    const categoryLeaf = categoriesMapModel.toArray().find(category => categoriesMapModel.isLeaf(category))

    if (!categoryLeaf) {
      throw Error('There should be a leaf!')
    }

    const stateView = new CategoriesRouteStateView(
      categoryLeaf.path,
      {
        [categoryLeaf.path]: categoryLeaf,
      },
      {
        [categoryLeaf.path]: [],
      }
    )
    const result = TestRenderer.create(
      <Categories
        cityModel={cityModel}
        language={language.code}
        stateView={stateView}
        navigateTo={() => undefined}
        navigateToFeedback={() => undefined}
        resourceCacheUrl='http://localhost:8080'
        resourceCache={{
          notAvailable: {},
        }}
      />
    )
    const pageInstance = result.root.findByType(Page)
    expect(pageInstance.props).toEqual(
      expect.objectContaining({
        files: {},
      })
    )
  })
})
