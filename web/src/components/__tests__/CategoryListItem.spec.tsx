import { DateTime } from 'luxon'
import React from 'react'

import { CategoryModel } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import CategoryListItem from '../CategoryListItem'

const categoryParams = {
  root: false,
  path: '/augsburg/de/lorem-ipsum',
  title: 'Duis aute',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
  parentPath: '/augsburg/de',
  order: 11,
  availableLanguages: {
    en: '/augsburg/en',
    ar: '/augsburg/ar',
    fa: '/augsburg/fa',
  },
  thumbnail: '',
  lastUpdate: DateTime.fromISO('2017-11-18T19:30:00.000Z'),
  organization: null,
  embeddedOffers: [],
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
    const { getByText } = renderWithRouterAndTheme(
      <CategoryListItem category={category} subCategories={[childCategory]} />,
    )

    expect(getByText(category.title)).toBeTruthy()
    expect(getByText(category.title).closest('a')).toHaveProperty('href', `http://localhost${category.path}`)

    expect(getByText(childCategory.title)).toBeTruthy()
    expect(getByText(childCategory.title).closest('a')).toHaveProperty('href', `http://localhost${childCategory.path}`)
  })
})
