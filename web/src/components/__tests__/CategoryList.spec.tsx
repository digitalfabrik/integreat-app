import moment from 'moment'
import React from 'react'

import { CategoryModel } from 'api-client'

import { renderWithRouterAndTheme } from '../../testing/render'
import CategoryList from '../CategoryList'

const modelWithTitle = new CategoryModel({
  root: false,
  path: '/augsburg/de/erste-schritte/asylantrag',
  parentPath: '/augsburg/de/erste-schritte',
  title: 'Asylantrag',
  order: 3,
  availableLanguages: new Map(),
  content: '<div>This is some special test content</div>',
  lastUpdate: moment('2016-01-07 10:36:24'),
  thumbnail: 'title-thumbnail',
  organization: null,
})
const categoryModels: [CategoryModel, CategoryModel, CategoryModel, CategoryModel] = [
  new CategoryModel({
    root: true,
    path: '/augsburg/de',
    title: 'augsburg',
    parentPath: '',
    availableLanguages: new Map(),
    content: 'exampleContent0',
    lastUpdate: moment('2016-01-07 10:36:24'),
    order: 0,
    thumbnail: 'thumb-nail',
    organization: null,
  }),
  new CategoryModel({
    root: false,
    path: '/augsburg/de/willkommen',
    parentPath: '/augsburg/de',
    title: 'willkommen',
    order: 1,
    availableLanguages: new Map(),
    content: 'exampleContent0',
    lastUpdate: moment('2016-01-07 10:36:24'),
    thumbnail: 'thumb-nail',
    organization: null,
  }),
  new CategoryModel({
    root: false,
    path: '/augsburg/de/erste-schritte',
    parentPath: '/augsburg/de',
    title: 'erste-schritte',
    order: 2,
    availableLanguages: new Map(),
    content: 'exampleContent0',
    lastUpdate: moment('2016-01-07 10:36:24'),
    thumbnail: 'thumb-nail',
    organization: null,
  }),
  new CategoryModel({
    root: false,
    path: '/augsburg/de/erste-schritte/asylantrag',
    parentPath: '/augsburg/de/erste-schritte',
    title: 'asylantrag',
    order: 3,
    availableLanguages: new Map(),
    content: 'exampleContent0',
    lastUpdate: moment('2016-01-07 10:36:24'),
    thumbnail: 'thumb-nail',
    organization: null,
  }),
]

const items = [
  {
    category: categoryModels[0],
    subCategories: [categoryModels[1], categoryModels[2]],
  },
  {
    category: categoryModels[2],
    subCategories: [categoryModels[3]],
  },
]

describe('CategoryList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const onInternalLinkClick = jest.fn()

  it('should render category list', () => {
    const { getByText } = renderWithRouterAndTheme(
      <CategoryList onInternalLinkClick={onInternalLinkClick} items={items} />
    )
    categoryModels.forEach(() => {
      expect(getByText(categoryModels[0].title)).toBeTruthy()
    })
  })

  it('should render title, content and thumbnail of category', () => {
    const { getByText } = renderWithRouterAndTheme(
      <CategoryList onInternalLinkClick={onInternalLinkClick} items={[]} category={modelWithTitle} />
    )
    expect(getByText('Asylantrag')).toBeTruthy()
    expect(getByText('This is some special test content')).toBeTruthy()
  })
})
