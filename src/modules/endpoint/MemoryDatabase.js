// @flow

import { CategoriesMapModel, CategoryModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import MemoryDatabaseContext from './MemoryDatabaseContext'
import type { ResourceCacheStateType } from '../app/StateType'
import RNFetchblob from 'rn-fetch-blob'
import { OFFLINE_CACHE_PATH } from '../platform/constants/webview.ios'
import moment from 'moment'
import type { ResourceCacheType } from './ResourceCacheType'

type ContentCategoryJsonType = {|
  path: string,
  title: string,
  'content': string,
  'last_update': string,
  'thumbnail': string,
  'available_languages': { [code: string]: string },
  'parent_path': string,
  'children': Array<string>,
  'order': number,
  'hash': '' // TODO: This gets added in NATIVE-133
|}


const mapToObject = (map: Map<string, string>) => {
  const output = {}
  map.forEach((value, key) => { output[key] = value })
  return output
}

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

  getContentPath (key: string): string {
    if (!key) {
      throw Error('Key mustn\'t be empty')
    }

    return `${OFFLINE_CACHE_PATH}/content/${this.context.cityCode}/${this.context.languageCode}/${key}.json`
  }

  getResourceCachePath (): string {
    return `${OFFLINE_CACHE_PATH}/resource-cache/${this.context.cityCode}/files.json`
  }

  /**
   * @returns {Promise<void>} which resolves to the number of bytes written or rejects
   */
  writeCategories (): Promise<number> {
    if (!this.categoriesMap) {
      throw new Error('MemoryDatabase does not have data to save!')
    }

    const categoryModels = this.categoriesMap.toArray()

    const jsonModels = categoryModels.map((category: CategoryModel): ContentCategoryJsonType => ({
      'path': category.path,
      'title': category.title,
      'content': category.title,
      'last_update': category.lastUpdate.toISOString(),
      'thumbnail': category.thumbnail,
      'available_languages': mapToObject(category.availableLanguages),
      'parent_path': category.parentPath,
      'children': this.categoriesMap.getChildren(category).map(category => category.path),
      'order': category.order,
      'hash': '' // TODO: This gets added in NATIVE-133
    }))

    const path = `${OFFLINE_CACHE_PATH}/content/${this.context.cityCode}/categories.json`
    return this.writeFile(path, JSON.stringify(jsonModels))
  }

  async readCategories () {
    const path = this.getContentPath('categories')
    const fileExists: boolean = await RNFetchblob.fs.exists(path)

    if (!fileExists) {
      this._categoriesMap = new CategoriesMapModel()
      return
    }

    const json = JSON.parse(await this.readFile(path))

    this._categoriesMap = new CategoriesMapModel(json.map((jsonObject: ContentCategoryJsonType) => {
      return new CategoryModel({
        // We do not use as we do not need it in the react-native app
        id: 0,
        path: jsonObject.path,
        title: jsonObject.title,
        content: jsonObject.content,
        thumbnail: jsonObject.thumbnail,
        parentPath: jsonObject.parent_path,
        order: jsonObject.order,
        availableLanguages: new Map(Object.entries(jsonObject.available_languages)),
        lastUpdate: moment(jsonObject.last_update, moment.ISO_8601)
      })
    }))
  }

  async readResourceCache () {
    const path = this.getResourceCachePath()
    const fileExists: boolean = await RNFetchblob.fs.exists(path)

    if (!fileExists) {
      this._resourceCache = {}
      return
    }

    this._resourceCache = JSON.parse(await this.readFile(path))
  }

  async writeResourceCache (): Promise<number> {
    if (!this.resourceCache) {
      throw new Error('MemoryDatabase does not have data to save!')
    }

    const path = this.getResourceCachePath()

    return this.writeFile(path, JSON.stringify(this._resourceCache))
  }

  async readFile (path: string): Promise<string> {
    const jsonString: number[] | string = await RNFetchblob.fs.readFile(path, 'utf8')

    if (typeof jsonString !== 'string') {
      throw new Error('readFile did not return a string')
    }

    return jsonString
  }

  async writeFile (path: string, data: string): Promise<number> {
    return RNFetchblob.fs.writeFile(path, data, 'utf8')
  }
}

export default MemoryDatabase
