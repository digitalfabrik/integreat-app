// @flow

import { CategoriesMapModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import MemoryDatabaseContext from './MemoryDatabaseContext'
import type { ResourceCacheType } from './ResourceCacheType'

class MemoryDatabase {
  dataDirectory: string
  context: MemoryDatabaseContext

  _cities: Array<CityModel>
  _categoriesMap: CategoriesMapModel
  _languages: Array<LanguageModel>
  _categoriesResourceCache: ResourceCacheType
  _events: Array<EventModel>
  _eventsResourceCache: ResourceCacheType

  constructor (dataDirectory: string) {
    this.dataDirectory = dataDirectory
  }

  loadCities (cities: Array<CityModel>) {
    this._cities = cities
  }

  changeContext (
    context: MemoryDatabaseContext
  ) {
    this.context = context
    this._languages = null
    this._categoriesMap = null
    this._categoriesResourceCache = null
    this._eventsResourceCache = null
    this._events = null
  }

  hasContext (otherContext: MemoryDatabaseContext): boolean {
    return this.context &&
      this.context.languageCode === otherContext.languageCode &&
      this.context.cityCode === otherContext.cityCode
  }

  get cities (): Array<CityModel> {
    return this._cities
  }

  get categoriesMap (): CategoriesMapModel {
    return this._categoriesMap
  }

  set categoriesMap (categoriesMap: CategoriesMapModel) {
    if (this._categoriesMap !== null) {
      throw Error('categoriesMap has already been set on this context!')
    }
    this._categoriesMap = categoriesMap
  }

  get languages (): Array<LanguageModel> {
    return this._languages
  }

  set languages (languages: Array<LanguageModel>) {
    if (this._languages !== null) {
      throw Error('languages has already been set on this context!')
    }
    this._languages = languages
  }

  get categoriesResourceCache (): ResourceCacheType {
    return this._categoriesResourceCache
  }

  set categoriesResourceCache (resourceCache: ResourceCacheType) {
    if (this._categoriesResourceCache !== null) {
      throw Error('categoriesResourceCache has already been set on this context!')
    }
    this._categoriesResourceCache = resourceCache
  }

  get events (): Array<EventModel> {
    return this._events
  }

  set events (events: Array<EventModel>) {
    if (this._events !== null) {
      throw Error('events has already been set on this context!')
    }
    this._events = events
  }

  get eventsResourceCache (): ResourceCacheType {
    return this._eventsResourceCache
  }

  set eventsResourceCache (resourceCache: ResourceCacheType) {
    if (this._eventsResourceCache !== null) {
      throw Error('eventsResourceCache has already been set on this context!')
    }
    this._eventsResourceCache = resourceCache
  }
}

export default MemoryDatabase
