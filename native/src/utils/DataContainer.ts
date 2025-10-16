import { DateTime } from 'luxon'

import { CategoriesMapModel, CityModel, EventModel, LocalNewsModel, PoiModel } from 'shared/api'

export type ResourceCacheEntryStateType = {
  filePath: string
  hash: string
}
export type LanguageResourceCacheStateType = Record<string, ResourceCacheEntryStateType>
export type CityResourceCacheStateType = Record<string, LanguageResourceCacheStateType>

export type DataContainer = {
  /**
   * Returns an Array of PoiModels.
   * @throws Will throw an error if the array is null.
   */
  getPois: (city: string, language: string) => Promise<PoiModel[]>

  /**
   * Sets the pois and persist them ?
   */
  setPois: (city: string, language: string, pois: PoiModel[]) => Promise<void>

  /**
   * Returns an Array of CityModels.
   * @throws Will throw an error if the array is null.
   */
  getCities: () => Promise<CityModel[]>

  /**
   * Sets the cities but does not persist them.
   * For now switching cities when offline is not possible.
   */
  setCities: (cities: CityModel[]) => Promise<void>

  /**
   * Returns the CategoriesMapModel.
   * @throws Will throw an error if the CategoriesMapModel is null.
   */
  getCategoriesMap: (city: string, language: string) => Promise<CategoriesMapModel>

  /**
   * Sets the categories and persists them.
   */
  setCategoriesMap: (city: string, language: string, categories: CategoriesMapModel) => Promise<void>

  /**
   * Returns an Array of events.
   * @throws Will throw an error if the array is null.
   */
  getEvents: (city: string, language: string) => Promise<EventModel[]>

  /**
   * Sets the events and persists them.
   */
  setEvents: (city: string, language: string, events: EventModel[]) => Promise<void>

  /**
   * Returns an Array of local news.
   * @throws Will throw an error if the array is null.
   */
  getLocalNews: (city: string, language: string) => Promise<LocalNewsModel[]>

  /**
   * Sets the local news and persists them.
   */
  setLocalNews: (city: string, language: string, events: LocalNewsModel[]) => Promise<void>

  /**
   * Returns the ResourceCache.
   * @throws Will throw an error if the ResourceCache is null.
   */
  getResourceCache: (city: string, language: string) => Promise<LanguageResourceCacheStateType>

  /**
   * Sets the cache entries for the current city-language-pair and cleans up unnecessary files.
   */
  setResourceCache: (city: string, language: string, resourceCache: LanguageResourceCacheStateType) => Promise<void>

  /**
   * Returns the lastUpdate timestamp..
   */
  getLastUpdate: (city: string, language: string) => Promise<DateTime | null>

  /**
   * Sets the lastUpdate timestamp and persists it.
   */
  setLastUpdate: (city: string, language: string, lastUpdate: DateTime) => Promise<void>

  /**
   * Returns whether the CategoriesMap has been loaded or not.
   */
  categoriesAvailable(city: string, language: string): Promise<boolean>

  /**
   * Returns whether the events have been loaded or not.
   */
  eventsAvailable(city: string, language: string): Promise<boolean>

  /**
   * Returns whether the pois have been loaded or not.
   */
  poisAvailable(city: string, language: string): Promise<boolean>

  /**
   * Returns whether the local news have been loaded or not.
   */
  localNewsAvailable(city: string, language: string): Promise<boolean>

  /**
   * Returns whether the cities have been loaded or not.
   */
  citiesAvailable(): Promise<boolean>

  /**
   * Stores the last usage of the passed city
   */
  storeLastUsage(city: string): Promise<void>

  /**
   * Deletes all pages and files that are stored offline in the filesystem
   */
  _clearOfflineCache(): Promise<void>

  /**
   * Deletes the resources and all content of a city
   */
  deleteCity(city: string): Promise<void>

  /**
   * Clears all in-memory caches
   */
  clearInMemoryCache(): void
}
