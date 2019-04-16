// @flow

import {
  CategoriesMapModel,
  CategoryModel,
  CityModel, DateModel,
  EventModel,
  LanguageModel, LocationModel
} from '@integreat-app/integreat-api-client'
import MemoryDatabaseContext from './MemoryDatabaseContext'
import type { ResourceCacheStateType } from '../app/StateType'
import RNFetchblob from 'rn-fetch-blob'
import {
  CONTENT_DIR_PATH, getResourceCacheFilesPath
} from '../platform/constants/webview'
import moment from 'moment'

type ContentCategoryJsonType = {|
  root: string,
  path: string,
  title: string,
  content: string,
  last_update: string,
  thumbnail: string,
  available_languages: { [code: string]: string },
  parent_path: string,
  children: Array<string>,
  order: number,
  hash: string
|}

type ContentEventJsonType = {|
  path: string,
  title: string,
  content: string,
  last_update: string,
  thumbnail: string,
  available_languages: { [code: string]: string },
  hash: string,
  excerpt: string,
  date: {|
    start_date: string,
    end_date: string,
    all_day: boolean
  |},
  location: {|
    address: string,
    town: string,
    postcode: ?string,
    latitude: ?string,
    longitude: ?string
  |}
|}

type ResourceCacheJsonType = ResourceCacheStateType

const mapToObject = (map: Map<string, string>) => {
  const output = {}
  map.forEach((value, key) => { output[key] = value })
  return output
}

