import React from 'react'
import { shallow } from 'enzyme'

import CategoryList from '../CategoryList'

const title = 'Willkommen'
const content = 'test content'

const categories = [
  {
    model: {
      id: 35,
      url: '/augsburg/de/willkommen/willkommen-in-augsburg',
      title: 'Willkommen in Augsburg'
    },
    children: [
      {
        id: 35,
        url: '/augsburg/de/willkommen/willkommen-in-augsburg',
        title: 'Willkommen in Augsburg'
      }]
  },
  {
    model: {
      id: 35,
      url: '/augsburg/de/willkommen/willkommen-in-augsburg',
      title: 'Willkommen in Augsburg'
    },
    children: []
  }
]

describe('CategoryList', () => {
  it('should render and display a caption', () => {
    const wrapper = shallow(
      <CategoryList categories={categories}
                    title={title}
                    content={content} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should render and not display a caption', () => {
    const wrapper = shallow(
      <CategoryList categories={categories} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
