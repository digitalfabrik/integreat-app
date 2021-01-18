// @flow

import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import Page from '../../../common/components/Page'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'
import Categories from '../Categories'
import lightTheme from '../../../theme/constants'
import CategoriesRouteStateView from '../../../app/CategoriesRouteStateView'

jest.mock('../../../../modules/common/components/Page', () => {
  const Text = require('react-native').Text
  return () => <Text>Page</Text>
})

jest.mock('../../../../modules/common/components/PageDetail', () => {
  const Text = require('react-native').Text
  return () => <Text>PageDetail</Text>
})

jest.mock('rn-fetch-blob')

describe('Categories', () => {
  it('should pass an empty object to Page if the resource cache doesnt contain an appropriate entry', () => {
    const cityModel = new CityModelBuilder(1).build()[0]
    const languages = new LanguageModelBuilder(1).build()
    const categoriesMapModel = new CategoriesMapModelBuilder(cityModel.code, languages[0].code).build()
    const categoryLeaf = categoriesMapModel.toArray().find(category => category.isLeaf(categoriesMapModel))
    if (!categoryLeaf) {
      throw Error('There should be a leaf!')
    }
    const stateView = new CategoriesRouteStateView(
      categoryLeaf.path,
      { [categoryLeaf.path]: categoryLeaf },
      { [categoryLeaf.path]: [] }
    )
    const result = TestRenderer.create(
      <Categories cityModel={cityModel} language={languages[0].code} stateView={stateView}
                  navigateToCategory={() => {}} navigateToFeedback={() => {}}
                  resourceCacheUrl='http://localhost:8080' navigateToLink={() => {}}
                  resourceCache={{ notAvailable: {} }} theme={lightTheme} t={key => key} />
    )
    const pageInstance = result.root.findByType(Page)
    expect(pageInstance.props).toEqual(expect.objectContaining({
      files: {}
    }))
  })
})
