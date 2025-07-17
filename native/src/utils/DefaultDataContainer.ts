import * as RNFS from '@dr.pogodin/react-native-fs'
import { difference, flatMap, isEmpty, map, omitBy } from 'lodash'
import { DateTime } from 'luxon'

import { CategoriesMapModel, CityModel, EventModel, LocalNewsModel, PoiModel } from 'shared/api'

import Cache from '../models/Cache'
import DatabaseContext from '../models/DatabaseContext'
import {
  CityResourceCacheStateType,
  DataContainer,
  LanguageResourceCacheStateType,
  PageResourceCacheStateType,
} from './DataContainer'
import DatabaseConnector from './DatabaseConnector'
import { log } from './sentry'

type CacheType = {
  pois: Cache<PoiModel[]>
  cities: Cache<CityModel[]>
  events: Cache<EventModel[]>
  categories: Cache<CategoriesMapModel>
  localNews: Cache<LocalNewsModel[]>
  resourceCache: Cache<CityResourceCacheStateType>
  lastUpdate: Cache<DateTime | null>
}
type CacheKeyType = keyof CacheType

class DefaultDataContainer implements DataContainer {
  _databaseConnector: DatabaseConnector
  caches: CacheType

  constructor() {
    this._databaseConnector = new DatabaseConnector()
    this.caches = {
      pois: new Cache<PoiModel[]>(
        this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadPois(context),
        (value: PoiModel[], connector: DatabaseConnector, context: DatabaseContext) =>
          connector.storePois(value, context),
      ),
      cities: new Cache<CityModel[]>(
        this._databaseConnector,
        (connector: DatabaseConnector) => connector.loadCities(),
        (value: CityModel[], connector: DatabaseConnector) => connector.storeCities(value),
      ),
      events: new Cache<EventModel[]>(
        this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadEvents(context),
        (value: EventModel[], connector: DatabaseConnector, context: DatabaseContext) =>
          connector.storeEvents(value, context),
      ),
      categories: new Cache<CategoriesMapModel>(
        this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadCategories(context),
        (value: CategoriesMapModel, connector: DatabaseConnector, context: DatabaseContext) =>
          connector.storeCategories(value, context),
      ),
      localNews: new Cache<LocalNewsModel[]>(
        this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadLocalNews(context),
        (value: LocalNewsModel[], connector: DatabaseConnector, context: DatabaseContext) =>
          connector.storeLocalNews(value, context),
      ),
      resourceCache: new Cache<CityResourceCacheStateType>(
        this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadResourceCache(context),
        (value: CityResourceCacheStateType, connector: DatabaseConnector, context: DatabaseContext) =>
          connector.storeResourceCache(value, context),
      ),
      lastUpdate: new Cache<DateTime | null>(
        this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadLastUpdate(context),
        (value: DateTime | null, connector: DatabaseConnector, context: DatabaseContext) =>
          connector.storeLastUpdate(value, context),
      ),
    }
  }

  clearInMemoryCache = (): void => {
    Object.keys(this.caches).forEach(cache => this.caches[cache as keyof CacheType].evict())
  }

  deleteCity = async (city: string): Promise<void> => {
    await this._databaseConnector.deleteCities([city])
  }

  // WARNING: Be careful using this method, it deletes ALL offline content, including meta data which may lead to inconsistent app states and break our offline functionality.
  _clearOfflineCache = async (): Promise<void> => {
    await this._databaseConnector.deleteAllFiles()
  }

  isCached(key: CacheKeyType, context: DatabaseContext): boolean {
    return this.caches[key].isCached(context)
  }

  getCities = async (): Promise<CityModel[]> => {
    const cache = this.caches.cities
    return cache.get(new DatabaseContext())
  }