interface DataContainer {
  /**
   * Changes the context to the supplied city-language combination and loads all corresponding persisted data if
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
   * TODO Offline available cities will be persisted in NATIVE-175. For now switching cities when offline is not possible.
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

class MemoryDatabase {
  context: MemoryDatabaseContext

  _cities: Array<CityModel>
  _categoriesMap: ?CategoriesMapModel
  _languages: Array<LanguageModel> | null
  _resourceCache: ResourceCacheStateType | null
  _events: ?Array<EventModel> | null

  loadCities (cities: Array<CityModel>) {
    this._cities = cities
  }

  changeContext (
    context: MemoryDatabaseContext
  ) {
    this.context = context
    this._languages = null
    this._categoriesMap = null
    this._resourceCache = null
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
    if (this._categoriesMap === null) {
      throw Error('categories are null!')
    }
    return this._categoriesMap
  }

  set categoriesMap (categoriesMap: CategoriesMapModel) {
    if (this._categoriesMap !== null) {
      throw Error('categoriesMap has already been set on this context!')
    }
    this._categoriesMap = categoriesMap
  }

  get languages (): Array<LanguageModel> {
    if (this._languages === null) {
      throw Error('languages are null!')
    }
    return this._languages
  }

  set languages (languages: Array<LanguageModel>) {
    if (this._languages !== null) {
      throw Error('languages have already been set on this context!')
    }
    this._languages = languages
  }

  get events (): Array<EventModel> {
    if (!this._events) {
      throw Error('events are null!')
    }
    return this._events
  }

  set events (events: Array<EventModel>) {
    if (this._events !== null) {
      throw Error('events have already been set on this context!')
    }
    this._events = events
  }

  addCacheEntries (resourceCache: ResourceCacheStateType) {
    if (this._resourceCache === null) {
      throw Error('resourceCache has not been initialized in this context.')
    }
    this._resourceCache = {...this._resourceCache, ...resourceCache}
  }

  get resourceCache (): ResourceCacheStateType {
    if (this._resourceCache === null) {
      throw Error('resourceCache is null!')
    }
    return this._resourceCache
  }

  getContentPath (key: string): string {
    if (!key) {
      throw Error('Key mustn\'t be empty')
    }

    return `${CONTENT_DIR_PATH}/${this.context.cityCode}/${this.context.languageCode}/${key}.json`
  }

  getResourceCachePath (): string {
    return getResourceCacheFilesPath(this.context.cityCode)
  }

  categoriesLoaded = () => this._categoriesMap !== null
  languagesLoaded = () => this._languages !== null
  eventsLoaded = () => this._events !== null

  writeCategories = async () => {
    if (this.categoriesMap === null) {
      throw Error('MemoryDatabase does not have data to save!')
    }

    const categoryModels = this.categoriesMap.toArray()

    const jsonModels = categoryModels.map((category: CategoryModel): ContentCategoryJsonType => ({
      root: category.isRoot(),
      path: category.path,
      title: category.title,
      content: category.content,
      last_update: category.lastUpdate.toISOString(),
      thumbnail: category.thumbnail,
      available_languages: mapToObject(category.availableLanguages),
      parent_path: category.parentPath,
      children: this.categoriesMap.getChildren(category).map(category => category.path),
      order: category.order,
      hash: category.hash
    }))

    await this.writeFile(this.getContentPath('categories'), JSON.stringify(jsonModels))
  }

  readCategories = async () => {
    const path = this.getContentPath('categories')
    const fileExists: boolean = await RNFetchblob.fs.exists(path)

    if (!fileExists) {
      this._categoriesMap = null
      return
    }

    const json = JSON.parse(await this.readFile(path))

    this._categoriesMap = new CategoriesMapModel(json.map((jsonObject: ContentCategoryJsonType) => {
      return new CategoryModel({
        root: jsonObject.root,
        path: jsonObject.path,
        title: jsonObject.title,
        content: jsonObject.content,
        thumbnail: jsonObject.thumbnail,
        parentPath: jsonObject.parent_path,
        order: jsonObject.order,
        availableLanguages: new Map(Object.entries(jsonObject.available_languages)),
        lastUpdate: moment(jsonObject.last_update, moment.ISO_8601),
        hash: jsonObject.hash
      })
    }))
  }

  readLanguages = async () => {
    const path = this.getContentPath('languages')
    const fileExists: boolean = await RNFetchblob.fs.exists(path)

    if (!fileExists) {
      this._languages = null
      return
    }

    const languages = JSON.parse(await this.readFile(path))
    this._languages = languages.map(language => new LanguageModel(language._code, language._name))
  }

  writeLanguages = async () => {
    if (this._languages === null) {
      throw Error('MemoryDatabase does not have data to save!')
    }
    const path = this.getContentPath('languages')
    await this.writeFile(path, JSON.stringify(this._languages))
  }

  writeEvents = async () => {
    if (this._events === null) {
      throw Error('MemoryDatabase does not have data to save!')
    }
    const jsonModels = this.events.map((event: EventModel): ContentEventJsonType => ({
      path: event.path,
      title: event.title,
      content: event.content,
      last_update: event.lastUpdate.toISOString(),
      thumbnail: event.thumbnail,
      available_languages: mapToObject(event.availableLanguages),
      hash: event.hash,
      excerpt: event.excerpt,
      date: {
        start_date: event.date.startDate.toISOString(),
        end_date: event.date.endDate.toISOString(),
        all_day: event.date.allDay
      },
      location: {
        address: event.location.address,
        town: event.location.town,
        postcode: event.location.postcode,
        latitude: event.location.latitude,
        longitude: event.location.longitude
      }
    }))

    await this.writeFile(this.getContentPath('events'), JSON.stringify(jsonModels))
  }

  readEvents = async () => {
    const path = this.getContentPath('events')
    const fileExists: boolean = await RNFetchblob.fs.exists(path)

    if (!fileExists) {
      this._events = null
      return
    }

    const json = JSON.parse(await this.readFile(path))

    this._events = json.map((jsonObject: ContentEventJsonType) => {
      const jsonDate = jsonObject.date
      const jsonLocation = jsonObject.location
      return new EventModel({
        path: jsonObject.path,
        title: jsonObject.title,
        content: jsonObject.content,
        thumbnail: jsonObject.thumbnail,
        availableLanguages: new Map(Object.entries(jsonObject.available_languages)),
        lastUpdate: moment(jsonObject.last_update, moment.ISO_8601),
        hash: jsonObject.hash,
        excerpt: jsonObject.excerpt,
        date: new DateModel({
          startDate: moment(jsonDate.start_date, moment.ISO_8601),
          endDate: moment(jsonDate.end_date, moment.ISO_8601),
          allDay: jsonDate.all_day
        }),
        location: new LocationModel({
          address: jsonLocation.address,
          latitude: jsonLocation.latitude,
          longitude: jsonLocation.longitude,
          postcode: jsonLocation.postcode,
          town: jsonLocation.town
        })
      })
    })
  }

  readResourceCache = async () => {
    const path = this.getResourceCachePath()
    const fileExists: boolean = await RNFetchblob.fs.exists(path)

    if (!fileExists) {
      this._resourceCache = {}
      return
    }

    this._resourceCache = JSON.parse(await this.readFile(path))
  }

  writeResourceCache = async () => {
    if (this._resourceCache === null) {
      throw Error('MemoryDatabase does not have data to save!')
    }

    const path = this.getResourceCachePath()
    // todo: use ResourceCacheJsonType

    // $FlowFixMe Resource cache will never be null here. Also this will probably soon be dealt with when mapping.
    const json: ResourceCacheJsonType = this._resourceCache
    await this.writeFile(path, JSON.stringify(json))
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
