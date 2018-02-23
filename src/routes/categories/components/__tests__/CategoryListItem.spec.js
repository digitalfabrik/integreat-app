import React from 'react'
import { shallow } from 'enzyme'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import CategoryListItem from '../CategoryListItem'

const category = new CategoryModel({
  id: 3649,
  url: '/augsburg/de/willkommen',
  title: 'Willkommen',
  content: 'this is a test content',
  parentId: 0,
  parentUrl: '/augsburg/de',
  order: 11,
  availableLanguages: {
    en: 4804, ar: 4819, fa: 4827
  },
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png'
})
const childCategory = new CategoryModel({
  id: 5234,
  url: '/augsburg/de/test',
  title: 'Child',
  content: 'this is a test content',
  parentId: 0,
  parentUrl: '/augsburg/de',
  order: 11,
  availableLanguages: {
    en: 4804, ar: 4819, fa: 4827
  },
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png'
})

describe('CategoryListItem', () => {
  it('should render and match snapshot', () => {
    const wrapper = shallow(
      <CategoryListItem category={category} children={[childCategory]} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should replace empty thumbnail', () => {
    const noThumbCategory = new CategoryModel({id: 42, url: '', title: 'GotNoThumb :O', parentId: 2})
    const wrapper = shallow(
      <CategoryListItem category={noThumbCategory} children={[noThumbCategory]} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
