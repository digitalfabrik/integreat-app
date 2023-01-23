/* eslint-disable camelcase */
import { BBox } from 'geojson'
import { map, mapValues } from 'lodash'
import moment, { Moment } from 'moment'
import BlobUtil from 'react-native-blob-util'

import {
  CategoriesMapModel,
  CategoryModel,
  CityModel,
  DateModel,
  EventModel,
  FeaturedImageModel,
  LanguageModel,
  LocationModel,
  OpeningHoursModel,
  PoiModel,
} from 'api-client'

import DatabaseContext from '../models/DatabaseContext'
import {
  CityResourceCacheStateType,
  LanguageResourceCacheStateType,
  PageResourceCacheEntryStateType,
  PageResourceCacheStateType,
} from '../redux/StateType'
import { deleteIfExists } from './helpers'
import { log } from './sentry'

export const CONTENT_VERSION = 'v1'
export const RESOURCE_CACHE_VERSION = 'v1'

// Our pdf view can only load from DocumentDir. Therefore we need to use that
export const CACHE_DIR_PATH = BlobUtil.fs.dirs.DocumentDir
export const CONTENT_DIR_PATH = `${CACHE_DIR_PATH}/content/${CONTENT_VERSION}`
export const RESOURCE_CACHE_DIR_PATH = `${CACHE_DIR_PATH}/resource-cache/${RESOURCE_CACHE_VERSION}`
const MAX_STORED_CITIES = 3

type ContentCategoryJsonType = {
  root: boolean
  path: string
  title: string
  content: string
  last_update: string
  thumbnail: string
  available_languages: Record<string, string>
  parent_path: string
  children: Array<string>
  order: number
}
type LocationJsonType<T> = {
  id: number
  address: string
  town: string
  postcode: string
  latitude: T
  longitude: T
  country: string
  name: string
}
type FeaturedImageInstanceJsonType = {
  url: string
  width: number
  height: number
}
type FeaturedImageJsonType = {
  description: string | null | undefined
  thumbnail: FeaturedImageInstanceJsonType
  medium: FeaturedImageInstanceJsonType
  large: FeaturedImageInstanceJsonType
  full: FeaturedImageInstanceJsonType
}
type ContentEventJsonType = {
  path: string
  title: string
  content: string
  last_update: string
  thumbnail: string
  available_languages: Record<string, string>
  excerpt: string
  date: {
    start_date: string
    end_date: string
    all_day: boolean
  }
  location: LocationJsonType<number | null> | null
  featured_image: FeaturedImageJsonType | null | undefined
}
type ContentCityJsonType = {
  name: string
  live: boolean
  code: string
  prefix: string | null | undefined
  extras_enabled: boolean
  events_enabled: boolean
  pois_enabled: boolean
  sorting_name: string
  longitude: number
  latitude: number
  aliases: Record<string, { longitude: number; latitude: number }> | null
  pushNotificationsEnabled: boolean
  tunewsEnabled: boolean
  bounding_box: BBox | null
}
type ContentPoiJsonType = {
  path: string
  title: string
  content: string
  thumbnail: string
  website: string | null
  phoneNumber: string | null
  email: string | null
  availableLanguages: Record<string, string>
  excerpt: string
  location: LocationJsonType<number>
  lastUpdate: string
  openingHours: OpeningHoursModel[] | null
  temporarilyClosed: boolean
}
type CityCodeType = string
type LanguageCodeType = string
type MetaCitiesEntryType = {
  languages: Record<
    LanguageCodeType,
    {
      lastUpdate: Moment
    }
  >
  lastUsage: Moment
}
type MetaCitiesJsonType = Record<
  CityCodeType,
  {
    languages: Record<
      LanguageCodeType,
      {
        last_update: string
      }
    >
    last_usage: string
  }
