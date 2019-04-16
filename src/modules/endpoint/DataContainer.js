// @flow

import {
  CategoriesMapModel,
  CityModel, EventModel,
  LanguageModel
} from '@integreat-app/integreat-api-client'
import DatabaseContext from './DatabaseContext'
import type { ResourceCacheStateType } from '../app/StateType'
import DatabaseConnector from './DatabaseConnector'

interface DataContainerInterface {
  /**
   * Changes the _context to the supplied city-language combination and loads all corresponding persisted data if
   * existent. Initializes non persisted fields with null.
   * @param cityCode
   * @param language
   */
  setContext (cityCode: string, language: string): Promise<void>,

  /**
   * Returns an Array of CityModels or null if none are persisted.
   */
  getCities (): Promise<Array<CityModel> | null>,

  /**
   * Sets the cities but does not persist them.
   * TODO: Offline available cities will be persisted in NATIVE-175. For now switching cities when offline is not possible.
   * @param cities
   */
  setCities (cities: Array<CityModel>): Promise<void>,

  /**
   * Returns an Array of LanguageModels or null if none are persisted.
   */
  getLanguages (): Promise<Array<LanguageModel> | null>,

  /**
   * Sets the languages and persists them.
   * @param languages
   */
  setLanguages (languages: Array<LanguageModel>): Promise<void>,

  /**
   * Returns the CategoriesMapModel or null if none is persisted
   */
  getCategories (): Promise<CategoriesMapModel | null>,

  /**
   * Sets the categories and persists them.
   * @param categories
   */
  setCategories (categories: CategoriesMapModel): Promise<void>,

  /**
   * Returns the events or null if none are persisted.
   */
  getEvents (): Promise<Array<EventModel> | null>,

  /**
   * Sets the events and persists them.
   * @param events
   */
  setEvents (events: Array<EventModel>): Promise<void>,

  /**
   * Returns the ResourceCache or null if none is persisted.
   */
  getResourceCache (): Promise<ResourceCacheStateType | null>,

  /**
   * Sets the ResourceCache and persists it.
   * @param resourceCache
   */
  setResourceCache (resourceCache: ResourceCacheStateType): Promise<void>
}

class DataContainer implements DataContainerInterface {
  _databaseConnector: DatabaseConnector
  _context: DatabaseContext | null = null

  _cities: Array<CityModel>
  _categoriesMap: CategoriesMapModel | null
  _languages: Array<LanguageModel> | null
  _resourceCache: ResourceCacheStateType | null
  _events: Array<EventModel> | null

  constructor () {
    this._databaseConnector = new DatabaseConnector()
  }

  async getCategories (): Promise<CategoriesMapModel | null> {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    return this._categoriesMap
  }

  async getCities (): Promise<Array<CityModel> | null> {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    return this._cities
  }

  async getEvents (): Promise<Array<EventModel> | null> {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    return this._events
  }

  async getLanguages (): Promise<Array<LanguageModel> | null> {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    return this._languages
  }

  async getResourceCache (): Promise<ResourceCacheStateType | null> {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    return this._resourceCache
  }

  async setCategories (categories: CategoriesMapModel) {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    await this._databaseConnector.storeCategories(categories, this._context)
    this._categoriesMap = categories
  }

  async setCities (cities: Array<CityModel>) {
    // TODO: Offline available cities will be persisted in NATIVE-175. For now switching cities when offline is not possible.
    this._cities = cities
  }

  async setContext (cityCode: string, language: string) {
    this._context = new DatabaseContext(cityCode, language)
    const context = this._context

    const [events, categoriesMap, languages, resourceCache] = await Promise.all([
      this._databaseConnector.loadEvents(context),
      this._databaseConnector.loadCategories(context),
      this._databaseConnector.loadLanguages(context),
      this._databaseConnector.loadResourceCache(context)])

    this._events = events
    this._categoriesMap = categoriesMap
    this._languages = languages
    this._resourceCache = resourceCache
  }

  async setEvents (events: Array<EventModel>) {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    await this._databaseConnector.storeEvents(events, this._context)
    this._events = events
  }

  async setLanguages (languages: Array<LanguageModel>) {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    await this._databaseConnector.storeLanguages(languages, this._context)
    this._languages = languages
  }

  async setResourceCache (resourceCache: ResourceCacheStateType) {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    await this._databaseConnector.storeResourceCache(resourceCache, this._context)
    this._resourceCache = resourceCache
  }
}

export default DataContainer
