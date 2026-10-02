import React from 'react'

import { CategoriesMapModelBuilder, RegionModelBuilder, LanguageModelBuilder } from 'shared/api'

import render from '../../testing/render'
import CategoryListItem from '../CategoryListItem'

jest.mock('styled-components')

describe('CategoryListItem', () => {
  const regionModel = new RegionModelBuilder(1).build()[0]!
  const language = new LanguageModelBuilder(1).build()[0]!
  const { categories: categoriesMapModel } = new CategoriesMapModelBuilder(regionModel.code, language.code).buildAll()
  const categories = categoriesMapModel.toArray()
  const category = categories[0]!

  const onItemPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render category and subcategories', () => {
    const { getByText } = render(
      <CategoryListItem category={category} onItemPress={onItemPress} language={language.code} />,
    )

    expect(getByText(category.title)).toBeTruthy()
  })
})