>
type CityLastUsageType = {
  city: CityCodeType
  lastUsage: Moment
}
type MetaCitiesType = Record<CityCodeType, MetaCitiesEntryType>
type PageResourceCacheEntryJsonType = {
  file_path: string
  last_update: string
  hash: string
}
type PageResourceCacheJsonType = Record<string, PageResourceCacheEntryJsonType>
type LanguageResourceCacheJsonType = Record<string, PageResourceCacheJsonType>
type CityResourceCacheJsonType = Record<LanguageCodeType, LanguageResourceCacheJsonType>

const mapToObject = (map: Map<string, string>) => {
  const output: Record<string, string> = {}
  map.forEach((value, key) => {
    output[key] = value
  })
  return output
}

class DatabaseConnector {
  getContentPath(key: string, context: DatabaseContext): string {
    if (!key) {
      throw Error("Key mustn't be empty")
    } else if (!context.cityCode) {
      throw Error("cityCode mustn't be empty")
    }

    if (!context.languageCode) {
      return `${CONTENT_DIR_PATH}/${context.cityCode}/${key}.json`
    }

    return `${CONTENT_DIR_PATH}/${context.cityCode}/${context.languageCode}/${key}.json`
  }

  getResourceCachePath(context: DatabaseContext): string {
    if (!context.cityCode) {
      throw Error("cityCode mustn't be empty")
    }

    return `${RESOURCE_CACHE_DIR_PATH}/${context.cityCode}/files.json`
  }

  getMetaCitiesPath(): string {
    return `${CACHE_DIR_PATH}/cities-meta.json`
  }

  getCitiesPath(): string {
    return `${CACHE_DIR_PATH}/cities.json`
  }

  async deleteAllFiles(): Promise<void> {
    await BlobUtil.fs.unlink(CACHE_DIR_PATH)
  }

  /**
   * Prior to storing lastUpdate, there needs to be a lastUsage of the city.
   */
  async storeLastUpdate(lastUpdate: Moment | null, context: DatabaseContext): Promise<void> {
    if (lastUpdate === null) {
      throw Error('cannot set lastUsage to null')
    }

    const { cityCode, languageCode } = context

    if (!cityCode) {
      throw Error("cityCode mustn't be empty")
    } else if (!languageCode) {
      throw Error("languageCode mustn't be empty")
    }

    const metaData = await this._loadMetaCities()
    const cityMetaData = metaData[cityCode]

    if (!cityMetaData) {
      log(`Did not find city '${cityCode}' im metaData '${JSON.stringify(metaData)}'`, 'warning')
      throw Error('cannot store last update for unused city')
    }

    cityMetaData.languages[languageCode] = {
      lastUpdate,
    }

    this._storeMetaCities(metaData)
  }

  async _deleteMetaOfCities(cities: Array<string>): Promise<void> {
    const metaCities = await this._loadMetaCities()
    cities.forEach(city => delete metaCities[city])
    await this._storeMetaCities(metaCities)
  }

  async loadLastUpdate(context: DatabaseContext): Promise<Moment | null> {
    const { cityCode } = context
    const { languageCode } = context

    if (!cityCode) {
      throw new Error('City is not set in DatabaseContext!')
    } else if (!languageCode) {
      throw new Error('Language is not set in DatabaseContext!')
    }

    const metaData = await this._loadMetaCities()
    return metaData[cityCode]?.languages[languageCode]?.lastUpdate || null
  }

  async _loadMetaCities(): Promise<MetaCitiesType> {
    const path = this.getMetaCitiesPath()
    const fileExists = await BlobUtil.fs.exists(path)

    if (!fileExists) {
      return {}
    }

    const citiesMetaJson = await this.readFile<MetaCitiesJsonType>(path)
    return mapValues(citiesMetaJson, cityMeta => ({
      languages: mapValues(
        cityMeta.languages,
        ({
          last_update: jsonLastUpdate,
        }): {
          lastUpdate: Moment
        } => ({
          lastUpdate: moment(jsonLastUpdate, moment.ISO_8601),
        })
      ),
      lastUsage: moment(cityMeta.last_usage, moment.ISO_8601),
    }))
  }

