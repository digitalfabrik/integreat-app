import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import SearchListItem from '../SearchListItem'

const categoryParams = {
  path: '/augsburg/de/lorem-ipsum',
  title: 'Duis aute',
  contentWithoutHtml:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
}

const differenCategoryName = 'Willkommen'

describe('SearchListItem', () => {
  const highlightStyle = {
    values: {
      'background-color': 'rgb(234, 238, 249)',
      'font-weight': 'bold',
      color: 'black',
    },
  }

  it('should show excerpt around query if match in title and content', () => {
    const excerptBeforeQuery =
      '... veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    const query = 'Duis aute'
    const excerptAfterQuery = 'irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla ...'
    const excerpt = `${excerptBeforeQuery} ${query} ${excerptAfterQuery}`

    const { queryAllByText, getByText, getByLabelText } = renderWithRouterAndTheme(
      <SearchListItem query={query} {...categoryParams} />,
    )

    expect(getByLabelText(excerpt)).toBeTruthy()
    expect(getByText(excerptBeforeQuery)).not.toHaveStyle(highlightStyle)
    expect(queryAllByText(query)[0]).toHaveStyle(highlightStyle.values)
    expect(queryAllByText(query)[1]).toHaveStyle(highlightStyle.values)
    expect(getByText(excerptAfterQuery)).not.toHaveStyle(highlightStyle)
  })

  it('should show beginning of excerpt if match only in title', () => {
    const query = 'Willkommen'
    const excerpt =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ...'

    const { getByText, getByLabelText } = renderWithRouterAndTheme(
      <SearchListItem {...categoryParams} title={differenCategoryName} query={query} />,
    )

    expect(getByText(query)).toHaveStyle(highlightStyle.values)
    expect(getByLabelText(excerpt)).toBeTruthy()
    expect(getByText(excerpt)).not.toHaveStyle(highlightStyle.values)
  })

  it('should show excerpt around query if only match in content', () => {
    const excerptBeforeQuery = '... tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis'
    const query = 'nostrud exercitation'
    const excerptAfterQuery = 'ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in ...'
    const excerpt = `${excerptBeforeQuery} ${query} ${excerptAfterQuery}`

    const { getByText, getByLabelText } = renderWithRouterAndTheme(<SearchListItem query={query} {...categoryParams} />)

    expect(getByLabelText(excerpt)).toBeTruthy()
    expect(getByText(excerptBeforeQuery)).not.toHaveStyle(highlightStyle.values)
    expect(getByText(query)).toHaveStyle(highlightStyle.values)
    expect(getByText(excerptAfterQuery)).not.toHaveStyle(highlightStyle.values)
  })

  it('should show beginning of excerpt if there is no match', () => {
    const query = 'no match'
    const excerpt =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ...'

    const { getByText } = renderWithRouterAndTheme(<SearchListItem query={query} {...categoryParams} />)

    expect(getByText(categoryParams.title)).not.toHaveProperty('style', expect.objectContaining(highlightStyle))
    expect(getByText(excerpt)).not.toHaveProperty('style', expect.objectContaining(highlightStyle))
  })
})
