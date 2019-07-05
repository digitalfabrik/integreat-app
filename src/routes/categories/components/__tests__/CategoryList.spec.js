// @flow

import React from 'react'
import { shallow } from 'enzyme'

import CategoryList from '../CategoryList'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'

const title = 'Willkommen'
const content = 'test content'

const categoryModels = [
  new CategoryModel({
    id: 0,
    path: '/augsburg/de',
    title: 'augsburg',
    content: '',
    order: -1,
    availableLanguages: new Map(),
    thumbnail: 'no_thumbnail',
    parentPath: '',
    lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
  }), new CategoryModel({
    id: 3650,
    path: '/augsburg/de/anlaufstellen',
    title: 'Anlaufstellen zu sonstigen Themen',
    content: '',
    parentPath: '/augsburg/de',
    order: 75,
    availableLanguages: new Map([['en', '4361'], ['ar', '4367'], ['fa', '4368']]),
    thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
    lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
  }),
  new CategoryModel({
    id: 3649,
    path: '/augsburg/de/willkommen',
    title: 'Willkommen',
    content: '',
    parentPath: '/augsburg/de',
    order: 11,
    availableLanguages: new Map([['en', '4361'], ['ar', '4367'], ['fa', '4368']]),
    thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
    lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
  }),
  new CategoryModel({
    id: 35,
    path: '/augsburg/de/willkommen/willkommen-in-augsburg',
    title: 'Willkommen in Augsburg',
    content: 'some content',
    parentPath: '/augsburg/de/willkommen',
    order: 1,
    availableLanguages: new Map([['en', '390'], ['ar', '711'], ['fa', '397']]),
    thumbnail: 'https://cms.integreat-ap…09/heart295-150x150.png',
    lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
  })
]

const categories = [
  {
    model: categoryModels[0],
    subCategories: [categoryModels[1], categoryModels[2]]
  }, {
    model: categoryModels[2],
    subCategories: [categoryModels[3]]
  }
]

describe('CategoryList', () => {
  it('should render and display a caption', () => {
    const wrapper = shallow(
      <CategoryList categories={categories} onInternalLinkClick={() => {}}
                    title={title}
                    content={content} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should render and not display a caption', () => {
    const wrapper = shallow(
      <CategoryList categories={categories} onInternalLinkClick={() => {}} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