  async _storeMetaCities(metaCities: MetaCitiesType): Promise<void> {
    const path = this.getMetaCitiesPath()
    const citiesMetaJson: MetaCitiesJsonType = mapValues(metaCities, cityMeta => ({
      languages: mapValues(
        cityMeta.languages,
        ({
          lastUpdate,
        }): {
          last_update: string
        } => ({
          last_update: lastUpdate.toISOString(),
        })
      ),
      last_usage: cityMeta.lastUsage.toISOString(),
    }))
    await this.writeFile(path, JSON.stringify(citiesMetaJson))
  }

  async loadLastUsages(): Promise<Array<CityLastUsageType>> {
    const metaData = await this._loadMetaCities()
    return map<MetaCitiesType, CityLastUsageType>(metaData, (value, key) => ({
      city: key,
      lastUsage: value.lastUsage,
    }))
  }

  async storeLastUsage(context: DatabaseContext): Promise<void> {
    const city = context.cityCode

    if (!city) {
      throw Error("cityCode mustn't be null")
    }

    const metaData = await this._loadMetaCities().catch(() => ({} as MetaCitiesType))
    metaData[city] = {
      lastUsage: moment(),
      languages: metaData[city]?.languages || {},
    }
    await this._storeMetaCities(metaData)
    await this.deleteOldFiles(context)
  }

  async storeCategories(categoriesMap: CategoriesMapModel, context: DatabaseContext): Promise<void> {
    const categoryModels = categoriesMap.toArray()
    const jsonModels = categoryModels.map(
      (category: CategoryModel): ContentCategoryJsonType => ({
        root: category.isRoot(),
        path: category.path,
        title: category.title,
        content: category.content,
        last_update: category.lastUpdate.toISOString(),
        thumbnail: category.thumbnail,
        available_languages: mapToObject(category.availableLanguages),
        parent_path: category.parentPath,
        children: categoriesMap.getChildren(category).map(category => category.path),
        order: category.order,
      })
    )
    await this.writeFile(this.getContentPath('categories', context), JSON.stringify(jsonModels))
  }

  async loadCategories(context: DatabaseContext): Promise<CategoriesMapModel> {
    const path = this.getContentPath('categories', context)
    const fileExists: boolean = await BlobUtil.fs.exists(path)

    if (!fileExists) {
      throw Error(`File ${path} does not exist`)
    }

    const json = await this.readFile<ContentCategoryJsonType[]>(path)
    return new CategoriesMapModel(
      json.map(jsonObject => {
        const availableLanguages = new Map<string, string>(Object.entries(jsonObject.available_languages))
        return new CategoryModel({
          root: jsonObject.root,
          path: jsonObject.path,
          title: jsonObject.title,
          content: jsonObject.content,
          thumbnail: jsonObject.thumbnail,
          parentPath: jsonObject.parent_path,
          order: jsonObject.order,
          availableLanguages,
          lastUpdate: moment(jsonObject.last_update, moment.ISO_8601),
        })
      })
    )
  }

  async loadLanguages(context: DatabaseContext): Promise<Array<LanguageModel>> {
    const path = this.getContentPath('languages', context)
    const fileExists: boolean = await BlobUtil.fs.exists(path)

    if (!fileExists) {
      throw Error(`File ${path} does not exist`)
    }

    const languages = await this.readFile<LanguageModel[]>(path)
    return languages.map(language => new LanguageModel(language._code, language._name))
  }

  async storeLanguages(languages: Array<LanguageModel>, context: DatabaseContext): Promise<void> {
    const path = this.getContentPath('languages', context)
    await this.writeFile(path, JSON.stringify(languages))
  }

