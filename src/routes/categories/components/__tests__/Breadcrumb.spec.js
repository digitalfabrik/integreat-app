import React from 'react'
import { shallow } from 'enzyme'

import Breadcrumbs from '../Breadcrumbs'
import CategoryModel from '../../../../modules/endpoint/models/CategoryModel'

const parents = [
  new CategoryModel({
    id: 0, url: '/augsburg/de', title: 'augsburg'
  }), new CategoryModel({
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
  }), new CategoryModel({
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
  })
]

describe('Breadcrumbs', () => {
  it('should render and match snapshot', () => {
    const wrapper = shallow(
      <Breadcrumbs parents={parents} cityName='Augsburg' />
    )

    expect(wrapper).toMatchSnapshot()
  })
})
