// @flow

import { CategoryModel } from 'api-client'
import CategoriesRouteStateView from '../CategoriesRouteStateView'
import moment from 'moment'

describe('CategoriesRouteStateView', () => {
  const models = {
    '/augsburg/de': new CategoryModel({
      root: true,
      path: '/augsburg/de',
      title: 'Stadt Augsburg',
      content: 'lul',
      parentPath: '',
      order: 0,
      availableLanguages: new Map(),
      lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
      thumbnail: '/thumbnail.jpg',
      hash: '123asdf'
    }),
    '/augsburg/de/erste-hilfe': new CategoryModel({
      root: false,
      path: '/augsburg/de/erste-hilfe',
      title: 'Stadt Augsburg',
      content: 'lul',
      parentPath: '/augsburg/de',
      order: 0,
      availableLanguages: new Map(),
      lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
      thumbnail: '/thumbnail.jpg',
      hash: '123asdf'
    }),
    '/augsburg/de/zweite-hilfe': new CategoryModel({
      root: false,
      path: '/augsburg/de/zweite-hilfe',
      title: 'Stadt Augsburg',
      content: 'lul',
      parentPath: '/augsburg/de/erste-hilfe',
      order: 0,
      availableLanguages: new Map(),
      lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
      thumbnail: '/thumbnail.jpg',
      hash: '123asdf'
    })
  }

  const children = {
    '/augsburg/de': ['/augsburg/de/erste-hilfe'],
    '/augsburg/de/erste-hilfe': ['/augsburg/de/zweite-hilfe'],
    '/augsburg/de/zweite-hilfe': []
  }

  it('should throw if accessing root while the root model is not available', () => {
    const stateView = new CategoriesRouteStateView('/augsburg/de/erste-hilfe', {}, {})
    expect(() => stateView.root()).toThrowError()
  })

  it('should throw if accessing children while children are not available', () => {
    const stateView = new CategoriesRouteStateView('/augsburg/de/erste-hilfe', {}, {})
    expect(() => stateView.children()).toThrowError()
  })

  it('should return models of children when calling children', () => {
    const stateView = new CategoriesRouteStateView('/augsburg/de', models, children)
    expect(stateView.children()).toEqual([models['/augsburg/de/erste-hilfe']])
  })

  it('should enable stepping into a child category', () => {
    const stateView = new CategoriesRouteStateView('/augsburg/de', models, children)
    const child = stateView.stepInto('/augsburg/de/erste-hilfe')
    expect(child.root().path).toBe('/augsburg/de/erste-hilfe')
    expect(child.children()).toEqual([models['/augsburg/de/zweite-hilfe']])
  })
})
