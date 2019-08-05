// @flow

import { CategoriesMapModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import DatabaseContext from './DatabaseContext'
import type { CityResourceCacheStateType, FileCacheStateType, LanguageResourceCacheStateType } from '../app/StateType'
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
        (value: Array<CityModel>, connector: DatabaseConnector) =>
          connector.storeCities(value)),
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
    const cache: Cache<Array<CityModel>> = this.caches.cities
    return cache.get()
  }

  getCategoriesMap = (context: DatabaseContext): Promise<CategoriesMapModel> => {
    const cache: Cache<CategoriesMapModel> = this.caches.categories
    return cache.get(context)
  }

  getEvents = (context: DatabaseContext): Promise<Array<EventModel>> => {
    const cache: Cache<Array<EventModel>> = this.caches.events
    return cache.get(context)
  }

  getLanguages = (context: DatabaseContext): Promise<Array<LanguageModel>> => {
    const cache: Cache<Array<LanguageModel>> = this.caches.languages
    return cache.get(context)
  }

  getResourceCache = async (context: DatabaseContext): Promise<LanguageResourceCacheStateType> => {
    const cache: Cache<CityResourceCacheStateType> = this.caches.resourceCache
    const resourceCache = await cache.get(context)

    if (!resourceCache[context.languageCode]) {
      return {}
    }

    return resourceCache[context.languageCode]
  }

  getLastUpdate = (context: DatabaseContext): Promise<Moment | null> => {
    const cache: Cache<Moment | null> = this.caches.lastUpdate
    return cache.get(context)
  }

  setCategoriesMap = async (context: DatabaseContext, categories: CategoriesMapModel) => {
    const cache: Cache<CategoriesMapModel> = this.caches.categories
    await cache.cache(categories, context)
  }

  setCities = async (cities: Array<CityModel>) => {
    const cache: Cache<CityModel> = this.caches.cities
    await cache.cache(cities)
  }

  setEvents = async (context: DatabaseContext, events: Array<EventModel>) => {
    const cache: Cache<Array<EventModel>> = this.caches.events
    await cache.cache(events, context)
  }

  setLanguages = async (context: DatabaseContext, languages: Array<LanguageModel>) => {
    const cache: Cache<Array<LanguageModel>> = this.caches.languages
    await cache.cache(languages, context)
  }

  getFilePathsFromLanguageResourceCache (languageResourceCache: LanguageResourceCacheStateType): Array<string> {
    return flatMap(
      Object.values(languageResourceCache),
      (file: FileCacheStateType): Array<string> => map(file, ({ filePath }) => filePath)
    )
  }

  setResourceCache = async (context: DatabaseContext, resourceCache: LanguageResourceCacheStateType) => {
    const language = context.languageCode
    const cache: Cache<CityResourceCacheStateType> = this.caches.resourceCache
    const previousResourceCache = cache.getCached(context)

    if (!previousResourceCache) {
      await cache.cache({ [language]: resourceCache }, context)
      return
    }

    const newResourceCache = { ...previousResourceCache, [language]: resourceCache }

    if (resourceCache[language]) {
      // Cleanup old resources
      const oldPaths = this.getFilePathsFromLanguageResourceCache(previousResourceCache[language])
      const newPaths = this.getFilePathsFromLanguageResourceCache(resourceCache)
      const removedPaths = difference(oldPaths, newPaths)
      if (!isEmpty(removedPaths)) {
        const pathsOfOtherLanguages = flatMap(
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

  setLastUpdate = async (context: DatabaseContext, lastUpdate: Moment | null) => {
    const cache: Cache<Moment | null> = this.caches.lastUpdate
    await cache.cache(lastUpdate, context)
  }

  async categoriesAvailable (context: DatabaseContext): Promise<boolean> {
    return this.isCached('categories', context) || this._databaseConnector.isCategoriesPersisted(context)
  }

  async languagesAvailable (context: DatabaseContext): Promise<boolean> {
    return this.isCached('languages', context) || this._databaseConnector.isLanguagesPersisted(context)
  }

  async eventsAvailable (context: DatabaseContext): Promise<boolean> {
    return this.isCached('events', context) || this._databaseConnector.isEventsPersisted(context)
  }
}

export default DefaultDataContainer
