import { DateTime } from 'luxon'

import { CategoriesMapModel, RegionModel, EventModel, LocalNewsModel, PoiModel } from 'shared/api'

export type LanguageResourceCacheStateType = { [url: string]: string }
export type RegionResourceCacheStateType = { [languageCode: string]: LanguageResourceCacheStateType }

export type DataContainer = {
  /**
   * Returns an Array of PoiModels.
   * @throws Will throw an error if the array is null.
   */
  getPois: (region: string, language: string) => Promise<PoiModel[]>

  /**
   * Sets the pois and persist them ?
   */
  setPois: (region: string, language: string, pois: PoiModel[]) => Promise<void>

  /**
   * Returns an Array of RegionModels.
   * @throws Will throw an error if the array is null.
   */
  getRegions: () => Promise<RegionModel[]>

  /**
   * Sets the regions but does not persist them.
   * For now switching regions when offline is not possible.
   */
  setRegions: (regions: RegionModel[]) => Promise<void>

  /**
   * Returns the CategoriesMapModel.
   * @throws Will throw an error if the CategoriesMapModel is null.
   */
  getCategoriesMap: (region: string, language: string) => Promise<CategoriesMapModel>

  /**
   * Sets the categories and persists them.
   */
  setCategoriesMap: (region: string, language: string, categories: CategoriesMapModel) => Promise<void>

  /**
   * Returns an Array of events.
   * @throws Will throw an error if the array is null.
   */
  getEvents: (region: string, language: string) => Promise<EventModel[]>

  /**
   * Sets the events and persists them.
   */
  setEvents: (region: string, language: string, events: EventModel[]) => Promise<void>

  /**
   * Returns an Array of local news.
   * @throws Will throw an error if the array is null.
   */
  getLocalNews: (region: string, language: string) => Promise<LocalNewsModel[]>

  /**
   * Sets the local news and persists them.
   */
  setLocalNews: (region: string, language: string, events: LocalNewsModel[]) => Promise<void>

  /**
   * Returns the ResourceCache.
   * @throws Will throw an error if the ResourceCache is null.
   */
  getResourceCache: (region: string, language: string) => Promise<LanguageResourceCacheStateType>

  /**
   * Sets the cache entries for the current region-language-pair and cleans up unnecessary files.
   */
  setResourceCache: (region: string, language: string, resourceCache: LanguageResourceCacheStateType) => Promise<void>

  /**
   * Returns the lastUpdate timestamp..
   */
  getLastUpdate: (region: string, language: string) => Promise<DateTime | null>

  /**
   * Sets the lastUpdate timestamp and persists it.
   */
  setLastUpdate: (region: string, language: string, lastUpdate: DateTime) => Promise<void>

  /**
   * Returns whether the CategoriesMap has been loaded or not.
   */
  categoriesAvailable(region: string, language: string): Promise<boolean>

  /**
   * Returns whether the events have been loaded or not.
   */
  eventsAvailable(region: string, language: string): Promise<boolean>

  /**
   * Returns whether the pois have been loaded or not.
   */
  poisAvailable(region: string, language: string): Promise<boolean>

  /**
   * Returns whether the local news have been loaded or not.
   */
  localNewsAvailable(region: string, language: string): Promise<boolean>

  /**
   * Returns whether the regions have been loaded or not.
   */
  regionsAvailable(): Promise<boolean>

  /**
   * Stores the last usage of the passed region
   */
  storeLastUsage(region: string): Promise<void>

  /**
   * Deletes all pages and files that are stored offline in the filesystem
   */
  _clearOfflineCache(): Promise<void>

  /**
   * Deletes the resources and all content of a region
   */
  deleteRegion(region: string): Promise<void>

  /**
   * Clears all in-memory caches
   */
  clearInMemoryCache(): void
}
