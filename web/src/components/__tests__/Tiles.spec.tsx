import { shallow } from 'enzyme'
import React from 'react'

import TileModel from '../../models/TileModel'
import Tiles from '../Tiles'

const tiles = [
  new TileModel({
    path: '/augsburg/de/willkommen/willkommen-in-augsburg',
    title: 'Willkommen in Augsburg',
    thumbnail: 'some-thumnail.jpg',
  }),
  new TileModel({
    path: '/augsburg/de/willkommen/erste-schritte',
    title: 'Erste Schritte',
    thumbnail: 'some-other-thumbnail.jpg',
  }),
]

describe('Tiles', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<Tiles tiles={tiles} title='Augsburg' />)
    expect(wrapper).toMatchSnapshot()
  })
})