  async storePois(pois: Array<PoiModel>, context: DatabaseContext): Promise<void> {
    const jsonModels = pois.map(
      (poi: PoiModel): ContentPoiJsonType => ({
        path: poi.path,
        title: poi.title,
        content: poi.content,
        thumbnail: poi.thumbnail,
        availableLanguages: mapToObject(poi.availableLanguages),
        excerpt: poi.excerpt,
        website: poi.website,
        phoneNumber: poi.phoneNumber,
        email: poi.email,
        location: {
          id: poi.location.id,
          address: poi.location.address,
          town: poi.location.town,
          postcode: poi.location.postcode,
          latitude: poi.location.latitude,
          longitude: poi.location.longitude,
          country: poi.location.country,
          name: poi.location.name,
        },
        lastUpdate: poi.lastUpdate.toISOString(),
        openingHours: poi.openingHours,
        temporarilyClosed: poi.temporarilyClosed,
      })
    )
    await this.writeFile(this.getContentPath('pois', context), JSON.stringify(jsonModels))
  }

  async loadPois(context: DatabaseContext): Promise<Array<PoiModel>> {
    const path = this.getContentPath('pois', context)
    const fileExists: boolean = await BlobUtil.fs.exists(path)

    if (!fileExists) {
      throw Error(`File ${path} does not exist`)
    }

    const json = await this.readFile<ContentPoiJsonType[]>(path)
    return json.map(jsonObject => {
      const jsonLocation = jsonObject.location
      const availableLanguages = new Map<string, string>(Object.entries(jsonObject.availableLanguages))
      return new PoiModel({
        path: jsonObject.path,
        title: jsonObject.title,
        content: jsonObject.content,
        thumbnail: jsonObject.thumbnail,
        availableLanguages,
        excerpt: jsonObject.excerpt,
        website: jsonObject.website,
        phoneNumber: jsonObject.phoneNumber,
        email: jsonObject.email,
        location: new LocationModel({
          id: jsonLocation.id,
          name: jsonLocation.name,
          country: jsonLocation.country,
          address: jsonLocation.address,
          latitude: jsonLocation.latitude,
          longitude: jsonLocation.longitude,
          postcode: jsonLocation.postcode,
          town: jsonLocation.town,
        }),
        lastUpdate: moment(jsonObject.lastUpdate, moment.ISO_8601),
        openingHours: jsonObject.openingHours,
        temporarilyClosed: true,
      })
    })
  }

  async storeCities(cities: Array<CityModel>): Promise<void> {
    const jsonModels = cities.map(
      (city: CityModel): ContentCityJsonType => ({
        name: city.name,
        live: city.live,
        code: city.code,
        prefix: city.prefix,
        extras_enabled: city.offersEnabled,
        events_enabled: city.eventsEnabled,
        pois_enabled: city.poisEnabled,
        pushNotificationsEnabled: city.localNewsEnabled,
        tunewsEnabled: city.tunewsEnabled,
        sorting_name: city.sortingName,
        longitude: city.longitude,
        latitude: city.latitude,
        aliases: city.aliases,
        bounding_box: city.boundingBox,
      })
    )
    await this.writeFile(this.getCitiesPath(), JSON.stringify(jsonModels))
  }

  async loadCities(): Promise<Array<CityModel>> {
    const path = this.getCitiesPath()
    const fileExists: boolean = await BlobUtil.fs.exists(path)

    if (!fileExists) {
      throw Error(`File ${path} does not exist`)
    }

    const json = await this.readFile<ContentCityJsonType[]>(path)
    return json.map(
      jsonObject =>
        new CityModel({
          name: jsonObject.name,
          code: jsonObject.code,
          live: jsonObject.live,
          eventsEnabled: jsonObject.events_enabled,
          localNewsEnabled: jsonObject.pushNotificationsEnabled,
          tunewsEnabled: jsonObject.tunewsEnabled,
          offersEnabled: jsonObject.extras_enabled,
          poisEnabled: jsonObject.pois_enabled,
          sortingName: jsonObject.sorting_name,
          prefix: jsonObject.prefix,
          longitude: jsonObject.longitude,
          latitude: jsonObject.latitude,
          aliases: jsonObject.aliases,
          boundingBox: jsonObject.bounding_box ?? null,
        })
    )
  }

