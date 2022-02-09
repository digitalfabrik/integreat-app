import React from 'react'

import buildConfig from '../../constants/buildConfig'
import render from '../../testing/render'
import { CategoryListModelType } from '../CategoryList'
import CategoryListItem from '../CategoryListItem'

describe('CategoryListItem', () => {
  const subCategories: [CategoryListModelType, CategoryListModelType] = [
    {
      title: 'sub 1',
      thumbnail: 'thumbnail',
      path: 'path/to/sub1'
    },
    {
      title: 'sub 2',
      thumbnail: 'thumbnail',
      path: 'path/to/sub2'
    }
  ]

  const category: CategoryListModelType = {
    title: 'category',
    thumbnail: 'thumbnail',
    path: 'path/to',
    contentWithoutHtml: 'This is some test content.'
  }

  const onItemPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render category and subcategories', () => {
    const language = 'de'
    const { getByText, queryByText } = render(
      <CategoryListItem
        theme={buildConfig().lightTheme}
        category={category}
        subCategories={subCategories}
        onItemPress={onItemPress}
        language={language}
      />
    )
    expect(getByText(category.title)).toBeTruthy()

    expect(queryByText(category.contentWithoutHtml!)).toBeFalsy()

    expect(getByText(subCategories[0].title)).toBeTruthy()

    expect(getByText(subCategories[1].title)).toBeTruthy()
  })

  it('should render category and highlighted filtered text', () => {
    const language = 'de'
    const { getByText } = render(
      <CategoryListItem
        theme={buildConfig().lightTheme}
        query='test'
        category={category}
        subCategories={[]}
        onItemPress={onItemPress}
        language={language}
      />
    )

    expect(getByText(category.title)).toBeTruthy()
    expect(getByText('This is some content.')).toBeTruthy()
  })
})
