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
   * Changes the context to the supplied city-language combination and loads all corresponding persisted data if
   * existent. Initializes non persisted fields with null.
   * @param cityCode
   * @param languageCode
   */
  setContext: (cityCode: string, languageCode: string) => Promise<void>,



  hasContext: (cityCode: string, languageCode: string) => boolean,

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
  getCategories: () => Promise<CategoriesMapModel>,

  /**
   * Sets the categories and persists them.
   * @param categories
   */
  setCategories: (categories: CategoriesMapModel) => Promise<void>,

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
   * Returns whether the CategoriesMap has been loaded or not.
   */
  categoriesMapLoaded (): boolean,

  /**
   * Returns whether the languages have been loaded or not.
   */
  languagesLoaded (): boolean,

  /**
   * Returns whether the ResourceCache have been loaded or not.
   */
  resourceCacheLoaded (): boolean,

  /**
   * Returns whether the events have been loaded or not.
   */
  eventsLoaded (): boolean
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

  hasContext = (cityCode: string, languageCode: string) => {
    return this._context !== null && this._context._cityCode === cityCode && this._context.languageCode === languageCode
  }

  getCities = async (): Promise<Array<CityModel>> => {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    if (this._cities === null) {
      throw Error('CategoriesMap is null.')
    }
    return this._cities
  }

  getCategories = async (): Promise<CategoriesMapModel> => {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    if (this._categoriesMap === null) {
      throw Error('CategoriesMap is null.')
    }
    return this._categoriesMap
  }

  getEvents = async (): Promise<Array<EventModel>> => {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    if (this._events === null) {
      throw Error('CategoriesMap is null.')
    }
    return this._events
  }

  getLanguages = async (): Promise<Array<LanguageModel>> => {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    if (this._languages === null) {
      throw Error('CategoriesMap is null.')
    }
    return this._languages
  }

  getResourceCache = async (): Promise<ResourceCacheStateType> => {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    if (this._resourceCache === null) {
      throw Error('CategoriesMap is null.')
    }
    return this._resourceCache
  }

  setCategories = async (categories: CategoriesMapModel) => {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    await this._databaseConnector.storeCategories(categories, this._context)
    this._categoriesMap = categories
  }

  setCities = async (cities: Array<CityModel>) => {
    // TODO: Offline available cities will be persisted in NATIVE-175. For now switching cities when offline is not possible.
    this._cities = cities
  }

  setContext = async (cityCode: string, languageCode: string) => {
    if (this._context !== null && this._context._cityCode === cityCode && this._context.languageCode === languageCode) {
      return
    }

    this._context = new DatabaseContext(cityCode, languageCode)
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

  setEvents = async (events: Array<EventModel>) => {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    await this._databaseConnector.storeEvents(events, this._context)
    this._events = events
  }

  setLanguages = async (languages: Array<LanguageModel>) => {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    await this._databaseConnector.storeLanguages(languages, this._context)
    this._languages = languages
  }

  setResourceCache = async (resourceCache: ResourceCacheStateType) => {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    await this._databaseConnector.storeResourceCache(resourceCache, this._context)
    this._resourceCache = resourceCache
  }

  categoriesMapLoaded (): boolean {
    return this._categoriesMap === null
  }

  languagesLoaded (): boolean {
    return this._languages === null
  }

  eventsLoaded (): boolean {
    return this._events === null
  }

  resourceCacheLoaded (): boolean {
    return this._resourceCache === null
  }
}

export default DataContainer