  async storeEvents(events: Array<EventModel>, context: DatabaseContext): Promise<void> {
    const jsonModels = events.map(
      (event: EventModel): ContentEventJsonType => ({
        path: event.path,
        title: event.title,
        content: event.content,
        last_update: event.lastUpdate.toISOString(),
        thumbnail: event.thumbnail,
        available_languages: mapToObject(event.availableLanguages),
        excerpt: event.excerpt,
        date: {
          start_date: event.date.startDate.toISOString(),
          end_date: event.date.endDate.toISOString(),
          all_day: event.date.allDay,
        },
        location: event.location
          ? {
              id: event.location.id,
              address: event.location.address,
              town: event.location.town,
              postcode: event.location.postcode,
              latitude: event.location.latitude,
              longitude: event.location.longitude,
              country: event.location.country,
              name: event.location.name,
            }
          : null,
        featured_image: event.featuredImage
          ? {
              description: event.featuredImage.description,
              thumbnail: event.featuredImage.thumbnail,
              medium: event.featuredImage.medium,
              large: event.featuredImage.large,
              full: event.featuredImage.full,
            }
          : null,
      })
    )
    await this.writeFile(this.getContentPath('events', context), JSON.stringify(jsonModels))
  }

  async loadEvents(context: DatabaseContext): Promise<Array<EventModel>> {
    const path = this.getContentPath('events', context)
    const fileExists: boolean = await BlobUtil.fs.exists(path)

    if (!fileExists) {
      throw Error(`File ${path} does not exist`)
    }

    const json = await this.readFile<ContentEventJsonType[]>(path)
    return json.map(jsonObject => {
      const jsonDate = jsonObject.date
      const availableLanguages = new Map<string, string>(Object.entries(jsonObject.available_languages))
      return new EventModel({
        path: jsonObject.path,
        title: jsonObject.title,
        content: jsonObject.content,
        thumbnail: jsonObject.thumbnail,
        featuredImage: jsonObject.featured_image
          ? new FeaturedImageModel({
              description: jsonObject.featured_image.description,
              thumbnail: jsonObject.featured_image.thumbnail,
              medium: jsonObject.featured_image.medium,
              large: jsonObject.featured_image.large,
              full: jsonObject.featured_image.full,
            })
          : null,
        availableLanguages,
        lastUpdate: moment(jsonObject.last_update, moment.ISO_8601),
        excerpt: jsonObject.excerpt,
        date: new DateModel({
          startDate: moment(jsonDate.start_date, moment.ISO_8601),
          endDate: moment(jsonDate.end_date, moment.ISO_8601),
          allDay: jsonDate.all_day,
        }),
        location: jsonObject.location?.id
          ? new LocationModel({
              id: jsonObject.location.id,
              name: jsonObject.location.name,
              country: jsonObject.location.country,
              address: jsonObject.location.address,
              latitude: jsonObject.location.latitude,
              longitude: jsonObject.location.longitude,
              postcode: jsonObject.location.postcode,
              town: jsonObject.location.town,
            })
          : null,
      })
    })
  }

  async loadResourceCache(context: DatabaseContext): Promise<CityResourceCacheStateType> {
    const path = this.getResourceCachePath(context)
    const fileExists: boolean = await BlobUtil.fs.exists(path)

    if (!fileExists) {
      return {}
    }

    const json = await this.readFile<CityResourceCacheJsonType>(path)
    return mapValues(json, languageResourceCache =>
      mapValues(languageResourceCache, (fileResourceCache: PageResourceCacheJsonType) =>
        mapValues(
          fileResourceCache,
          (entry: PageResourceCacheEntryJsonType): PageResourceCacheEntryStateType => ({
            filePath: entry.file_path,
            lastUpdate: moment(entry.last_update, moment.ISO_8601),
            hash: entry.hash,
          })
        )
      )
    )
  }

