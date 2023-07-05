import moment from 'moment'
import React from 'react'

import { CategoryModel } from 'api-client'

import { renderWithRouterAndTheme } from '../../testing/render'
import CategoryListItem from '../CategoryListItem'

const categoryParams = {
  root: false,
  path: '/augsburg/de/lorem-ipsum',
  title: 'Duis aute',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
  parentPath: '/augsburg/de',
  order: 11,
  availableLanguages: new Map([
    ['en', '4861'],
    ['ar', '4867'],
    ['fa', '4868'],
  ]),
  thumbnail: '',
  lastUpdate: moment('2017-11-18T19:30:00.000Z'),
  organization: null,
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
  it('should render a list item with a subcategory', () => {
    const { getByText, getByRole } = renderWithRouterAndTheme(
      <CategoryListItem category={category} subCategories={[childCategory]} />
    )

    expect(getByText(category.title)).toBeTruthy()
    expect(getByText(category.title).closest('a')).toHaveProperty('href', `http://localhost${category.path}`)

    expect(getByText(childCategory.title)).toBeTruthy()
    expect(getByText(childCategory.title).closest('a')).toHaveProperty('href', `http://localhost${childCategory.path}`)
    expect(getByRole('img')).toHaveProperty('src', childCategory.thumbnail)
  })
})
