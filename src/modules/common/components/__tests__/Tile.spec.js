// @flow

import React from 'react'
import { shallow } from 'enzyme'

import TileModel from 'modules/common/models/TileModel'
import Tile from '../Tile'

const tile1 = new TileModel({
  id: '3649',
  path: '/augsburg/de/willkommen',
  title: 'Willkommen',
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  isExternalUrl: false
})

const tile2 = new TileModel({
  id: '3649',
  path: 'https://example.com',
  title: 'Example',
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  isExternalUrl: true
})

describe('Tile', () => {
  it('should render a Link if path is not an external url', () => {
    const wrapper = shallow(
      <Tile tile={tile1} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should render a a-Tag if path is not an external url', () => {
    const wrapper = shallow(
      <Tile tile={tile2} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
