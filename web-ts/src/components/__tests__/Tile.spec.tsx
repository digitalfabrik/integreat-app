import React from 'react'
import { shallow } from 'enzyme'

import TileModel from '../../../../modules/common/models/TileModel'
import Tile from '../Tile'

const tile1 = new TileModel({
  path: '/augsburg/de/willkommen',
  title: 'Willkommen',
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  postData: null,
  isExternalUrl: false
})

const tile2 = new TileModel({
  path: 'https://example.com',
  title: 'Example',
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  postData: null,
  isExternalUrl: true
})

const lehrstellenRadarPostData = new Map()
lehrstellenRadarPostData.set('partner', '0006')
lehrstellenRadarPostData.set('radius', '50')
lehrstellenRadarPostData.set('plz', '86150')

const tile3 = new TileModel({
  path: 'https://example.com',
  title: 'Example',
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  isExternalUrl: true,
  postData: lehrstellenRadarPostData
})

describe('Tile', () => {
  it('should render a Link if path is not an external url', () => {
    const wrapper = shallow(<Tile tile={tile1} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render a a-Tag if path is not an external url', () => {
    const wrapper = shallow(<Tile tile={tile2} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render a form-Tag if path is not an external url and has postData', () => {
    const wrapper = shallow(<Tile tile={tile3} />)
    expect(wrapper).toMatchSnapshot()
  })
})