  getCategoriesMap = (city: string, language: string): Promise<CategoriesMapModel> => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<CategoriesMapModel> = this.caches.categories
    return cache.get(context)
  }

  getEvents = (city: string, language: string): Promise<EventModel[]> => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<EventModel[]> = this.caches.events
    return cache.get(context)
  }

  getPois = (city: string, language: string): Promise<PoiModel[]> => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<PoiModel[]> = this.caches.pois
    return cache.get(context)
  }

  getLocalNews = (city: string, language: string): Promise<LocalNewsModel[]> => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<LocalNewsModel[]> = this.caches.localNews
    return cache.get(context)
  }

  getResourceCache = async (city: string, language: string): Promise<LanguageResourceCacheStateType> => {
    const context = new DatabaseContext(city)
    const cache: Cache<CityResourceCacheStateType> = this.caches.resourceCache
    const resourceCache = await cache.get(context)

    return resourceCache[language] ?? {}
  }

  getLastUpdate = (city: string, language: string): Promise<DateTime | null> => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<DateTime | null> = this.caches.lastUpdate
    return cache.get(context)
  }

  setCategoriesMap = async (city: string, language: string, categories: CategoriesMapModel): Promise<void> => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<CategoriesMapModel> = this.caches.categories
    await cache.cache(categories, context)
  }

  setPois = async (city: string, language: string, pois: PoiModel[]): Promise<void> => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<PoiModel[]> = this.caches.pois
    await cache.cache(pois, context)
  }

  setLocalNews = async (city: string, language: string, localNews: LocalNewsModel[]): Promise<void> => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<LocalNewsModel[]> = this.caches.localNews
    await cache.cache(localNews, context)
  }

  setCities = async (cities: CityModel[]): Promise<void> => {
    const cache = this.caches.cities
    await cache.cache(cities, new DatabaseContext())
  }

  setEvents = async (city: string, language: string, events: EventModel[]): Promise<void> => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<EventModel[]> = this.caches.events
    await cache.cache(events, context)
  }

  getFilePathsFromLanguageResourceCache(languageResourceCache: LanguageResourceCacheStateType): string[] {
    const pageResourceCaches: PageResourceCacheStateType[] = Object.values(languageResourceCache)
    return flatMap(pageResourceCaches, (file: PageResourceCacheStateType): string[] =>
      map(file, ({ filePath }) => filePath),
    )
  }

  setResourceCache = async (
    city: string,
    language: string,
    resourceCache: LanguageResourceCacheStateType,
  ): Promise<void> => {
    const context = new DatabaseContext(city)
    const cache: Cache<CityResourceCacheStateType> = this.caches.resourceCache
    const previousResourceCache = cache.getCached(context)

    if (!previousResourceCache) {
      await cache.cache(
        {
          [language]: resourceCache,
        },
        context,
      )
      return
    }

    const newResourceCache = { ...previousResourceCache, [language]: resourceCache }
    const previousLanguageResourceCache = previousResourceCache[language]

    if (previousLanguageResourceCache) {
      // Cleanup old resources
      const oldPaths = this.getFilePathsFromLanguageResourceCache(previousLanguageResourceCache)
      const newPaths = this.getFilePathsFromLanguageResourceCache(resourceCache)
      const removedPaths = difference(oldPaths, newPaths)

      if (!isEmpty(removedPaths)) {
        const otherLanguagesCollection: CityResourceCacheStateType = omitBy(
          previousResourceCache,
          (_val, key: string) => key === language,
        )
        const pathsOfOtherLanguages = flatMap(
          otherLanguagesCollection,
          (languageCache: LanguageResourceCacheStateType) => this.getFilePathsFromLanguageResourceCache(languageCache),
        )
        const pathsToClean = difference(removedPaths, pathsOfOtherLanguages)
        log('Cleaning up the following resources:')
        log(pathsToClean.join(', '))
        await Promise.all(pathsToClean.map(path => RNFS.unlink(path)))
      }
    }

    await cache.cache(newResourceCache, context)
  }

  setLastUpdate = async (city: string, language: string, lastUpdate: DateTime | null): Promise<void> => {
    const context = new DatabaseContext(city, language)
    const cache: Cache<DateTime | null> = this.caches.lastUpdate
    await cache.cache(lastUpdate, context)
  }

  poisAvailable = async (city: string, language: string): Promise<boolean> => {
    const context = new DatabaseContext(city, language)
    return this.isCached('pois', context) || this._databaseConnector.isPoisPersisted(context)
  }

  citiesAvailable = async (): Promise<boolean> => {
    const context = new DatabaseContext()
    return this.isCached('cities', context) || this._databaseConnector.isCitiesPersisted()
  }

  categoriesAvailable = async (city: string, language: string): Promise<boolean> => {
    const context = new DatabaseContext(city, language)
    return this.isCached('categories', context) || this._databaseConnector.isCategoriesPersisted(context)
  }

  eventsAvailable = async (city: string, language: string): Promise<boolean> => {
    const context = new DatabaseContext(city, language)
    return this.isCached('events', context) || this._databaseConnector.isEventsPersisted(context)
  }

  localNewsAvailable = async (city: string, language: string): Promise<boolean> => {
    const context = new DatabaseContext(city, language)
    return this.isCached('localNews', context) || this._databaseConnector.isLocalNewsPersisted(context)
  }

  storeLastUsage = async (city: string): Promise<void> => {
    await this._databaseConnector.storeLastUsage(new DatabaseContext(city))
  }
}

const dataContainer = new DefaultDataContainer()

export default dataContainer
