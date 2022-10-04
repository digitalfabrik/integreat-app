import React from 'react'

import render from '../../testing/render'
import CategoryListItem from '../CategoryListItem'

describe('CategoryListItem', () => {
  const subCategories = [
    {
      title: 'sub 1',
      thumbnail: 'thumbnail',
      path: 'path/to/sub1',
    },
    {
      title: 'sub 2',
      thumbnail: 'thumbnail',
      path: 'path/to/sub2',
    },
  ]

  const item = {
    title: 'category',
    thumbnail: 'thumbnail',
    path: 'path/to',
    contentWithoutHtml: 'This is some test content.',
    subCategories,
  }
  const itemWithoutSubCategories = { ...item, subCategories: [] }

  const onItemPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render category and subcategories', () => {
    const language = 'de'
    const { getByText, queryByText } = render(
      <CategoryListItem item={item} onItemPress={onItemPress} language={language} />
    )
    expect(getByText(item.title)).toBeTruthy()

    expect(queryByText(item.contentWithoutHtml!)).toBeFalsy()

    expect(getByText(subCategories[0]!.title)).toBeTruthy()

    expect(getByText(subCategories[1]!.title)).toBeTruthy()
  })

  it('should render category and highlighted filtered text', () => {
    const language = 'de'
    const { getByText } = render(
      <CategoryListItem query='test' item={itemWithoutSubCategories} onItemPress={onItemPress} language={language} />
    )

    expect(getByText(item.title)).toBeTruthy()
    expect(getByText('This is some content.')).toBeTruthy()
  })
})
