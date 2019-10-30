// @flow

import { CategoriesMapModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { CityResourceCacheStateType } from '../app/StateType'
import type Moment from 'moment'

export interface DataContainer {

  /**
   * Returns an Array of CityModels.
   * @throws Will throw an error if the array is null.
   */
  getCities: () => Promise<Array<CityModel>>,

  /**
   * Sets the cities but does not persist them.
   * TODO: Offline available cities will be persisted in NATIVE-175. For now switching cities when offline is not possible.
   */
  setCities: (cities: Array<CityModel>) => Promise<void>,

  /**
   * Returns an Array of LanguageModels.
   * @throws Will throw an error if the array is null.
   */
  getLanguages: (city: string) => Promise<Array<LanguageModel>>,

  /**
   * Sets the languages and persists them.
   */
  setLanguages: (city: string, languages: Array<LanguageModel>) => Promise<void>,

  /**
   * Returns the CategoriesMapModel.
   * @throws Will throw an error if the CategoriesMapModel is null.
   */
  getCategoriesMap: (city: string, language: string) => Promise<CategoriesMapModel>,

  /**
   * Sets the categories and persists them.
   */
  setCategoriesMap: (city: string, language: string, categories: CategoriesMapModel) => Promise<void>,

  /**
   * Returns an Array of events.
   * @throws Will throw an error if the array is null.
   */
  getEvents: (city: string, language: string) => Promise<Array<EventModel>>,

  /**
   * Sets the events and persists them.
   */
  setEvents: (city: string, language: string, events: Array<EventModel>) => Promise<void>,

  /**
   * Returns the ResourceCache.
   * @throws Will throw an error if the ResourceCache is null.
   */
  getResourceCache: (city: string, language: string) => Promise<CityResourceCacheStateType>,

  /**
   * Sets the cache entries for the current city-language-pair and cleans up unnecessary files.
   */
  setResourceCache: (city: string, language: string, resourceCache: CityResourceCacheStateType) => Promise<void>,

  /**
   * Returns the lastUpdate timestamp..
   */
  getLastUpdate: (city: string, language: string) => Promise<Moment | null>,

  /**
   * Sets the lastUpdate timestamp and persists it.
   */
  setLastUpdate: (city: string, language: string, lastUpdate: Moment) => Promise<void>,

  /**
   * Returns whether the CategoriesMap has been loaded or not.
   */
  categoriesAvailable (city: string, language: string): Promise<boolean>,

  /**
   * Returns whether the languages have been loaded or not.
   */
  languagesAvailable (city: string): Promise<boolean>,

  /**
   * Returns whether the events have been loaded or not.
   */
  eventsAvailable (city: string, language: string): Promise<boolean>,

  /**
   * Returns whether the cities have been loaded or not.
   */
  citiesAvailable (): Promise<boolean>
}
