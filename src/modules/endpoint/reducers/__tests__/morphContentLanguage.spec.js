// @flow

import {
  CategoriesMapModel,
  CategoryModel,
  DateModel,
  EventModel,
  LanguageModel,
  LocationModel
} from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import morphContentLanguage from '../morphContentLanguage'
import pushCategory from '../pushCategory'
import type { CityContentStateType } from '../../../app/StateType'
import type {
  MorphContentLanguageActionType,
  PushCategoryActionType,
  PushEventActionType
} from '../../../app/StoreActionType'
import pushEvent from '../pushEvent'
import createCityContent from '../createCityContent'

describe('morphContentLanguage', () => {
  const rootEnCategory = new CategoryModel({
    root: true,
    path: '/augsburg/en',
    title: 'augsburg',
    content: '',
    order: -1,
    availableLanguages: {},
    thumbnail: 'no_thumbnail',
    parentPath: '',
    hash: ''
  })
  const sub1EnCategory = new CategoryModel({
    root: false,
    path: '/augsburg/en/anlaufstellen',
    title: 'Contact points for other topics',
    content: '',
    parentPath: '/augsburg/en',
    order: 10,
    availableLanguages: new Map([
      ['de', '/augsburg/de/anlaufstellen']
    ]),
    thumbnail: 'https://cms.integreat-app.de/thumbnail.png',
    lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
    hash: '8cff3dcb420c0bbcbf612bf57f3c04ae'
  })
  const sub2EnCategory = new CategoryModel({
    root: false,
    path: '/augsburg/en/erste-schritte',
    title: 'Welcome',
    content: '',
    parentPath: '/augsburg/en',
    order: 11,
    availableLanguages: new Map([
      ['de', '/augsburg/de/willkommen']
    ]),
    thumbnail: 'https://cms.integreat-app.de/thumbnail.png',
    lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
    hash: '8cff3dcb420c0bbcbf612bf57f3c04ae'
  })
  const sub2subEnCategory = new CategoryModel({
    root: false,
    path: '/augsburg/en/erste-schritte/welcome-to-augsburg',
    title: 'Welcome to Augsburg',
    content: 'some content',
    parentPath: '/augsburg/en/erste-schritte',
    order: 1,
    availableLanguages: new Map([
      ['de', '/augsburg/de/willkommen/willkommen-in-augsburg']
    ]),
    thumbnail: 'https://cms.integreat-app.de/thumbnail.png',
    lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
    hash: '8cff3dcb420c0bbcbf612bf57f3c04ae'
  })
  const enCategoriesMap = new CategoriesMapModel([
    rootEnCategory,
    sub1EnCategory,
    sub2EnCategory,
    sub2subEnCategory
  ])

  const createGermanModel = ({ translatable }: { translatable: boolean } = { translatable: true }) => {
    const deCategories = [
      new CategoryModel({
        root: true,
        path: '/augsburg/de',
        title: 'augsburg',
        content: '',
        order: -1,
        availableLanguages: new Map(),
        thumbnail: 'no_thumbnail',
        parentPath: '',
        hash: ''
      }), new CategoryModel({
        root: false,
        path: '/augsburg/de/anlaufstellen',
        title: 'Anlaufstellen zu sonstigen Themen',
        content: '',
        parentPath: '/augsburg/de',
        order: 75,
        availableLanguages: translatable ? new Map([
          ['en', '/augsburg/en/anlaufstellen']
        ]) : new Map(),
        thumbnail: 'https://cms.integreat-app.de/thumbnail.png',
        lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        hash: '8cff3dcb420c0bbcbf612bf57f3c04ae'
      }),
      new CategoryModel({
        root: false,
        path: '/augsburg/de/willkommen',
        title: 'Willkommen',
        content: '',
        parentPath: '/augsburg/de',
        order: 11,
        availableLanguages: translatable ? new Map([
          ['en', '/augsburg/en/erste-schritte']
        ]) : new Map(),
        thumbnail: 'https://cms.integreat-app.de/thumbnail.png',
        lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        hash: '8cff3dcb420c0bbcbf612bf57f3c04ae'
      }),
      new CategoryModel({
        root: false,
        path: '/augsburg/de/willkommen/willkommen-in-augsburg',
        title: 'Willkommen in Augsburg',
        content: 'some content',
        parentPath: '/augsburg/de/willkommen',
        order: 1,
        availableLanguages: translatable ? new Map([
          ['en', '/augsburg/en/erste-schritte/welcome-to-augsburg']
        ]) : new Map(),
        thumbnail: 'https://cms.integreat-ap…09/heart295-150x150.png',
        lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        hash: '8cff3dcb420c0bbcbf612bf57f3c04ae'
      })
    ]

    return new CategoriesMapModel(deCategories)
  }

  const cityLanguages = [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')]

  const enEvents = [
    new EventModel({
      id: 1,
      path: '/augsburg/en/events/first_event',
      title: 'first Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/erstes_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24', 'UTC'),
      content: 'content',
      thumbnail: 'thumbnail'
    }),
    new EventModel({
      id: 2,
      path: '/augsburg/en/events/second_event',
      title: 'second Event',
      availableLanguages: new Map(
        [['en', '/augsburg/de/events/zweites_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumbnail'
    }),
    new EventModel({
      id: 3,
      path: '/augsburg/en/events/third_event',
      title: 'third Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/drittes_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24', 'UTC'),
      thumbnail: 'thumbnail'
    })
  ]

  const deEvents = [
    new EventModel({
      id: 1,
      path: '/augsburg/de/events/erstes_event',
      title: 'Erstes Event',
      availableLanguages: new Map(
        [['de', '/augsburg/en/events/first_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24', 'UTC'),
      content: 'content',
      thumbnail: 'thumbnail'
    }),
    new EventModel({
      id: 2,
      path: '/augsburg/de/events/zweites_event',
      title: 'Zweites Event',
      availableLanguages: new Map(
        [['en', '/augsburg/en/events/second_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumbnail'
    }),
    new EventModel({
      id: 3,
      path: '/augsburg/de/events/drittes_event',
      title: 'Drittes Event',
      availableLanguages: new Map(
        [['en', '/augsburg/en/events/third_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24', 'UTC'),
      thumbnail: 'thumbnail'
    })
  ]

  const prepareState = ({ path, model, eventPath, events }: {
    path: string, model: CategoryModel, eventPath: ?string, events: Array<EventModel>
  } = {
    path: '/augsburg/de',
    model: createGermanModel(),
    eventPath: '/augsburg/de/events/drittes_event',
    events: deEvents
  }): CityContentStateType => {
    const pushCategoryAction: PushCategoryActionType = {
      type: 'PUSH_CATEGORY',
      params: {
        categoriesMap: model,
        cityLanguages,
        path,
        depth: 2,
        key: 'route-0',
        resourceCache: {},
        city: 'augsburg',
        language: 'de'
      }
    }

    const pushEventAction: PushEventActionType = {
      type: 'PUSH_EVENT',
      params: {
        path: null,
        events,
        cityLanguages,
        key: 'route-1',
        resourceCache: {},
        language: 'de',
        city: 'augsburg'
      }
    }
    return pushEvent(
      pushCategory(createCityContent('augsburg', cityLanguages), pushCategoryAction),
      pushEventAction
    )
  }

  it('should not change when language is equal', () => {
    const action: MorphContentLanguageActionType = {
      type: 'MORPH_CONTENT_LANGUAGE',
      params: {
        newCategoriesMap: createGermanModel(),
        newResourceCache: {},
        newEvents: deEvents,
        newLanguage: 'de'
      }
    }

    const previous = prepareState()

    const newState = morphContentLanguage(previous, action)

    expect(newState).toEqual(previous)
  })

  it('should warn if category models are invalid', () => {
    const spy = jest.spyOn(console, 'warn')

    const action: MorphContentLanguageActionType = {
      type: 'MORPH_CONTENT_LANGUAGE',
      params: {
        newCategoriesMap: new CategoriesMapModel([]),
        newResourceCache: {},
        newEvents: enEvents,
        newLanguage: 'en'
      }
    }

    const previous = prepareState()

    if (previous.categoriesRouteMapping.errorMessage !== undefined) {
      throw Error('Preparation of state failed')
    }
    const route = previous.categoriesRouteMapping['route-0']
    if (route.status !== 'ready') {
      throw Error('Preparation of state failed')
    }

    morphContentLanguage(previous, action)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should translate route', () => {
    const action: MorphContentLanguageActionType = {
      type: 'MORPH_CONTENT_LANGUAGE',
      params: {
        newCategoriesMap: enCategoriesMap,
        newResourceCache: {},
        newEvents: enEvents,
        newLanguage: 'en'
      }
    }

    const previous = prepareState({
      path: '/augsburg/de',
      model: createGermanModel(),
      eventPath: '/augsburg/de/events/drittes_event',
      events: deEvents
    })

    const newState = morphContentLanguage(previous, action)

    expect(newState).toMatchSnapshot()
  })

  it('should set languageNotAvailable for category', () => {
    const action: MorphContentLanguageActionType = {
      type: 'MORPH_CONTENT_LANGUAGE',
      params: {
        newCategoriesMap: enCategoriesMap,
        newResourceCache: {},
        newEvents: enEvents,
        newLanguage: 'en'
      }
    }

    const previous = prepareState({
      path: '/augsburg/de/anlaufstellen',
      model: createGermanModel({ translatable: false }),
      eventPath: null,
      events: deEvents
    })

    expect(morphContentLanguage(previous, action)).toEqual({
      city: 'augsburg',
      switchingLanguage: false,
      languages: cityLanguages,
      categoriesRouteMapping: {
        'route-0': {
          status: 'languageNotAvailable',
          city: 'augsburg',
          language: 'en',
          depth: 2,
          allAvailableLanguages: new Map([['de', '/augsburg/de/anlaufstellen']])
        }
      },
      eventsRouteMapping: {
        'route-1': {
          status: 'ready',
          city: 'augsburg',
          language: 'en',
          path: null,
          allAvailableLanguages: new Map([['de', null], ['en', null]]),
          models: enEvents
        }
      },
      resourceCache: {},
      searchRoute: { categoriesMap: enCategoriesMap }
    })
  })

  it('should set languageNotAvailable for event', () => {
    const action: MorphContentLanguageActionType = {
      type: 'MORPH_CONTENT_LANGUAGE',
      params: {
        newCategoriesMap: enCategoriesMap,
        newResourceCache: {},
        newEvents: enEvents,
        newLanguage: 'en'
      }
    }

    const previous = prepareState({
      path: '/augsburg/de',
      model: createGermanModel({ translatable: false }),
      eventPath: '/augsburg/de/events/drittes_event',
      events: deEvents
    })

    expect(morphContentLanguage(previous, action)).toEqual({
      city: 'augsburg',
      switchingLanguage: false,
      languages: cityLanguages,
      categoriesRouteMapping: {
        'route-0': {
          status: 'ready',
          city: 'augsburg',
          language: 'en',
          depth: 2,
          path: '/augsburg/en',
          allAvailableLanguages: new Map([['de', '/augsburg/de'], ['en', '/augsburg/en']]),
          models: {
            [rootEnCategory.path]: rootEnCategory,
            [sub1EnCategory.path]: sub1EnCategory,
            [sub2EnCategory.path]: sub2EnCategory,
            [sub2subEnCategory.path]: sub2subEnCategory
          },
          children: {
            [rootEnCategory.path]: [sub1EnCategory.path, sub2EnCategory.path],
            [sub1EnCategory.path]: [],
            [sub2EnCategory.path]: [sub2subEnCategory.path]
          }
        }
      },
      eventsRouteMapping: {
        'route-1': {
          status: 'ready',
          city: 'augsburg',
          language: 'en',
          path: null,
          allAvailableLanguages: new Map([['de', null], ['en', null]]),
          models: enEvents
        }
      },
      resourceCache: {},
      searchRoute: { categoriesMap: enCategoriesMap }
    })
  })
})
