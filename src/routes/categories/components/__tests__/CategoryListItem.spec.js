// @flow

import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import CategoryListItem from '../CategoryListItem'
import { CategoryModel } from '@integreat-app/integreat-api-client'

const category = new CategoryModel({
  id: 3649,
  path: '/augsburg/de/willkommen',
  title: 'Willkommen',
  content: 'this is a test content',
  parentPath: '/augsburg/de',
  order: 11,
  availableLanguages: new Map([['en', '4861'], ['ar', '4867'], ['fa', '4868']]),
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
})
const childCategory = new CategoryModel({
  id: 5234,
  path: '/augsburg/de/test',
  title: 'Child',
  content: 'this is a test content',
  parentPath: '/augsburg/de',
  order: 11,
  availableLanguages: new Map([['en', '4861'], ['ar', '4867'], ['fa', '4868']]),
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
})
const noThumbCategory = new CategoryModel({
  id: 35,
  path: '/augsburg/de/willkommen/willkommen-in-augsburg',
  title: 'GotNoThumb :O',
  content: 'some content',
  parentPath: '/augsburg/de/willkommen',
  order: 1,
  availableLanguages: new Map([['en', '390'], ['ar', '711'], ['fa', '397']]),
  thumbnail: '',
  lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
})

describe('CategoryListItem', () => {
  it('should render and match snapshot', () => {
    const wrapper = shallow(
      <CategoryListItem category={category} subCategories={[childCategory]} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should replace empty thumbnail', () => {
    const wrapper = shallow(
      <CategoryListItem category={noThumbCategory} subCategories={[noThumbCategory]} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
