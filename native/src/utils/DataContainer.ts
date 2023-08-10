import { Moment } from 'moment'

import { CategoriesMapModel, CityModel, EventModel, PoiModel } from 'api-client'

export type PageResourceCacheEntryStateType = {
  filePath: string
  lastUpdate: Moment
  hash: string
}
export type PageResourceCacheStateType = Record<string, PageResourceCacheEntryStateType>
export type LanguageResourceCacheStateType = Record<string, PageResourceCacheStateType>
export type CityResourceCacheStateType = Record<string, LanguageResourceCacheStateType>

export type DataContainer = {
  /**
   * Returns an Array of PoiModels.
   * @throws Will throw an error if the array is null.
   */
  getPois: (city: string, language: string) => Promise<Array<PoiModel>>

  /**
   * Sets the pois and persist them ?
   */
  setPois: (city: string, language: string, pois: Array<PoiModel>) => Promise<void>

  /**
   * Returns an Array of CityModels.
   * @throws Will throw an error if the array is null.
   */
  getCities: () => Promise<Array<CityModel>>

  /**
   * Sets the cities but does not persist them.
   * For now switching cities when offline is not possible.
   */
  setCities: (cities: Array<CityModel>) => Promise<void>

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
  getEvents: (city: string, language: string) => Promise<Array<EventModel>>

  /**
   * Sets the events and persists them.
   */
  setEvents: (city: string, language: string, events: Array<EventModel>) => Promise<void>

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
  getLastUpdate: (city: string, language: string) => Promise<Moment | null>

  /**
   * Sets the lastUpdate timestamp and persists it.
   */
  setLastUpdate: (city: string, language: string, lastUpdate: Moment) => Promise<void>

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
