import React from 'react'
import { shallow } from 'enzyme'

import TileModel from 'modules/common/models/TileModel'
import Tiles from '../Tiles'

const tiles = [
  new TileModel({
    id: 35,
    path: '/augsburg/de/willkommen/willkommen-in-augsburg',
    name: 'Willkommen in Augsburg',
    thumbnail: 'some-thumnail.jpg'
  }),
  new TileModel({
    id: 36,
    path: '/augsburg/de/willkommen/erste-schritte',
    name: 'Erste Schritte',
    thumbnail: 'some-other-thumbnail.jpg'
  })
]

describe('Tiles', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <Tiles tiles={tiles}
             title={'Augsburg'} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
