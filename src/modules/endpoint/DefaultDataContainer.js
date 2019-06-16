// @flow

import { CategoriesMapModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import DatabaseContext from './DatabaseContext'
import type { CityResourceCacheStateType, FileCacheStateType, LanguageResourceCacheStateType } from '../app/StateType'
import DatabaseConnector from './DatabaseConnector'
import type { DataContainer } from './DataContainer'
import type Moment from 'moment'
import { difference, flatMap, isEmpty, map, omitBy } from 'lodash'
import RNFetchBlob from 'rn-fetch-blob'

class DefaultDataContainer implements DataContainer {
  _databaseConnector: DatabaseConnector

  _currentContext: DatabaseContext | null
  _cities: Array<CityModel> | null

  _lastUpdate: Moment | null
  _categoriesMap: CategoriesMapModel | null
  _languages: Array<LanguageModel> | null
  _resourceCache: CityResourceCacheStateType | null
  _events: Array<EventModel> | null

  constructor () {
    this._databaseConnector = new DatabaseConnector()
  }

  removeOutdated (newContext: DatabaseContext) {
    if (this._currentContext && !newContext.equals(this._currentContext)) {
      this._lastUpdate = null
      this._categoriesMap = null
      this._resourceCache = null
      this._events = null
    }

    this._currentContext = newContext
  }

  getCities = async (): Promise<Array<CityModel>> => {
    if (this._cities === null) {
      throw Error('Cities are null.')
    }
    return this._cities
  }

  getCategoriesMap = async (context: DatabaseContext): Promise<CategoriesMapModel> => {
    this.removeOutdated(context)

    if (this._categoriesMap === null) {
      this._cities = await this._databaseConnector.loadCategories(context)
    }
    return this._categoriesMap
  }

  getEvents = async (context: DatabaseContext): Promise<Array<EventModel>> => {
    this.removeOutdated(context)

    if (this._events === null) {
      this._events = await this._databaseConnector.loadCategories(context)
    }
    return this._events
  }

  getLanguages = async (context: DatabaseContext): Promise<Array<LanguageModel>> => {
    this.removeOutdated(context)

    if (this._languages === null) {
      this._languages = await this._databaseConnector.loadLanguages(context)
    }
    return this._languages
  }

  getResourceCache = async (context: DatabaseContext): Promise<LanguageResourceCacheStateType> => {
    this.removeOutdated(context)

    if (this._resourceCache === null) {
      this._resourceCache = await this._databaseConnector.loadResourceCache(context)
    }
    if (!this._resourceCache[context.languageCode]) {
      throw Error('LanguageResourceCache is null.')
    }
    return this._resourceCache[context.languageCode]
  }

  getLastUpdate = async (context: DatabaseContext): Promise<Moment> => {
    if (this._lastUpdate === null) {
      this._lastUpdate = await this._databaseConnector.loadLastUpdate(context)
    }
    return this._lastUpdate
  }

  setCategoriesMap = async (context: DatabaseContext, categories: CategoriesMapModel) => {
    this.removeOutdated(context)

    await this._databaseConnector.storeCategories(categories, context)
    this._categoriesMap = categories
  }

  setCities = async (cities: Array<CityModel>) => {
    // TODO: Offline available cities will be persisted in NATIVE-175. For now switching cities when offline is not possible.
    this._cities = cities
  }

  setEvents = async (context: DatabaseContext, events: Array<EventModel>) => {
    this.removeOutdated(context)

    await this._databaseConnector.storeEvents(events, context)
    this._events = events
  }

  setLanguages = async (city: string, languages: Array<LanguageModel>) => {
    await this._databaseConnector.storeLanguages(languages, city)
    this._languages = languages
  }

  getFilePathsFromLanguageResourceCache (languageResourceCache: LanguageResourceCacheStateType): Array<string> {
    return flatMap(
      Object.values(languageResourceCache),
      (file: FileCacheStateType): Array<string> => map(file, ({filePath}) => filePath)
    )
  }

  setResourceCache = async (context: DatabaseContext, resourceCache: LanguageResourceCacheStateType) => {
    this.removeOutdated(context)

    const language = context.languageCode
    const newResourceCache = {...this._resourceCache, [language]: resourceCache}

    if (this._resourceCache && this._resourceCache[language]) {
      // Cleanup old resources
      const oldPaths = this.getFilePathsFromLanguageResourceCache(this._resourceCache[language])
      const newPaths = this.getFilePathsFromLanguageResourceCache(resourceCache)
      const removedPaths = difference(oldPaths, newPaths)
      if (!isEmpty(removedPaths)) {
        const pathsOfOtherLanguages = flatMap(
          omitBy(this._resourceCache, (val, key: string) => key === language),
          (languageCache: LanguageResourceCacheStateType) => this.getFilePathsFromLanguageResourceCache(languageCache)
        )
        const pathsToClean = difference(removedPaths, pathsOfOtherLanguages)
        console.debug('Cleaning up the following resources:')
        console.debug(pathsToClean)
        await Promise.all(pathsToClean.map(path => RNFetchBlob.fs.unlink(path)))
      }
    }

    await this._databaseConnector.storeResourceCache(newResourceCache, context)
    this._resourceCache = newResourceCache
  }

  setLastUpdate = async (context: DatabaseContext, lastUpdate: Moment) => {
    this.removeOutdated(context)

    await this._databaseConnector.storeLastUpdate(lastUpdate, context)
    this._lastUpdate = lastUpdate
  }

  categoriesAvailable (context: DatabaseContext): boolean {
    this.removeOutdated(context)

    return this._categoriesMap !== null
  }

  languagesAvailable (city: string): boolean {
    return this._languages !== null
  }

  eventsAvailable (context: DatabaseContext): boolean {
    this.removeOutdated(context)

    return this._events !== null
  }

  resourceCacheAvailable (context: DatabaseContext): boolean {
    this.removeOutdated(context)

    return this._resourceCache !== null
  }

  lastUpdateAvailable (context: DatabaseContext): boolean {
    this.removeOutdated(context)

    return this._lastUpdate !== null
  }
}

export default DefaultDataContainer
