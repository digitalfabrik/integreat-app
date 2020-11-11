// @flow

import {
  CategoriesMapModel,
  CategoryModel,
  DateModel,
  EventModel,
  LanguageModel,
  LocationModel, PoiModel
} from 'api-client'
import moment from 'moment'
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
  const createCategory = ({ root, path, order, availableLanguages, parentPath }: {|
    root: boolean, path: string, order: number, availableLanguages: Map<string, string>, parentPath: string
  |}) => new CategoryModel({
    root,
    path,
    order,
    availableLanguages,
    parentPath,
    title: '',
    content: '',
    thumbnail: 'no_thumbnail',
    hash: '',
    lastUpdate: moment('2011-02-04T00:00:00.000Z')
  })

  const rootEnCategory = createCategory({
    root: true,
    path: '/augsburg/en',
    order: 0,
    availableLanguages: new Map([]),
    parentPath: ''
  })
  const sub1EnCategory = createCategory({
    root: false,
    path: '/augsburg/en/anlaufstellen',
    parentPath: '/augsburg/en',
    order: 1,
    availableLanguages: new Map([['de', '/augsburg/de/anlaufstellen']])
  })
  const sub2EnCategory = createCategory({
    root: false,
    path: '/augsburg/en/erste-schritte',
    parentPath: '/augsburg/en',
    order: 2,
    availableLanguages: new Map([['de', '/augsburg/de/willkommen']])
  })
  const sub2subEnCategory = createCategory({
    root: false,
    path: '/augsburg/en/erste-schritte/welcome-to-augsburg',
    parentPath: '/augsburg/en/erste-schritte',
    order: 1,
    availableLanguages: new Map([['de', '/augsburg/de/willkommen/willkommen-in-augsburg']])
  })
  const enCategoriesMap = new CategoriesMapModel([
    rootEnCategory,
    sub1EnCategory,
    sub2EnCategory,
    sub2subEnCategory
  ])

  const createGermanCategoriesMap = ({ translatable }: { translatable: boolean } = { translatable: true }) => {
    const deCategories = [
      createCategory({
        root: true,
        path: '/augsburg/de',
        order: -1,
        availableLanguages: new Map(),
        parentPath: ''
      }),
      createCategory({
        root: false,
        path: '/augsburg/de/anlaufstellen',
        parentPath: '/augsburg/de',
        order: 75,
        availableLanguages: new Map(translatable ? [['en', '/augsburg/en/anlaufstellen']] : [])
      }),
      createCategory({
        root: false,
        path: '/augsburg/de/willkommen',
        parentPath: '/augsburg/de',
        order: 11,
        availableLanguages: new Map(translatable ? [['en', '/augsburg/en/erste-schritte']] : [])
      }),
      createCategory({
        root: false,
        path: '/augsburg/de/willkommen/willkommen-in-augsburg',
        parentPath: '/augsburg/de/willkommen',
        order: 1,
        availableLanguages: new Map(translatable ? [['en', '/augsburg/en/erste-schritte/welcome-to-augsburg']] : [])
      })
    ]
    return new CategoriesMapModel(deCategories)
  }

  const cityLanguages = [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')]

  const createEvent = ({ path, availableLanguages }: {| path: string, availableLanguages: Map<string, string> |}) =>
    new EventModel({
      path,
      title: 'title',
      availableLanguages,
      date: new DateModel({
        startDate: moment('2017-11-18 09:30:00', moment.ISO_8601),
        endDate: moment('2017-11-18 19:30:00', moment.ISO_8601),
        allDay: true
      }),
      location: new LocationModel({
        name: 'name',
        address: 'address',
        town: 'town',
        state: 'state',
        postcode: 'postcode',
        region: 'region',
        country: 'country',
        longitude: null,
        latitude: null
      }),
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24', moment.ISO_8601),
      content: 'content',
      thumbnail: 'thumbnail',
      featuredImage: null,
      hash: '12345'
    })

  const createPoi = ({ path, availableLanguages }: {| path: string, availableLanguages: Map<string, string> |}) =>
    new PoiModel({
      path: 'test',
      title: 'test',
      content: 'test',
      thumbnail: 'test',
      availableLanguages: availableLanguages,
      excerpt: 'test',
      location: new LocationModel({
        country: 'country',
        region: 'region',
        state: 'state',
        address: 'address',
        town: 'town',
        postcode: 'postcode',
        latitude: '15',
        longitude: '15',
        name: 'name'
      }),
      lastUpdate: moment('2011-02-04T00:00:00.000Z'),
      hash: 'test'
    })

  const enFirstEvent = createEvent({
    path: '/augsburg/en/events/first_event',
    availableLanguages: new Map([['de', '/augsburg/de/events/erstes_event']])
  })
  const enSecondEvent = createEvent({
    path: '/augsburg/en/events/second_event',
    availableLanguages: new Map([['en', '/augsburg/de/events/zweites_event']])
  })
  const enThirdEvent = createEvent({
    path: '/augsburg/en/events/third_event',
    availableLanguages: new Map([['de', '/augsburg/de/events/drittes_event']])
  })

  const enEvents = [enFirstEvent, enSecondEvent, enThirdEvent]

  const createGermanEvents = ({ translatable }: { translatable: boolean } = { translatable: true }) => [
    createEvent({
      path: '/augsburg/de/events/erstes_event',
      availableLanguages: new Map(translatable ? [['de', '/augsburg/en/events/first_event']] : [])
    }),
    createEvent({
      path: '/augsburg/de/events/zweites_event',
      availableLanguages: new Map(translatable ? [['en', '/augsburg/en/events/second_event']] : [])
    }),
    createEvent({
      path: '/augsburg/de/events/drittes_event',
      availableLanguages: new Map(translatable ? [['en', '/augsburg/en/events/third_event']] : [])
    })
  ]

  const enFirstPoi = createPoi({
    path: '/augsburg/en/events/first_event',
    availableLanguages: new Map([['de', '/augsburg/de/events/erstes_event']])
  })
  const enSecondPoi = createPoi({
    path: '/augsburg/en/events/second_event',
    availableLanguages: new Map([['en', '/augsburg/de/events/zweites_event']])
  })
  const enThirdPoi = createPoi({
    path: '/augsburg/en/events/third_event',
    availableLanguages: new Map([['de', '/augsburg/de/events/drittes_event']])
  })

  const enPois = [enFirstPoi, enSecondPoi, enThirdPoi]

  const createGermanPois = ({ translatable }: { translatable: boolean } = { translatable: true }) => [
    createPoi({
      path: '/augsburg/de/poi/erstes_poi',
      availableLanguages: new Map(translatable ? [['de', '/augsburg/en/poi/first_poi']] : [])
    }),
    createPoi({
      path: '/augsburg/de/poi/zweites_poi',
      availableLanguages: new Map(translatable ? [['en', '/augsburg/en/poi/second_poi']] : [])
    }),
    createPoi({
      path: '/augsburg/de/poi/dritter_poi',
      availableLanguages: new Map(translatable ? [['en', '/augsburg/en/poi/third_poi']] : [])
    })
  ]

  const prepareState = ({ path, categoriesMap, eventPath, events }: {
    path: string, categoriesMap: CategoriesMapModel, eventPath: ?string, events: Array<EventModel>
  } = {
    path: '/augsburg/de',
    categoriesMap: createGermanCategoriesMap(),
    eventPath: '/augsburg/de/events/drittes_event',
    events: createGermanEvents()
  }): CityContentStateType => {
    const pushCategoryAction: PushCategoryActionType = {
      type: 'PUSH_CATEGORY',
      params: {
        categoriesMap,
        cityLanguages,
        path,
        depth: 2,
        key: 'route-0',
        resourceCache: {},
        city: 'augsburg',
        language: 'de',
        refresh: false
      }
    }

    const pushEventAction: PushEventActionType = {
      type: 'PUSH_EVENT',
      params: {
        path: eventPath,
        events,
        cityLanguages,
        key: 'route-1',
        resourceCache: {},
        language: 'de',
        city: 'augsburg',
        refresh: false
      }
    }
    return pushEvent(
      pushCategory(createCityContent('augsburg', cityLanguages), pushCategoryAction),
      pushEventAction
    )
  }

  it('should not change when language is equal', () => {
    const categoriesMap = createGermanCategoriesMap()
    const events = createGermanEvents()
    const pois = createGermanPois()
    const action: MorphContentLanguageActionType = {
      type: 'MORPH_CONTENT_LANGUAGE',
      params: {
        newCategoriesMap: categoriesMap,
        newResourceCache: {},
        newEvents: events,
        newPois: pois,
        newLanguage: 'de'
      }
    }

    const previous = prepareState({
      path: '/augsburg/de/willkommen',
      eventPath: null,
      events,
      categoriesMap
    })

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
        newPois: enPois,
        newLanguage: 'en'
      }
    }

    const previous = prepareState()

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
        newPois: enPois,
        newLanguage: 'en'
      }
    }

    const previous = prepareState({
      path: '/augsburg/de',
      categoriesMap: createGermanCategoriesMap(),
      eventPath: '/augsburg/de/events/drittes_event',
      events: createGermanEvents()
    })

    const newState = morphContentLanguage(previous, action)

    expect(newState).toEqual({
      city: 'augsburg',
      switchingLanguage: false,
      languages: {
        status: 'ready',
        models: cityLanguages
      },
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
          path: '/augsburg/en/events/third_event',
          allAvailableLanguages: new Map([
            ['de', '/augsburg/de/events/drittes_event'],
            ['en', '/augsburg/en/events/third_event']
          ]),
          models: [enThirdEvent]
        }
      },
      poisRouteMapping: expect.any(Object),
      newsRouteMapping: {},
      resourceCache: {
        status: 'ready',
        value: {}
      },
      searchRoute: { categoriesMap: enCategoriesMap }
    })
  })

  it('should set languageNotAvailable for category', () => {
    const action: MorphContentLanguageActionType = {
      type: 'MORPH_CONTENT_LANGUAGE',
      params: {
        newCategoriesMap: enCategoriesMap,
        newResourceCache: {},
        newEvents: enEvents,
        newPois: enPois,
        newLanguage: 'en'
      }
    }

    const previous = prepareState({
      path: '/augsburg/de/anlaufstellen',
      categoriesMap: createGermanCategoriesMap({ translatable: false }),
      eventPath: null,
      events: createGermanEvents()
    })

    expect(morphContentLanguage(previous, action)).toEqual({
      city: 'augsburg',
      switchingLanguage: false,
      languages: {
        status: 'ready',
        models: cityLanguages
      },
      categoriesRouteMapping: {
        'route-0': {
          status: 'languageNotAvailable',
          city: 'augsburg',
          language: 'en',
          depth: 2,
          allAvailableLanguages: new Map([['de', '/augsburg/de/anlaufstellen']])
        }
      },
      eventsRouteMapping: expect.any(Object),
      poisRouteMapping: expect.any(Object),
      newsRouteMapping: {},
      resourceCache: {
        status: 'ready',
        value: {}
      },
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
        newPois: enPois,
        newLanguage: 'en'
      }
    }

    const previous = prepareState({
      path: '/augsburg/de',
      categoriesMap: createGermanCategoriesMap(),
      eventPath: '/augsburg/de/events/drittes_event',
      events: createGermanEvents({ translatable: false })
    })

    expect(morphContentLanguage(previous, action)).toEqual({
      city: 'augsburg',
      switchingLanguage: false,
      languages: {
        status: 'ready',
        models: cityLanguages
      },
      categoriesRouteMapping: expect.any(Object),
      newsRouteMapping: {},
      eventsRouteMapping: {
        'route-1': {
          status: 'languageNotAvailable',
          city: 'augsburg',
          language: 'en',
          allAvailableLanguages: new Map([['de', '/augsburg/de/events/drittes_event']])
        }
      },
      poisRouteMapping: expect.any(Object),
      resourceCache: {
        status: 'ready',
        value: {}
      },
      searchRoute: { categoriesMap: enCategoriesMap }
    })
  })
})
