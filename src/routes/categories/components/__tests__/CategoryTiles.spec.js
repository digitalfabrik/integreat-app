import React from 'react'
import { shallow } from 'enzyme'

import CategoryTiles from '../CategoryTiles'
import LocationModel from '../../../../modules/endpoint/models/LocationModel'

const locations = [
  new LocationModel({name: 'Augsburg', code: 'augsburg'}),
  new LocationModel({name: 'Stadt Regensburg', code: 'regensburg'}),
  new LocationModel({name: 'Werne', code: 'werne'})
]

const title = 'augsburg'

const categories = [
  {
    id: 35,
    url: '/augsburg/de/willkommen/willkommen-in-augsburg',
    title: 'Willkommen in Augsburg'
  },
  {
    id: 35,
    url: '/augsburg/de/willkommen/willkommen-in-augsburg',
    title: 'Willkommen in Augsburg'
  }
]

describe('CategoryTiles', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <CategoryTiles categories={categories}
                    locations={locations}
                    title={'augsburg'} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should get location names correctly', () => {
    const categoryTiles = shallow(
      <CategoryTiles categories={categories}
                     locations={locations}
                     title={'augsburg'} />
    ).instance()

    expect(categoryTiles.getLocationName(title)).toEqual('Augsburg')
    expect(categoryTiles.getLocationName('test')).toEqual('test')
  })
})
