import React from 'react'
import { shallow } from 'enzyme'

import { CategoriesToolbar } from '../CategoriesToolbar'
import CategoryModel from 'modules/endpoint/models/CategoryModel'
import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import { CATEGORIES_ROUTE } from '../../../../modules/app/routes/categories'

describe('CategoriesToolbar', () => {
  const categoryModels = [
    new CategoryModel({
      id: 0,
      path: '/augsburg/de',
      title: 'augsburg',
      content: '',
      order: -1,
      availableLanguages: {},
      thumbnail: 'no_thumbnail',
      parentPath: ''
    }), new CategoryModel({
      id: 3650,
      path: '/augsburg/de/anlaufstellen',
      title: 'Anlaufstellen zu sonstigen Themen',
      content: '',
      parentPath: '/augsburg/de',
      order: 75,
      availableLanguages: {
        en: 4361, ar: 4367, fa: 4368
      },
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
    }),
    new CategoryModel({
      id: 3649,
      path: '/augsburg/de/willkommen',
      title: 'Willkommen',
      content: '',
      parentPath: '/augsburg/de',
      order: 11,
      availableLanguages: {
        en: 4804, ar: 4819, fa: 4827
      },
      thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png'
    }),
    new CategoryModel({
      id: 35,
      path: '/augsburg/de/willkommen/willkommen-in-augsburg',
      title: 'Willkommen in Augsburg',
      content: 'some content',
      parentPath: '/augsburg/de/willkommen',
      order: 1,
      availableLanguages: {
        en: 390,
        de: 711,
        ar: 397
      },
      thumbnail: 'https://cms.integreat-ap…09/heart295-150x150.png'
    })
  ]

  const city = 'augsburg'
  const language = 'de'

  const categories = new CategoriesMapModel(categoryModels)

  it('should render nothing, if category cannot be found', () => {
    const component = shallow(
      <CategoriesToolbar categories={categories}
                         location={{pathname: 'invalid_path'}}
                         t={key => key} />
    )

    expect(component.equals(null)).toBe(true)
  })

  it('should render Toolbar, if category can be found', () => {
    const component = shallow(
      <CategoriesToolbar categories={categories}
                         location={{pathname: categoryModels[2].path, type: CATEGORIES_ROUTE, payload: {city, language}}}
                         t={key => key} />
    )

    expect(component).toMatchSnapshot()
  })

  it('should render root-url for pdf endpoint', () => {
    const component = shallow(
      <CategoriesToolbar categories={categories}
                         location={{pathname: categoryModels[0].path, type: CATEGORIES_ROUTE, payload: {city, language}}}
                         t={key => key} />
    )

    expect(component).toMatchSnapshot()
  })
})