  async storeResourceCache(resourceCache: CityResourceCacheStateType, context: DatabaseContext): Promise<void> {
    const path = this.getResourceCachePath(context)
    const json: CityResourceCacheJsonType = mapValues(
      resourceCache,
      (languageResourceCache: LanguageResourceCacheStateType) =>
        mapValues(languageResourceCache, (fileResourceCache: PageResourceCacheStateType) =>
          mapValues(
            fileResourceCache,
            (entry: PageResourceCacheEntryStateType): PageResourceCacheEntryJsonType => ({
              file_path: entry.filePath,
              last_update: entry.lastUpdate.toISOString(),
              hash: entry.hash,
            })
          )
        )
    )
    await this.writeFile(path, JSON.stringify(json))
  }

  /**
   * Deletes the resource caches and files of all but the latest used cities
   * @return {Promise<void>}
   */
  async deleteOldFiles(context: DatabaseContext): Promise<void> {
    const city = context.cityCode

    if (!city) {
      throw Error("cityCode mustn't be null")
    }

    const lastUsages = await this.loadLastUsages()
    const cachesToDelete = lastUsages
      .filter(it => it.city !== city) // Sort last usages chronological, from oldest to newest
      .sort((a, b) => {
        if (a.lastUsage.isBefore(b.lastUsage)) {
          return -1
        }
        return a.lastUsage.isSame(b.lastUsage) ? 0 : 1
      }) // We only have to remove MAX_STORED_CITIES - 1 since we already filtered for the current resource cache
      .slice(0, -(MAX_STORED_CITIES - 1))
    await Promise.all(
      cachesToDelete.map(cityLastUpdate => {
        const { city } = cityLastUpdate
        log(`Deleting content and resource cache of city '${city}'`)
        const cityResourceCachePath = `${RESOURCE_CACHE_DIR_PATH}/${city}`
        const cityContentPath = `${CONTENT_DIR_PATH}/${city}`
        return Promise.all([deleteIfExists(cityResourceCachePath), deleteIfExists(cityContentPath)])
      })
    )
    await this._deleteMetaOfCities(cachesToDelete.map(it => it.city))
  }

  isPoisPersisted(context: DatabaseContext): Promise<boolean> {
    return this._isPersisted(this.getContentPath('pois', context))
  }

  isCitiesPersisted(): Promise<boolean> {
    return this._isPersisted(this.getCitiesPath())
  }

  isCategoriesPersisted(context: DatabaseContext): Promise<boolean> {
    return this._isPersisted(this.getContentPath('categories', context))
  }

  isLanguagesPersisted(context: DatabaseContext): Promise<boolean> {
    return this._isPersisted(this.getContentPath('languages', context))
  }

  isEventsPersisted(context: DatabaseContext): Promise<boolean> {
    return this._isPersisted(this.getContentPath('events', context))
  }

  _isPersisted(path: string): Promise<boolean> {
    return BlobUtil.fs.exists(path)
  }

  async readFile<T>(path: string, isRetry = false): Promise<T> {
    const jsonString: number[] | string = await BlobUtil.fs.readFile(path, 'utf8')

    try {
      if (typeof jsonString !== 'string') {
        throw new Error('readFile did not return a string')
      }

      return JSON.parse(jsonString)
    } catch (e) {
      if (!isRetry) {
        log(`An error occurred while trying to parse json '${jsonString}' from path '${path}', retrying.`, 'warning')
        return this.readFile(path, true)
      }
      log(`An error occurred while trying to parse json '${jsonString}' from path '${path}'`, 'warning')
      await deleteIfExists(path)
      throw e
    }
  }

  async writeFile(path: string, data: string): Promise<void> {
    return BlobUtil.fs.writeFile(path, data, 'utf8')
  }
}

export default DatabaseConnector
