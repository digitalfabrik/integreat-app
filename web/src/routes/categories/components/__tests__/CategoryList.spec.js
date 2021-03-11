// @flow

import React from 'react'
import { shallow } from 'enzyme'

import CategoryList from '../CategoryList'
import { CategoryModel } from 'api-client'
import moment from 'moment'

const modelWithTitle = new CategoryModel({
  root: false,
  path: '/augsburg/de/erste-schritte/asylantrag',
  parentPath: '/augsburg/de/erste-schritte',
  title: 'Willkommen',
  order: 3,
  availableLanguages: new Map(),
  content: 'test content',
  lastUpdate: moment('2016-01-07 10:36:24'),
  thumbnail: 'thumb-nail',
  hash: '91d435afbc7aa83437e81fd2832e3'
})

const categoryModels = [
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
    hash: '91d435afbc7aa83496137e81fd2832e3'
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
    hash: '91d435afbc7aa83496137e81fd2832e3'
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
    hash: '91d435afbc7aa83496137e81fd2832e3'
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
    hash: '91d435afbc7aa83496137e81fd2832e3'
  })
]

const categories = [
  {
    model: categoryModels[0],
    subCategories: [categoryModels[1], categoryModels[2]]
  },
  {
    model: categoryModels[2],
    subCategories: [categoryModels[3]]
  }
]

describe('CategoryList', () => {
  it('should render and display a caption', () => {
    const wrapper = shallow(
      <CategoryList categories={categories} onInternalLinkClick={() => {}} category={modelWithTitle} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should render and not display a caption', () => {
    const wrapper = shallow(<CategoryList categories={categories} onInternalLinkClick={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
