// @flow

import {
  CategoriesMapModel,
  CityModel, EventModel,
  LanguageModel
} from '@integreat-app/integreat-api-client'
import DatabaseContext from './DatabaseContext'
import type { ResourceCacheStateType } from '../app/StateType'
import DatabaseConnector from './DatabaseConnector'
import type { DataContainer } from './DataContainer'
import type Moment from 'moment'

class DefaultDataContainer implements DataContainer {
  _databaseConnector: DatabaseConnector
  _context: DatabaseContext | null = null

  _lastUpdate: Moment | null
  _cities: Array<CityModel> | null
  _categoriesMap: CategoriesMapModel | null
  _languages: Array<LanguageModel> | null
  _resourceCache: ResourceCacheStateType | null
  _events: Array<EventModel> | null

  constructor () {
    this._databaseConnector = new DatabaseConnector()
  }

  getCities = async (): Promise<Array<CityModel>> => {
    if (this._cities === null) {
      throw Error('Cities are null.')
    }
    return this._cities
  }

  getCategoriesMap = async (): Promise<CategoriesMapModel> => {
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
      throw Error('Events are null.')
    }
    return this._events
  }

  getLanguages = async (): Promise<Array<LanguageModel>> => {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    if (this._languages === null) {
      throw Error('Languages are null.')
    }
    return this._languages
  }

  getResourceCache = async (): Promise<ResourceCacheStateType> => {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    if (this._resourceCache === null) {
      throw Error('ResourceCache is null.')
    }
    return this._resourceCache
  }

  getLastUpdate = async (): Promise<Moment> => {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    if (this._lastUpdate === null) {
      throw Error('LastUpdate is null.')
    }
    return this._lastUpdate
  }

  setCategoriesMap = async (categories: CategoriesMapModel) => {
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

    const [events, categoriesMap, languages, resourceCache, lastUpdate] = await Promise.all([
      this._databaseConnector.loadEvents(context),
      this._databaseConnector.loadCategories(context),
      this._databaseConnector.loadLanguages(context),
      this._databaseConnector.loadResourceCache(context),
      this._databaseConnector.loadLastUpdate(context)
    ])

    this._events = events
    this._categoriesMap = categoriesMap
    this._languages = languages
    this._resourceCache = resourceCache
    this._lastUpdate = lastUpdate
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

  addResourceCacheEntries = async (resourceCache: ResourceCacheStateType) => {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    const newResourceCache = {...resourceCache, ...this._resourceCache}
    await this._databaseConnector.storeResourceCache(resourceCache, this._context)
    this._resourceCache = newResourceCache
  }

  setLastUpdate = async (lastUpdate: Moment) => {
    if (this._context === null) {
      throw Error('Context has not been set yet.')
    }
    await this._databaseConnector.storeLastUpdate(lastUpdate, this._context)
    this._lastUpdate = lastUpdate
  }

  categoriesAvailable (): boolean {
    return this._categoriesMap !== null
  }

  languagesAvailable (): boolean {
    return this._languages !== null
  }

  eventsAvailable (): boolean {
    return this._events !== null
  }

  resourceCacheAvailable (): boolean {
    return this._resourceCache !== null
  }

  lastUpdateAvailable (): boolean {
    return this._lastUpdate !== null
  }
}

export default DefaultDataContainer
