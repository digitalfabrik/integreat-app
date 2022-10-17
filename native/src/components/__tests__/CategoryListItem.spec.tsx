import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

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
    const assertHighlighting = (instance: ReactTestInstance, highlighted: boolean) =>
      highlighted
        ? expect(instance.props.style?.fontWeight).toBe('bold')
        : expect(instance.props.style?.fontWeight).toBeUndefined()

    it('should show excerpt around query if match in title and content', () => {
      const excerptBeforeQuery = '... ut aliquip ex ea commodo consequat.'
      const excerptAfterQuery = 'irure dolor in reprehenderit in ...'

      const { queryAllByText, getByText } = render(
        <CategoryListItem item={item} onItemPress={onItemPress} language={language} query={item.title} />
      )

      assertHighlighting(getByText(excerptBeforeQuery, { exact: false }), false)
      assertHighlighting(queryAllByText(item.title)[0]!, true)
      assertHighlighting(queryAllByText(item.title)[1]!, true)
      assertHighlighting(getByText(excerptAfterQuery, { exact: false }), false)
    })

    it('should show beginning of excerpt if match only in title', () => {
      const excerpt = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ...'

      const { getByText } = render(
        <CategoryListItem
          item={itemWithDifferentName}
          onItemPress={onItemPress}
          language={language}
          query={itemWithDifferentName.title}
        />
      )

      assertHighlighting(getByText(itemWithDifferentName.title), true)
      assertHighlighting(getByText(excerpt), false)
    })

    it('should show excerpt around query if only match in content', () => {
      const excerptBeforeQuery = '... Ut enim ad minim veniam, quis'
      const query = 'nostrud exercitation'
      const excerptAfterQuery = 'ullamco laboris nisi ut aliquip ...'

      const { getByText } = render(
        <CategoryListItem item={item} onItemPress={onItemPress} language={language} query={query} />
      )

      assertHighlighting(getByText(item.title), false)
      assertHighlighting(getByText(excerptBeforeQuery, { exact: false }), false)
      assertHighlighting(getByText(query), true)
      assertHighlighting(getByText(excerptAfterQuery, { exact: false }), false)
    })

    it('should show beginning of excerpt if there is no match', () => {
      const query = 'no match'
      const excerpt = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ...'

      const { getByText } = render(
        <CategoryListItem item={item} onItemPress={onItemPress} language={language} query={query} />
      )

      assertHighlighting(getByText(item.title), false)
      assertHighlighting(getByText(excerpt), false)
    })
  })
})
