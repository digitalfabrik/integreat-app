import moment from 'moment'
import React from 'react'

import { CategoryModel } from 'api-client'

import { renderWithRouterAndTheme } from '../../testing/render'
import CategoryListItem from '../CategoryListItem'

const categoryParams = {
  root: false,
  path: '/augsburg/de/lorem-ipsum',
  title: 'Duis aute',
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  parentPath: '/augsburg/de',
  order: 11,
  availableLanguages: new Map([
    ['en', '4861'],
    ['ar', '4867'],
    ['fa', '4868'],
  ]),
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  lastUpdate: moment('2017-11-18T19:30:00.000Z'),
}

const category = new CategoryModel(categoryParams)
const childCategory = new CategoryModel({
  ...categoryParams,
  path: '/augsburg/de/lorem-ipsum/test',
  title: 'Child',
  parentPath: '/augsburg/de/lorem-ipsum',
  thumbnail: 'https://cms.integreat-ap…03/Vertrag-150x150.png',
})

describe('CategoryListItem', () => {
  it('should render correctly', () => {
    const { getByText, getAllByRole, queryAllByText } = renderWithRouterAndTheme(
      <CategoryListItem category={category} subCategories={[childCategory]} />
    )

    expect(getByText(category.title)).toBeTruthy()
    expect(getByText(category.title).closest('a')).toHaveProperty('href', `http://localhost${category.path}`)
    expect(getAllByRole('img')[0]!).toHaveProperty('src', category.thumbnail)

    expect(getByText(childCategory.title)).toBeTruthy()
    expect(getByText(childCategory.title).closest('a')).toHaveProperty('href', `http://localhost${childCategory.path}`)
    expect(getAllByRole('img')[1]!).toHaveProperty('src', childCategory.thumbnail)

    const regex = /.+/
    const texts = queryAllByText(regex)
    // Only category.title and childCategory.title, nothing split up because of highlighting
    expect(texts).toHaveLength(2)
  })
})
