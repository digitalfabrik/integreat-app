// @flow

import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import CityModelBuilder from '../../../../testing/builder/CityModelBuilder'
import LanguageModelBuilder from '../../../../testing/builder/LanguageModelBuilder'
import Page from '../../../common/components/Page'
import createNavigationScreenPropMock from '../../../test-utils/createNavigationScreenPropMock'
import CategoriesMapModelBuilder from '../../../../testing/builder/CategoriesMapModelBuilder'
import Categories from '../Categories'
import brightTheme from '../../../theme/constants/theme'
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
    const cities = new CityModelBuilder(1).build()
    const languages = new LanguageModelBuilder(1).build()
    const categoriesMapModel = new CategoriesMapModelBuilder(cities[0].code, languages[0].code).build()
    const navigation = createNavigationScreenPropMock()
    const categoryLeaf = categoriesMapModel.toArray().find(category => category.isLeaf(categoriesMapModel))
    const stateView = new CategoriesRouteStateView(
      categoryLeaf.path,
      { [categoryLeaf.path]: categoryLeaf },
      { [categoryLeaf.path]: [] }
    )
    const result = TestRenderer.create(
      <Categories cities={cities} language={languages[0].code} stateView={stateView} cityCode={cities[0].code}
                  navigateToCategory={() => {}} navigateToIntegreatUrl={() => {}} navigation={navigation}
                  resourceCache={{ notAvailable: {} }} theme={brightTheme} t={key => key} />
    )
    const pageInstance = result.root.findByType(Page)
    expect(pageInstance.props).toEqual(expect.objectContaining({
      files: {}
    }))
  })
})
