// @flow

import { CategoriesMapModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import DatabaseContext from './DatabaseContext'
import type { CityResourceCacheStateType, FileCacheStateType, LanguageResourceCacheStateType } from '../app/StateType'
import DatabaseConnector from './DatabaseConnector'
import type { DataContainer } from './DataContainer'
import type Moment from 'moment'
import { difference, flatMap, isEmpty, map, omitBy } from 'lodash'
import RNFetchBlob from 'rn-fetch-blob'

type LoadFunctionType<T> = (databaseConnector: DatabaseConnector, context: DatabaseContext) => Promise<T | null>

class Cache<T> {
  databaseConnector: DatabaseConnector
  value: T | null
  load: LoadFunctionType<T>

  constructor (databaseConnector: DatabaseConnector, load: LoadFunctionType<T>) {
    this.databaseConnector = databaseConnector
    this.load = load
  }

  async get (context: DatabaseContext): Promise<T> {
    const value = this.value
    if (!value) {
      const newValue: T | null = await this.load(this.databaseConnector, context)

      if (!newValue) {
        throw new Error()
      }

      this.value = newValue
      return newValue
    }

    return value
  }

  isCached = (): boolean => {
    return !!this.value
  }

  cache = (value: T) => {
    this.value = value
  }

  evict = () => {
    this.value = null
  }
}

type CacheType = {
  events: Cache<Array<EventModel>>,
  categories: Cache<CategoriesMapModel>,
  languages: Cache<Array<LanguageModel>>,
  resourceCache: Cache<CityResourceCacheStateType>,
  lastUpdate: Cache<Moment>
}

type CacheKeyType = $Keys<CacheType>

class DefaultDataContainer implements DataContainer {
  _databaseConnector: DatabaseConnector
  caches: CacheType

  _cities: Array<CityModel> | null

  constructor () {
    this._databaseConnector = new DatabaseConnector()

    this.caches = {
      'events': new Cache<Array<EventModel>>(this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadEvents(context)),
      'categories': new Cache<CategoriesMapModel>(this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadCategories(context)),
      'languages': new Cache<Array<LanguageModel>>(this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadLanguages(context)),
      'resourceCache': new Cache<CityResourceCacheStateType>(this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadResourceCache(context)),
      'lastUpdate': new Cache<Moment>(this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadLastUpdate(context))
    }
  }

  isCached (key: CacheKeyType): boolean {
    return this.caches[key].isCached()
  }

  evict (key: CacheKeyType) {
    this.caches[key].evict()
  }

  getCities = async (): Promise<Array<CityModel>> => {
    if (this._cities === null) {
      throw Error('Cities are null.')
    }
    return this._cities
  }

  getCategoriesMap = (context: DatabaseContext): Promise<CategoriesMapModel> => {
    const cache: Cache<Array<EventModel>> = this.caches['categories']
    return cache.get(context)
  }

  getEvents = (context: DatabaseContext): Promise<Array<EventModel>> => {
    const cache: Cache<Array<EventModel>> = this.caches['events']
    return cache.get(context)
  }

  getLanguages = async (context: DatabaseContext): Promise<Array<LanguageModel>> => {
    const cache: Cache<Array<LanguageModel>> = this.caches['languages']
    return cache.get(context)
  }

  getResourceCache = async (context: DatabaseContext): Promise<LanguageResourceCacheStateType> => {
    const cache: Cache<CityResourceCacheStateType> = this.caches['resourceCache']
    const resourceCache = await cache.get(context)

    if (!resourceCache[context.languageCode]) {
      throw Error('LanguageResourceCache is null.')
    }

    return resourceCache[context.languageCode]
  }

  getLastUpdate = async (context: DatabaseContext): Promise<Moment> => {
    const cache: Cache<Moment> = this.caches['lastUpdate']
    return cache.get(context)
  }

  setCategoriesMap = async (context: DatabaseContext, categories: CategoriesMapModel) => {
    const cache: Cache<CategoriesMapModel> = this.caches['categories']
    return cache.cache(categories)
  }

  setCities = async (cities: Array<CityModel>) => {
    // TODO: Offline available cities will be persisted in NATIVE-175. For now switching cities when offline is not possible.
    this._cities = cities
  }

  setEvents = async (context: DatabaseContext, events: Array<EventModel>) => {
    const cache: Cache<Array<EventModel>> = this.caches['events']
    return cache.cache(events)
  }

  setLanguages = async (city: string, languages: Array<LanguageModel>) => {
    const cache: Cache<Array<LanguageModel>> = this.caches['languages']
    return cache.cache(languages)
  }

  getFilePathsFromLanguageResourceCache (languageResourceCache: LanguageResourceCacheStateType): Array<string> {
    return flatMap(
      Object.values(languageResourceCache),
      (file: FileCacheStateType): Array<string> => map(file, ({ filePath }) => filePath)
    )
  }

  setResourceCache = async (context: DatabaseContext, resourceCache: LanguageResourceCacheStateType) => {
    const language = context.languageCode
    const cache: Cache<CityResourceCacheStateType> = this.caches['resourceCache']
    const previousResourceCache = await cache.get(context)

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

    cache.cache(newResourceCache)
  }

  setLastUpdate = async (context: DatabaseContext, lastUpdate: Moment) => {
    const cache: Cache<Moment> = this.caches['lastUpdate']
    cache.cache(lastUpdate)
  }

  categoriesAvailable (context: DatabaseContext): boolean {
    return this.isCached('categories')
  }

  languagesAvailable (city: string): boolean {
    return this.isCached('languages')
  }

  eventsAvailable (context: DatabaseContext): boolean {
    return this.isCached('events')
  }

  resourceCacheAvailable (context: DatabaseContext): boolean {
    return this.isCached('resourceCache')
  }

  lastUpdateAvailable (context: DatabaseContext): boolean {
    return this.isCached('lastUpdate')
  }
}

export default DefaultDataContainer
