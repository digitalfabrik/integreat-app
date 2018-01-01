import React from 'react'
import { shallow } from 'enzyme'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import CategoryList from '../CategoryList'

const title = 'Willkommen'
const content = 'test content'

const categories = [
  new CategoryModel({
    id: 35,
    url: '/augsburg/de/willkommen/willkommen-in-augsburg',
    title: 'Willkommen in Augsburg'
  }),
  new CategoryModel({
    id: 35,
    url: '/augsburg/de/willkommen/willkommen-in-augsburg',
    title: 'Willkommen in Augsburg'
  })
]

describe('CategoryList', () => {
  test('should render and display a caption', () => {
    const wrapper = shallow(
      <CategoryList categories={categories}
                    title={title}
                    content={content} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should render and not display a caption', () => {
    const wrapper = shallow(
      <CategoryList categories={categories} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
