import React from 'react'

import { CategoriesMapModelBuilder, CityModelBuilder, LanguageModelBuilder } from 'api-client'

import render from '../../testing/render'
import CategoryListItem from '../CategoryListItem'

jest.mock('styled-components')
jest.mock('react-native-webview', () => ({
  default: () => jest.fn(),
}))

describe('CategoryListItem', () => {
  const cityModel = new CityModelBuilder(1).build()[0]!
  const language = new LanguageModelBuilder(1).build()[0]!
  const { categories: categoriesMapModel, resourceCache } = new CategoriesMapModelBuilder(
    cityModel.code,
    language.code
  ).buildAll()
  const categories = categoriesMapModel.toArray()
  const category = categories[0]!
  const subCategories = categories.filter(otherCategory => otherCategory.parentPath === category.path)

  const onItemPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render category and subcategories', () => {
    const { getByText } = render(
      <CategoryListItem
        category={category}
        subCategories={subCategories}
        onItemPress={onItemPress}
        resourceCache={resourceCache}
        language={language.code}
      />
    )

    expect(getByText(category.title)).toBeTruthy()
    expect(getByText(subCategories[0]!.title)).toBeTruthy()
    expect(getByText(subCategories[1]!.title)).toBeTruthy()
  })
})
