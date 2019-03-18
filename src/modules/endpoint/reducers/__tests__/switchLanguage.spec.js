// @flow

import { CategoriesMapModel, CategoryModel, LanguageModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import switchLanguage from '../switchLanguage'
import pushCategory from '../pushCategory'

describe('switchLangauge', () => {
  const enCategories = [
    new CategoryModel({
      id: 0,
      path: '/augsburg/en',
      title: 'augsburg',
      content: '',
      order: -1,
      availableLanguages: {},
      thumbnail: 'no_thumbnail',
      parentPath: ''
    }), new CategoryModel({
      id: 10,
      path: '/augsburg/en/anlaufstellen',
      title: 'Contact points for other topics',
      content: '',
      parentPath: '/augsburg/en',
      order: 75,
      availableLanguages: new Map([
        ['de', '/augsburg/de/anlaufstellen']
      ]),
      thumbnail: 'https://cms.integreat-app.de/thumbnail.png',
      lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
    }),
    new CategoryModel({
      id: 11,
      path: '/augsburg/en/erste-schritte',
      title: 'Welcome',
      content: '',
      parentPath: '/augsburg/en',
      order: 11,
      availableLanguages: new Map([
        ['de', '/augsburg/de/willkommen']
      ]),
      thumbnail: 'https://cms.integreat-app.de/thumbnail.png',
      lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
    }),
    new CategoryModel({
      id: 12,
      path: '/augsburg/en/erste-schritte/welcome-to-augsburg',
      title: 'Welcome to Augsburg',
      content: 'some content',
      parentPath: '/augsburg/en/erste-schritte',
      order: 1,
      availableLanguages: new Map([
        ['de', '/augsburg/de/willkommen/willkommen-in-augsburg']
      ]),
      thumbnail: 'https://cms.integreat-app.de/thumbnail.png',
      lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
    })
  ]

  const enModel = new CategoriesMapModel(enCategories)

  const createGermanModel = ({translatable}: { translatable: boolean } = {translatable: true}) => {
    const deCategories = [
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
        id: 1,
        path: '/augsburg/de/anlaufstellen',
        title: 'Anlaufstellen zu sonstigen Themen',
        content: '',
        parentPath: '/augsburg/de',
        order: 75,
        availableLanguages: translatable ? new Map([
          ['en', '/augsburg/en/anlaufstellen']
        ]) : new Map(),
        thumbnail: 'https://cms.integreat-app.de/thumbnail.png',
        lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
      }),
      new CategoryModel({
        id: 2,
        path: '/augsburg/de/willkommen',
        title: 'Willkommen',
        content: '',
        parentPath: '/augsburg/de',
        order: 11,
        availableLanguages: translatable ? new Map([
          ['en', '/augsburg/en/erste-schritte']
        ]) : new Map(),
        thumbnail: 'https://cms.integreat-app.de/thumbnail.png',
        lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
      }),
      new CategoryModel({
        id: 3,
        path: '/augsburg/de/willkommen/willkommen-in-augsburg',
        title: 'Willkommen in Augsburg',
        content: 'some content',
        parentPath: '/augsburg/de/willkommen',
        order: 1,
        availableLanguages: translatable ? new Map([
          ['en', '/augsburg/en/erste-schritte/welcome-to-augsburg']
        ]) : new Map(),
        thumbnail: 'https://cms.integreat-ap…09/heart295-150x150.png',
        lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
      })
    ]

    return new CategoriesMapModel(deCategories)
  }

  const languages = [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')]

  const initialState = {
    routeMapping: {
      'route-0': {
        root: null,
        models: {},
        children: {},
        depth: 0
      }
    },
    resourceCache: {},

    languages,
    currentLanguage: null,
    currentCity: null
  }

  const prepareState = ({path, model}: { path: string, model: CategoryModel } = {
    path: '/augsburg/de',
    model: createGermanModel()
  }) => {
    const state = initialState

    const pushAction = {
      type: 'PUSH_CATEGORY',
      params: {
        categoriesMap: model,
        languages,
        pushParams: {
          path,
          depth: 2,
          key: 'route-0'
        },
        resourceCache: {},
        city: 'augsburg',
        language: 'de'
      }
    }

    return pushCategory(state, pushAction)
  }

  it('should not change when language is equal', () => {
    const action = {
      type: 'SWITCH_CATEGORY_LANGUAGE',
      params: {
        newCategoriesMap: createGermanModel(),
        newLanguage: 'de'
      }
    }

    const previous = prepareState()

    const newState = switchLanguage(previous, action)

    expect(newState).toEqual(previous)
  })

  it('should throw error with untranslatable route', () => {
    const state = {
      routeMapping: {
        'route-0': {
          root: null,
          models: {},
          children: {},
          depth: 0
        }
      },
      resourceCache: {},

      languages,
      currentLanguage: 'de',
      currentCity: 'augsburg'
    }

    const action = {
      type: 'SWITCH_CATEGORY_LANGUAGE',
      params: {
        newCategoriesMap: enModel,
        newLanguage: 'en'
      }
    }

    expect(() => switchLanguage(state, action)).toThrowError()
  })

  it('should throw error if city is not set', () => {
    const state = initialState
    const action = {
      type: 'SWITCH_CATEGORY_LANGUAGE',
      params: {
        newCategoriesMap: enModel,
        newLanguage: 'en'
      }
    }

    expect(() => switchLanguage(state, action)).toThrowError()
  })

  it('should translate route', () => {
    const action = {
      type: 'SWITCH_CATEGORY_LANGUAGE',
      params: {
        newCategoriesMap: enModel,
        newLanguage: 'en'
      }
    }

    const previous = prepareState({path: '/augsburg/de', model: createGermanModel()})

    const newState = switchLanguage(previous, action)

    expect(newState).toMatchSnapshot()
  })
})
