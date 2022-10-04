import React from 'react'

import render from '../../testing/render'
import CategoryListItem from '../CategoryListItem'

jest.mock('styled-components')

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
    path: '/augsburg/de/lorem-ipsum',
    title: 'Duis aute',
    contentWithoutHtml:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    thumbnail: 'thumbnail',
    subCategories,
  }
  const itemWithDifferentName = { ...item, title: 'Willkommen' }

  const language = 'de'

  const onItemPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render category and subcategories', () => {
    const { getByText, queryByText } = render(
      <CategoryListItem item={item} onItemPress={onItemPress} language={language} />
    )

    expect(getByText(item.title)).toBeTruthy()
    expect(queryByText(item.contentWithoutHtml!)).toBeFalsy()
    expect(getByText(subCategories[0]!.title)).toBeTruthy()
    expect(getByText(subCategories[1]!.title)).toBeTruthy()
  })

  describe('query', () => {
    it('should show excerpt around query if match in title and content', () => {
      const excerptBeforeQuery = 'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      const query = 'Duis aute'
      const excerptAfterQuery = 'irure dolor in reprehenderit in voluptate velit esse cillum'
      const highlightStyle = {
        _values: {
          'background-color': 'rgb(255, 255, 255)',
          'font-weight': 'bold',
        },
      }

      const { queryAllByText, getByText, debug } = render(
        <CategoryListItem item={item} onItemPress={onItemPress} language={language} query={query} />
      )

      debug()
      expect(getByText(excerptBeforeQuery)).not.toHaveProperty('style', expect.objectContaining(highlightStyle))
      expect(queryAllByText(query)[0]).toHaveProperty('style', expect.objectContaining(highlightStyle))
      expect(queryAllByText(query)[1]).toHaveProperty('style', expect.objectContaining(highlightStyle))
      expect(getByText(excerptAfterQuery)).not.toHaveProperty('style', expect.objectContaining(highlightStyle))
    })

    it('should show beginning of excerpt if match only in title', () => {
      const query = 'Willkommen'
      const excerpt =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim'
      const highlightStyle = {
        _values: {
          'background-color': 'rgb(255, 255, 255)',
          'font-weight': 'bold',
        },
      }

      const { getByText } = render(
        <CategoryListItem item={itemWithDifferentName} onItemPress={onItemPress} language={language} query={query} />
      )

      expect(getByText(query)).toHaveProperty('style', expect.objectContaining(highlightStyle))
      expect(getByText(excerpt)).not.toHaveProperty('style', expect.objectContaining(highlightStyle))
    })

    it('should show excerpt around query if only match in content', () => {
      const excerptBeforeQuery = 'et dolore magna aliqua. Ut enim ad minim veniam, quis'
      const query = 'nostrud exercitation'
      const excerptAfterQuery = 'ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      const highlightStyle = {
        _values: {
          'background-color': 'rgb(255, 255, 255)',
          'font-weight': 'bold',
        },
      }

      const { getByText } = render(
        <CategoryListItem item={item} onItemPress={onItemPress} language={language} query={query} />
      )

      expect(getByText(excerptBeforeQuery)).not.toHaveProperty('style', expect.objectContaining(highlightStyle))
      expect(getByText(query)).toHaveProperty('style', expect.objectContaining(highlightStyle))
      expect(getByText(excerptAfterQuery)).not.toHaveProperty('style', expect.objectContaining(highlightStyle))
    })

    it('should show beginning of excerpt if there is no match', () => {
      const query = 'no match'
      const excerpt =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim'

      const { queryAllByText, getByText } = render(
        <CategoryListItem item={item} onItemPress={onItemPress} language={language} query={query} />
      )

      expect(getByText(item.title)).toBeTruthy()
      expect(getByText(excerpt)).toBeTruthy()
      const regex = /.+/
      const texts = queryAllByText(regex)
      // Shows category.title and beginning of category.content
      expect(texts).toHaveLength(2)
    })
  })
})
