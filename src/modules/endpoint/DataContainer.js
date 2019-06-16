// @flow

import { CategoriesMapModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { LanguageResourceCacheStateType } from '../app/StateType'
import type Moment from 'moment'
import DatabaseContext from './DatabaseContext'

export interface DataContainer {

  /**
   * Returns an Array of CityModels.
   * @throws Will throw an error if the array is null.
   */
  getCities: (context: DatabaseContext) => Promise<Array<CityModel>>,

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
  getLanguages: (context: DatabaseContext) => Promise<Array<LanguageModel>>,

  /**
   * Sets the languages and persists them.
   * @param languages
   */
  setLanguages: (city: string, languages: Array<LanguageModel>) => Promise<void>,

  /**
   * Returns the CategoriesMapModel.
   * @throws Will throw an error if the CategoriesMapModel is null.
   */
  getCategoriesMap: (context: DatabaseContext) => Promise<CategoriesMapModel>,

  /**
   * Sets the categories and persists them.
   * @param categories
   */
  setCategoriesMap: (context: DatabaseContext, categories: CategoriesMapModel) => Promise<void>,

  /**
   * Returns an Array of events.
   * @throws Will throw an error if the array is null.
   */
  getEvents: (context: DatabaseContext) => Promise<Array<EventModel>>,

  /**
   * Sets the events and persists them.
   * @param events
   */
  setEvents: (context: DatabaseContext, events: Array<EventModel>) => Promise<void>,

  /**
   * Returns the ResourceCache.
   * @throws Will throw an error if the ResourceCache is null.
   */
  getResourceCache: (context: DatabaseContext) => Promise<LanguageResourceCacheStateType>,

  /**
   * Sets the cache entries for the current city-language-pair and cleans up unnecessary files.
   * @param resourceCache
   */
  setResourceCache: (context: DatabaseContext, resourceCache: LanguageResourceCacheStateType) => Promise<void>,

  /**
   * Returns the lastUpdate timestamp..
   */
  getLastUpdate: (context: DatabaseContext) => Promise<Moment>,

  /**
   * Sets the lastUpdate timestamp and persists it.
   * @param lastUpdate
   */
  setLastUpdate: (context: DatabaseContext, lastUpdate: Moment) => Promise<void>,

  /**
   * Returns whether the CategoriesMap has been loaded or not.
   */
  categoriesAvailable (context: DatabaseContext): boolean,

  /**
   * Returns whether the languages have been loaded or not.
   */
  languagesAvailable (city: string): boolean,

  /**
   * Returns whether the ResourceCache have been loaded or not.
   */
  resourceCacheAvailable (context: DatabaseContext): boolean,

  /**
   * Returns whether the events have been loaded or not.
   */
  eventsAvailable (context: DatabaseContext): boolean,

  /**
   * Returns whether a lastUpdate timestamp has been loaded or not.
   */
  lastUpdateAvailable (context: DatabaseContext): boolean
}
