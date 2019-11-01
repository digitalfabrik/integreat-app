// @flow

import { CategoriesMapModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import DatabaseContext from './DatabaseContext'
import type {
  CityResourceCacheStateType,
  PageResourceCacheStateType,
  LanguageResourceCacheStateType
} from '../app/StateType'
import DatabaseConnector from './DatabaseConnector'
import type { DataContainer } from './DataContainer'
import type Moment from 'moment'
import { difference, flatMap, isEmpty, map, omitBy } from 'lodash'
import RNFetchBlob from 'rn-fetch-blob'
import Cache from './Cache'

type CacheType = {
  cities: Cache<Array<CityModel>>,
  events: Cache<Array<EventModel>>,
  categories: Cache<CategoriesMapModel>,
  languages: Cache<Array<LanguageModel>>,
  resourceCache: Cache<CityResourceCacheStateType>,
  lastUpdate: Cache<Moment | null>
}

type CacheKeyType = $Keys<CacheType>

class DefaultDataContainer implements DataContainer {
  _databaseConnector: DatabaseConnector
  caches: CacheType

  constructor () {
    this._databaseConnector = new DatabaseConnector()

    this.caches = {
      cities: new Cache<Array<CityModel>>(this._databaseConnector,
        (connector: DatabaseConnector) => connector.loadCities(),
        (value: Array<CityModel>, connector: DatabaseConnector) => connector.storeCities(value)),
      events: new Cache<Array<EventModel>>(this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadEvents(context),
        (value: Array<EventModel>, connector: DatabaseConnector, context: DatabaseContext) =>
          connector.storeEvents(value, context)),
      categories: new Cache<CategoriesMapModel>(this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadCategories(context),
        (value: CategoriesMapModel, connector: DatabaseConnector, context: DatabaseContext) =>
          connector.storeCategories(value, context)),
      languages: new Cache<Array<LanguageModel>>(this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadLanguages(context),
        (value: Array<LanguageModel>, connector: DatabaseConnector, context: DatabaseContext) =>
          connector.storeLanguages(value, context)),
      resourceCache: new Cache<CityResourceCacheStateType>(this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadResourceCache(context),
        (value: CityResourceCacheStateType, connector: DatabaseConnector, context: DatabaseContext) =>
          connector.storeResourceCache(value, context)),
      lastUpdate: new Cache<Moment | null>(this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadLastUpdate(context),
        (value: Moment | null, connector: DatabaseConnector, context: DatabaseContext) =>
          connector.storeLastUpdate(value, context))
    }
  }

  isCached (key: CacheKeyType, context: DatabaseContext): boolean {
    return this.caches[key].isCached(context)
  }

  getCities = async (): Promise<Array<CityModel>> => {
    const cache = this.caches.cities
    return cache.get(new DatabaseContext())
  }

  getCategoriesMap = (city: string, language: string): Promise<CategoriesMapModel> => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<CategoriesMapModel> = this.caches.categories
    return cache.get(context)
  }

  getEvents = (city: string, language: string): Promise<Array<EventModel>> => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<Array<EventModel>> = this.caches.events
    return cache.get(context)
  }

  getLanguages = (city: string): Promise<Array<LanguageModel>> => {
    const cache: Cache<Array<LanguageModel>> = this.caches.languages
    return cache.get(new DatabaseContext(city))
  }

  getResourceCache = async (city: string, language: string): Promise<LanguageResourceCacheStateType> => {
    const context = new DatabaseContext(city, null)
    const cache: Cache<CityResourceCacheStateType> = this.caches.resourceCache
    const resourceCache = await cache.get(context)

    if (resourceCache) {
      await this._databaseConnector.updateLastUsage(context)
    }

    if (!resourceCache[language]) {
      return {}
    }

    return resourceCache[language]
  }

  getLastUpdate = (city: string, language: string): Promise<Moment | null> => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<Moment | null> = this.caches.lastUpdate
    return cache.get(context)
  }

  setCategoriesMap = async (city: string, language: string, categories: CategoriesMapModel) => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<CategoriesMapModel> = this.caches.categories
    await cache.cache(categories, context)
  }

  setCities = async (cities: Array<CityModel>) => {
    const cache = this.caches.cities
    await cache.cache(cities, new DatabaseContext())
  }

  setEvents = async (city: string, language: string, events: Array<EventModel>) => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<Array<EventModel>> = this.caches.events
    await cache.cache(events, context)
  }

  setLanguages = async (city: string, languages: Array<LanguageModel>) => {
    const context = new DatabaseContext(city)
    const cache: Cache<Array<LanguageModel>> = this.caches.languages
    await cache.cache(languages, context)
  }

  getFilePathsFromLanguageResourceCache (languageResourceCache: LanguageResourceCacheStateType): Array<string> {
    return flatMap(
      Object.values(languageResourceCache),
      (file: PageResourceCacheStateType): Array<string> => map(file, ({ filePath }) => filePath)
    )
  }

  setResourceCache = async (city: string, language: string, resourceCache: LanguageResourceCacheStateType) => {
    const context = new DatabaseContext(city, null)

    const cache: Cache<CityResourceCacheStateType> = this.caches.resourceCache
    const previousResourceCache = cache.getCached(context)

    if (!previousResourceCache) {
      await cache.cache({ [language]: resourceCache }, context)
      return
    }

    const newResourceCache = { ...previousResourceCache, [language]: resourceCache }

    if (previousResourceCache[language]) {
      // Cleanup old resources
      const oldPaths = this.getFilePathsFromLanguageResourceCache(previousResourceCache[language])
      const newPaths = this.getFilePathsFromLanguageResourceCache(resourceCache)
      const removedPaths = difference(oldPaths, newPaths)
      if (!isEmpty(removedPaths)) {
        const pathsOfOtherLanguages = flatMap(
          // $FlowFixMe https://github.com/flow-typed/flow-typed/issues/1099
          omitBy(previousResourceCache, (val, key: string) => key === language),
          (languageCache: LanguageResourceCacheStateType) => this.getFilePathsFromLanguageResourceCache(languageCache)
        )
        const pathsToClean = difference(removedPaths, pathsOfOtherLanguages)
        console.debug('Cleaning up the following resources:')
        console.debug(pathsToClean)
        await Promise.all(pathsToClean.map(path => RNFetchBlob.fs.unlink(path)))
      }
    }

    await cache.cache(newResourceCache, context)
  }

  setLastUpdate = async (city: string, language: string, lastUpdate: Moment | null) => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<Moment | null> = this.caches.lastUpdate
    await cache.cache(lastUpdate, context)
  }

  citiesAvailable = async (): Promise<boolean> => {
    const context = new DatabaseContext()
    return this.isCached('cities', context) || this._databaseConnector.isCitiesPersisted()
  }

  categoriesAvailable = async (city: string, language: string): Promise<boolean> => {
    const context = new DatabaseContext(city, language)
    return this.isCached('categories', context) || this._databaseConnector.isCategoriesPersisted(context)
  }

  languagesAvailable = async (city: string): Promise<boolean> => {
    const context = new DatabaseContext(city)
    return this.isCached('languages', context) || this._databaseConnector.isLanguagesPersisted(context)
  }

  eventsAvailable = async (city: string, language: string): Promise<boolean> => {
    const context = new DatabaseContext(city, language)
    return this.isCached('events', context) || this._databaseConnector.isEventsPersisted(context)
  }

  cityContentAvailable = async (city: string, language: string): Promise<boolean> => {
    return this.categoriesAvailable(city, language) && this.eventsAvailable(city, language) &&
      this.languagesAvailable(city)
  }
}

export default DefaultDataContainer
