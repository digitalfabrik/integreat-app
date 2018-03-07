import React from 'react'
import { shallow } from 'enzyme'

import LocationModel from 'modules/endpoint/models/LocationModel'
import Breadcrumbs from '../Breadcrumbs'

const parents = [
  {
    id: 0, url: '/augsburg/de', title: 'augsburg'
  }, {
    id: 3649,
    url: '/augsburg/de/willkommen',
    title: 'Willkommen',
    content: '',
    parentId: 0,
    parentUrl: '/augsburg/de',
    order: 11,
    availableLanguages: {
      en: 4804, ar: 4819, fa: 4827
    },
    thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png'
  }, {
    id: 35,
    url: '/augsburg/de/willkommen/willkommen-in-augsburg',
    title: 'Willkommen in Augsburg',
    content: '<p>Willkommen in Augsbur…er Stadt Augsburg</p>\n',
    parentId: 3649,
    parentUrl: '/augsburg/de/willkommen',
    order: 1,
    availableLanguages: {
      en: '390',
      de: '711',
      ar: '397'
    },
    thumbnail: 'https://cms.integreat-ap…09/heart295-150x150.png'
  }
]

const locations = [
  new LocationModel({name: 'Augsburg', code: 'augsburg'}),
  new LocationModel({name: 'Stadt Regensburg', code: 'regensburg'}),
  new LocationModel({name: 'Werne', code: 'werne'})
]

describe('Breadcrumbs', () => {
  it('should render and match snapshot', () => {
    const wrapper = shallow(
      <Breadcrumbs parents={parents} locations={locations} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('getLocationName', () => {
    const breadcrumbs = shallow(
      <Breadcrumbs parents={parents} locations={locations} />
    ).instance()

    expect(breadcrumbs.getLocationName(parents[0].title)).toEqual(locations[0].name)
    expect(breadcrumbs.getLocationName('test')).toEqual('test')
  })
})
