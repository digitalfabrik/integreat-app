import React from 'react'
import TestRenderer from 'react-test-renderer'

import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'

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
    const category = categoriesMapModel.toArray().find(category => categoriesMapModel.isLeaf(category))!

    const result = TestRenderer.create(
      <Categories
        cityModel={cityModel}
        language={language.code}
        category={category}
        categories={categoriesMapModel}
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
