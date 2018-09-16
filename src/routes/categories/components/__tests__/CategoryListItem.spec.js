import React from 'react'
import { shallow } from 'enzyme'

import CategoryListItem from '../CategoryListItem'
import CategoryModel from '../../../../modules/endpoint/models/CategoryModel'

const category = new CategoryModel({
  id: 3649,
  path: '/augsburg/de/willkommen',
  title: 'Willkommen',
  content: 'this is a test content',
  parentUrl: '/augsburg/de',
  order: 11,
  availableLanguages: {
    en: 4804, ar: 4819, fa: 4827
  },
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png'
})
const childCategory = new CategoryModel({
  id: 5234,
  path: '/augsburg/de/test',
  title: 'Child',
  content: 'this is a test content',
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
      <CategoryListItem category={category} subCategories={[childCategory]} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should replace empty thumbnail', () => {
    const noThumbCategory = {id: 42, path: '', title: 'GotNoThumb :O'}
    const wrapper = shallow(
      <CategoryListItem category={noThumbCategory} subCategories={[noThumbCategory]} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
