// @flow

import { CategoriesMapModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { ResourceCacheStateType } from '../app/StateType'

export interface DataContainer {
  /**
   * Changes the context to the supplied city-language combination and loads all corresponding persisted data if
   * existent. Initializes non persisted fields with null.
   * @param cityCode
   * @param languageCode
   */
  setContext: (cityCode: string, languageCode: string) => Promise<void>,

  /**
   * Returns an Array of CityModels.
   * @throws Will throw an error if the array is null.
   */
  getCities: () => Promise<Array<CityModel>>,

  /**
   * Sets the cities but does not persist them.
   * TODO: Offline available cities will be persisted in NATIVE-175. For now switching cities when offline is not possible.
   * @param cities
   */
  setCities: (cities: Array<CityModel>) => Promise<void>,

  /**
   * Returns an Array of LanguageModels.
   * @throws Will throw an error if the array is null.
   */
  getLanguages: () => Promise<Array<LanguageModel>>,

  /**
   * Sets the languages and persists them.
   * @param languages
   */
  setLanguages: (languages: Array<LanguageModel>) => Promise<void>,

  /**
   * Returns the CategoriesMapModel.
   * @throws Will throw an error if the CategoriesMapModel is null.
   */
  getCategoriesMap: () => Promise<CategoriesMapModel>,

  /**
   * Sets the categories and persists them.
   * @param categories
   */
  setCategoriesMap: (categories: CategoriesMapModel) => Promise<void>,

  /**
   * Returns an Array of events.
   * @throws Will throw an error if the array is null.
   */
  getEvents: () => Promise<Array<EventModel>>,

  /**
   * Sets the events and persists them.
   * @param events
   */
  setEvents: (events: Array<EventModel>) => Promise<void>,

  /**
   * Returns the ResourceCache.
   * @throws Will throw an error if the ResourceCache is null.
   */
  getResourceCache: () => Promise<ResourceCacheStateType>,

  /**
   * Sets the ResourceCache and persists it.
   * @param resourceCache
   */
  setResourceCache: (resourceCache: ResourceCacheStateType) => Promise<void>,

  /**
   * Add cache entries to the existing ResourceCache and persists it.
   * @param resourceCache
   */
  addResourceCacheEntries: (resourceCache: ResourceCacheStateType) => Promise<void>,

  /**
   * Returns whether the CategoriesMap has been loaded or not.
   */
  categoriesAvailable (): boolean,

  /**
   * Returns whether the languages have been loaded or not.
   */
  languagesAvailable (): boolean,

  /**
   * Returns whether the ResourceCache have been loaded or not.
   */
  resourceCacheAvailable (): boolean,

  /**
   * Returns whether the events have been loaded or not.
   */
  eventsAvailable (): boolean
}
