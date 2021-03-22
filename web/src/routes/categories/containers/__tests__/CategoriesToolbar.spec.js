// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { CategoriesToolbar } from '../CategoriesToolbar'
import { CategoriesMapModel, CategoryModel } from 'api-client'
import { CATEGORIES_ROUTE } from '../../../../modules/app/route-configs/CategoriesRouteConfig'
import moment from 'moment'
import createLocation from '../../../../createLocation'

describe('CategoriesToolbar', () => {
  const categoryModels = [
    new CategoryModel({
      root: true,
      path: '/augsburg/de',
      title: 'augsburg',
      content: '',
      order: -1,
      availableLanguages: new Map(),
      thumbnail: 'no_thumbnail',
      parentPath: '',
      hash: '2fe6283485a93932',
      lastUpdate: moment('2017-11-18T19:30:00.000Z')
    }),
    new CategoryModel({
      root: false,
      path: '/augsburg/de/anlaufstellen',
      title: 'Anlaufstellen zu sonstigen Themen',
      content: '',
      parentPath: '/augsburg/de',
      order: 75,
      availableLanguages: new Map([
        ['en', '4361'],
        ['ar', '4367'],
        ['fa', '4368']
      ]),
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
      hash: '2fe6283485b93932',
      lastUpdate: moment('2017-11-18T19:30:00.000Z')
    }),
    new CategoryModel({
      root: false,
      path: '/augsburg/de/willkommen',
      title: 'Willkommen',
      content: '',
      parentPath: '/augsburg/de',
      order: 11,
      availableLanguages: new Map([
        ['en', '4361'],
        ['ar', '4367'],
        ['fa', '4368']
      ]),
      thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
      hash: '2fe6283485c93932',
      lastUpdate: moment('2017-11-18T19:30:00.000Z')
    }),
    new CategoryModel({
      root: false,
      path: '/augsburg/de/willkommen/willkommen-in-augsburg',
      title: 'Willkommen in Augsburg',
      content: 'some content',
      parentPath: '/augsburg/de/willkommen',
      order: 1,
      availableLanguages: new Map([
        ['en', '390'],
        ['ar', '711'],
        ['fa', '397']
      ]),
      thumbnail: 'https://cms.integreat-ap…09/heart295-150x150.png',
      hash: '2fe6283485d93932',
      lastUpdate: moment('2017-11-18T19:30:00.000Z')
    })
  ]

  const t = (key: ?string): string => key || ''

  const city = 'augsburg'
  const language = 'de'

  const categories = new CategoriesMapModel(categoryModels)

  it('should render nothing, if category cannot be found', () => {
    const component = shallow(
      <CategoriesToolbar
        categories={categories}
        location={createLocation({ type: 'INVALID_ROUTE', payload: {}, pathname: 'invalid_path' })}
        t={t}
        openFeedbackModal={() => {}}
        viewportSmall
        direction={'ltr'}
      />
    )

    expect(component.getElement()).toBeNull()
  })

  it('should render Toolbar, if category can be found', () => {
    const component = shallow(
      <CategoriesToolbar
        viewportSmall
        categories={categories}
        location={createLocation({
          pathname: categoryModels[2].path,
          type: CATEGORIES_ROUTE,
          payload: { city, language }
        })}
        t={t}
        openFeedbackModal={() => {}}
        direction={'ltr'}
      />
    )

    expect(component).toMatchSnapshot()
  })

  it('should render root-url for pdf endpoint', () => {
    const component = shallow(
      <CategoriesToolbar
        viewportSmall
        categories={categories}
        location={createLocation({
          pathname: categoryModels[0].path,
          type: CATEGORIES_ROUTE,
          payload: { city, language }
        })}
        t={t}
        openFeedbackModal={() => {}}
        direction={'ltr'}
      />
    )

    expect(component).toMatchSnapshot()
  })
})
