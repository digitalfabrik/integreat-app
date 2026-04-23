import { difference, omitBy } from 'lodash'
import { DateTime } from 'luxon'

import { CategoriesMapModel, RegionModel, EventModel, LocalNewsModel, PoiModel } from 'shared/api'

import Cache from '../models/Cache'
import DatabaseContext from '../models/DatabaseContext'
import { RegionResourceCacheStateType, DataContainer, LanguageResourceCacheStateType } from './DataContainer'
import DatabaseConnector from './DatabaseConnector'
import { deleteIfExists } from './helpers'
import { log } from './sentry'

type CacheType = {
  pois: Cache<PoiModel[]>
  regions: Cache<RegionModel[]>
  events: Cache<EventModel[]>
  categories: Cache<CategoriesMapModel>
  localNews: Cache<LocalNewsModel[]>
  resourceCache: Cache<RegionResourceCacheStateType>
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
      regions: new Cache<RegionModel[]>(
        this._databaseConnector,
        (connector: DatabaseConnector) => connector.loadRegions(),
        (value: RegionModel[], connector: DatabaseConnector) => connector.storeRegions(value),
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
      resourceCache: new Cache<RegionResourceCacheStateType>(
        this._databaseConnector,
        (connector: DatabaseConnector, context: DatabaseContext) => connector.loadResourceCache(context),
        (value: RegionResourceCacheStateType, connector: DatabaseConnector, context: DatabaseContext) =>
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

  deleteRegion = async (region: string): Promise<void> => {
    await this._databaseConnector.deleteRegions([region])
  }

  // WARNING: Be careful using this method, it deletes ALL offline content, including metadata which may lead to inconsistent app states and break our offline functionality.
  _clearOfflineCache = async (): Promise<void> => {
    await this._databaseConnector.deleteAllFiles()
  }

  isCached(key: CacheKeyType, context: DatabaseContext): boolean {
    return this.caches[key].isCached(context)
  }

  getRegions = async (): Promise<RegionModel[]> => this.caches.regions.get(new DatabaseContext())

  getCategoriesMap = (region: string, language: string): Promise<CategoriesMapModel> =>
    this.caches.categories.get(new DatabaseContext(region, language))

  getEvents = (region: string, language: string): Promise<EventModel[]> =>
    this.caches.events.get(new DatabaseContext(region, language))

  getPois = (region: string, language: string): Promise<PoiModel[]> =>
    this.caches.pois.get(new DatabaseContext(region, language))

  getLocalNews = (region: string, language: string): Promise<LocalNewsModel[]> =>
    this.caches.localNews.get(new DatabaseContext(region, language))

  getResourceCache = async (region: string, language: string): Promise<LanguageResourceCacheStateType> => {
    const resourceCache = await this.caches.resourceCache.get(new DatabaseContext(region))
    return resourceCache[language] ?? {}
  }

  getLastUpdate = (region: string, language: string): Promise<DateTime | null> =>
    this.caches.lastUpdate.get(new DatabaseContext(region, language))

  setCategoriesMap = async (region: string, language: string, categories: CategoriesMapModel): Promise<void> => {
    await this.caches.categories.cache(categories, new DatabaseContext(region, language))
  }

  setPois = async (region: string, language: string, pois: PoiModel[]): Promise<void> => {
    await this.caches.pois.cache(pois, new DatabaseContext(region, language))
  }

  setLocalNews = async (region: string, language: string, localNews: LocalNewsModel[]): Promise<void> => {
    await this.caches.localNews.cache(localNews, new DatabaseContext(region, language))
  }

  setRegions = async (regions: RegionModel[]): Promise<void> => {
    await this.caches.regions.cache(regions, new DatabaseContext())
  }

  setEvents = async (region: string, language: string, events: EventModel[]): Promise<void> => {
    await this.caches.events.cache(events, new DatabaseContext(region, language))
  }

  setResourceCache = async (
    region: string,
    language: string,
    resourceCache: LanguageResourceCacheStateType,
  ): Promise<void> => {
    const context = new DatabaseContext(region)
    const previousResourceCache = this.caches.resourceCache.getCached(context)

    const newResourceCache = { ...(previousResourceCache ?? {}), [language]: resourceCache }
    await this.caches.resourceCache.cache(newResourceCache, context)

    const previousLanguageResourceCache = previousResourceCache?.[language]
    if (previousLanguageResourceCache) {
      // Cleanup old resources
      const oldPaths = Object.values(previousLanguageResourceCache)
      const newPaths = Object.values(resourceCache)
      const removedPaths = difference(oldPaths, newPaths)

      if (removedPaths.length > 0) {
        const otherLanguagesCollection: RegionResourceCacheStateType = omitBy(
          previousResourceCache,
          (_val, key: string) => key === language,
        )
        const pathsOfOtherLanguages: string[] = Object.values(otherLanguagesCollection).flatMap(Object.values)
        const pathsToClean = difference(removedPaths, pathsOfOtherLanguages)
        log('Cleaning up the following resources:')
        log(pathsToClean.join(', '))
        await Promise.all(pathsToClean.map(deleteIfExists))
      }
    }
  }

  setLastUpdate = async (region: string, language: string, lastUpdate: DateTime | null): Promise<void> => {
    const context = new DatabaseContext(region, language)
    await this.caches.lastUpdate.cache(lastUpdate, context)
  }

  poisAvailable = async (region: string, language: string): Promise<boolean> => {
    const context = new DatabaseContext(region, language)
    return this.isCached('pois', context) || this._databaseConnector.isPoisPersisted(context)
  }

  regionsAvailable = async (): Promise<boolean> => {
    const context = new DatabaseContext()
    return this.isCached('regions', context) || this._databaseConnector.isRegionsPersisted()
  }

  categoriesAvailable = async (region: string, language: string): Promise<boolean> => {
    const context = new DatabaseContext(region, language)
    return this.isCached('categories', context) || this._databaseConnector.isCategoriesPersisted(context)
  }

  eventsAvailable = async (region: string, language: string): Promise<boolean> => {
    const context = new DatabaseContext(region, language)
    return this.isCached('events', context) || this._databaseConnector.isEventsPersisted(context)
  }

  localNewsAvailable = async (region: string, language: string): Promise<boolean> => {
    const context = new DatabaseContext(region, language)
    return this.isCached('localNews', context) || this._databaseConnector.isLocalNewsPersisted(context)
  }

  storeLastUsage = async (region: string): Promise<void> => {
    await this._databaseConnector.storeLastUsage(new DatabaseContext(region))
  }
}

const dataContainer = new DefaultDataContainer()

export default dataContainer
