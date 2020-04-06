// @flow

import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import CategoryListItem from '../CategoryListItem'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import { brightTheme } from '../../../../modules/theme/constants/theme'

const category = new CategoryModel({
  root: false,
  path: '/augsburg/de/willkommen',
  title: 'Willkommen',
  content: 'this is a test content',
  parentPath: '/augsburg/de',
  order: 11,
  availableLanguages: new Map([['en', '4861'], ['ar', '4867'], ['fa', '4868']]),
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
  hash: 'a36a56'
})
const childCategory = new CategoryModel({
  root: false,
  path: '/augsburg/de/test',
  title: 'Child',
  content: 'this is a test content',
  parentPath: '/augsburg/de',
  order: 11,
  availableLanguages: new Map([['en', '4861'], ['ar', '4867'], ['fa', '4868']]),
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
  hash: 'a36a57'
})
const noThumbCategory = new CategoryModel({
  root: false,
  path: '/augsburg/de/willkommen/willkommen-in-augsburg',
  title: 'GotNoThumb :O',
  content: 'some content',
  parentPath: '/augsburg/de/willkommen',
  order: 1,
  availableLanguages: new Map([['en', '390'], ['ar', '711'], ['fa', '397']]),
  thumbnail: '',
  lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
  hash: 'a36a58'
})

describe('CategoryListItem', () => {
  it('should render and match snapshot', () => {
    const wrapper = shallow(
      <CategoryListItem theme={brightTheme} category={category} subCategories={[childCategory]} />
    ).dive()
    expect(wrapper).toMatchSnapshot()
  })

  it('should replace empty thumbnail', () => {
    const wrapper = shallow(
      <CategoryListItem theme={brightTheme} category={noThumbCategory} subCategories={[noThumbCategory]} />
    ).dive()
    expect(wrapper).toMatchSnapshot()
  })
})
