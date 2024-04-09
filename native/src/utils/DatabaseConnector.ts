import { BBox } from 'geojson'
import { map, mapValues } from 'lodash'
import { DateTime } from 'luxon'
import BlobUtil from 'react-native-blob-util'
import { rrulestr } from 'rrule'

import {
  CategoriesMapModel,
  CategoryModel,
  CityModel,
  DateModel,
  EventModel,
  FeaturedImageModel,
  LanguageModel,
  LocalNewsModel,
  LocationModel,
  OpeningHoursModel,
  PoiModel,
  PoiCategoryModel,
  OrganizationModel,
  OfferModel,
  createPostMap,
} from 'shared/api'

import DatabaseContext from '../models/DatabaseContext'
import {
  CityResourceCacheStateType,
  LanguageResourceCacheStateType,
  PageResourceCacheEntryStateType,
  PageResourceCacheStateType,
} from './DataContainer'
import { deleteIfExists } from './helpers'
import { log, reportError } from './sentry'

export const CONTENT_VERSION = 'v6'
export const RESOURCE_CACHE_VERSION = 'v1'

// Our pdf view can only load from DocumentDir. Therefore we need to use that
export const CACHE_DIR_PATH = BlobUtil.fs.dirs.DocumentDir
export const UNVERSIONED_CONTENT_DIR_PATH = `${CACHE_DIR_PATH}/content`
// Offline saved content like categories, events and pois
export const CONTENT_DIR_PATH = `${UNVERSIONED_CONTENT_DIR_PATH}/${CONTENT_VERSION}`
export const UNVERSIONED_RESOURCE_CACHE_DIR_PATH = `${CACHE_DIR_PATH}/resource-cache`
// Offline saved resources like pictures and pdf documents
export const RESOURCE_CACHE_DIR_PATH = `${UNVERSIONED_RESOURCE_CACHE_DIR_PATH}/${RESOURCE_CACHE_VERSION}`

const MAX_STORED_CITIES = 3

type ContentCategoryJsonType = {
  root: boolean
  path: string
  title: string
  content: string
  last_update: string
  thumbnail: string | null
  available_languages: Record<string, string>
  parent_path: string
  children: Array<string>
  order: number
  organization: {
    name: string
    logo: string
    url: string
  } | null
  embedded_offers: OfferJsonType[]
}

type OfferJsonType = {
  alias: string
  title: string
  path: string
  thumbnail: string
  post: Record<string, string> | null
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
  thumbnail: string | null
  available_languages: Record<string, string>
  excerpt: string
  date: {
    start_date: string
    end_date: string
    all_day: boolean
    recurrence_rule: string | null
  }
  location: LocationJsonType<number | null> | null
  featured_image: FeaturedImageJsonType | null | undefined
}
type ContentLanguageJsonType = {
  code: string
  name: string
}
type ContentCityJsonType = {
  name: string
  live: boolean
  code: string
  languages: ContentLanguageJsonType[]
  prefix: string | null
  extras_enabled: boolean
  events_enabled: boolean
  pois_enabled: boolean
  sorting_name: string
  longitude: number
  latitude: number
  aliases: Record<string, { longitude: number; latitude: number }> | null
  pushNotificationsEnabled: boolean
  tunewsEnabled: boolean
  bounding_box: BBox
}
type ContentPoiJsonType = {
  path: string
  title: string
  content: string
  thumbnail: string | null
  website: string | null
  phoneNumber: string | null
  email: string | null
  availableLanguages: Record<string, string>
  excerpt: string
  location: LocationJsonType<number>
  lastUpdate: string
  category: { id: number; name: string; color: string; icon: string; iconName: string }
  openingHours: { allDay: boolean; closed: boolean; timeSlots: { start: string; end: string }[] }[] | null
  temporarilyClosed: boolean
}
type ContentLocalNewsJsonType = {
  id: number
  timestamp: string
  title: string
  content: string
}
type CityCodeType = string
type LanguageCodeType = string
type MetaCitiesEntryType = {
  languages: Record<
    LanguageCodeType,
    {
      lastUpdate: DateTime
    }
  >
  lastUsage: DateTime
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
  lastUsage: DateTime
}
type MetaCitiesType = Record<CityCodeType, MetaCitiesEntryType>
type PageResourceCacheEntryJsonType = {
  file_path: string
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
  constructor() {
    this.migrationRoutine().catch(reportError)
  }

  async migrationRoutine(): Promise<void> {
    const contentDirExists = await BlobUtil.fs.isDir(CONTENT_DIR_PATH)
    const baseContentDirExists = await BlobUtil.fs.isDir(UNVERSIONED_CONTENT_DIR_PATH)
    const resourceCacheDirExists = await BlobUtil.fs.isDir(RESOURCE_CACHE_DIR_PATH)
    const baseResourceCacheDirExists = await BlobUtil.fs.isDir(UNVERSIONED_RESOURCE_CACHE_DIR_PATH)

    // Delete old content if version is upgraded (if the base dir exists but the current content doesn't, the old content is still there)
    if (!contentDirExists && baseContentDirExists) {
      await BlobUtil.fs.unlink(UNVERSIONED_CONTENT_DIR_PATH)
    }

    // Delete old resource cache if version is upgraded (if the base dir exists but the current resource cache doesn't, the old resource cache is still there)
    if (!resourceCacheDirExists && baseResourceCacheDirExists) {
      await BlobUtil.fs.unlink(UNVERSIONED_RESOURCE_CACHE_DIR_PATH)
    }
  }

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

  async storeLastUpdate(lastUpdate: DateTime | null, context: DatabaseContext): Promise<void> {
    if (lastUpdate === null) {
      // Prior to storing lastUpdate, there needs to be a lastUsage of the city.
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

  async loadLastUpdate(context: DatabaseContext): Promise<DateTime | null> {
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

    const mapCitiesMetaJson = (json: MetaCitiesJsonType) =>
      mapValues(json, cityMeta => ({
        languages: mapValues(
          cityMeta.languages,
          ({
            last_update: jsonLastUpdate,
          }): {
            lastUpdate: DateTime
          } => ({
            lastUpdate: DateTime.fromISO(jsonLastUpdate),
          }),
        ),
        lastUsage: DateTime.fromISO(cityMeta.last_usage),
      }))
    return this.readFile(path, mapCitiesMetaJson)
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
          last_update: lastUpdate.toISO(),
        }),
      ),
      last_usage: cityMeta.lastUsage.toISO(),
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

    const metaData = await this._loadMetaCities().catch(() => ({}) as MetaCitiesType)
    metaData[city] = {
      lastUsage: DateTime.now(),
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
        last_update: category.lastUpdate.toISO(),
        thumbnail: category.thumbnail,
        available_languages: mapToObject(category.availableLanguages),
        parent_path: category.parentPath,
        children: categoriesMap.getChildren(category).map(category => category.path),
        order: category.order,
        organization: category.organization
          ? {
              name: category.organization.name,
              logo: category.organization.logo,
              url: category.organization.url,
            }
          : null,
        embedded_offers: category.embeddedOffers.map(offer => ({
          title: offer.title,
          alias: offer.alias,
          thumbnail: offer.thumbnail,
          path: offer.path,
          post: offer.postData ? Object.fromEntries(offer.postData) : null,
        })),
      }),
    )
    await this.writeFile(this.getContentPath('categories', context), JSON.stringify(jsonModels))
  }

  async loadCategories(context: DatabaseContext): Promise<CategoriesMapModel> {
    const path = this.getContentPath('categories', context)
    const mapCategoriesJson = (json: ContentCategoryJsonType[]) =>
      new CategoriesMapModel(
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
            lastUpdate: DateTime.fromISO(jsonObject.last_update),
            organization: jsonObject.organization
              ? new OrganizationModel({
                  name: jsonObject.organization.name,
                  logo: jsonObject.organization.logo,
                  url: jsonObject.organization.url,
                })
              : null,
            embeddedOffers: jsonObject.embedded_offers.map(
              jsonOffer =>
                new OfferModel({
                  title: jsonOffer.title,
                  alias: jsonOffer.alias,
                  thumbnail: jsonOffer.thumbnail,
                  path: jsonOffer.path,
                  postData: jsonOffer.post ? createPostMap(jsonOffer.post) : undefined,
                }),
            ),
          })
        }),
      )

    return this.readFile(path, mapCategoriesJson)
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
        lastUpdate: poi.lastUpdate.toISO(),
        category: {
          id: poi.category.id,
          name: poi.category.name,
          icon: poi.category.icon,
          iconName: poi.category.iconName,
          color: poi.category.color,
        },
        openingHours:
          poi.openingHours?.map(hours => ({
            allDay: hours.allDay,
            closed: hours.closed,
            timeSlots: hours.timeSlots.map(timeslot => ({
              start: timeslot.start,
              end: timeslot.end,
            })),
          })) ?? null,
        temporarilyClosed: poi.temporarilyClosed,
      }),
    )
    await this.writeFile(this.getContentPath('pois', context), JSON.stringify(jsonModels))
  }

  async loadPois(context: DatabaseContext): Promise<Array<PoiModel>> {
    const path = this.getContentPath('pois', context)
    const mapPoisJson = (json: ContentPoiJsonType[]) =>
      json.map(jsonObject => {
        const jsonLocation = jsonObject.location
        const availableLanguages = new Map<string, string>(Object.entries(jsonObject.availableLanguages))
        return new PoiModel({
          path: jsonObject.path,
          title: jsonObject.title,
          content: jsonObject.content,
          thumbnail: jsonObject.thumbnail,
          availableLanguages,
          metaDescription: null, // not used in native
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
          lastUpdate: DateTime.fromISO(jsonObject.lastUpdate),
          category: new PoiCategoryModel({
            id: jsonObject.category.id,
            name: jsonObject.category.name,
            color: jsonObject.category.color,
            icon: jsonObject.category.icon,
            iconName: jsonObject.category.iconName,
          }),
          openingHours:
            jsonObject.openingHours?.map(
              hours =>
                new OpeningHoursModel({
                  allDay: hours.allDay,
                  closed: hours.closed,
                  timeSlots: hours.timeSlots.map(timeslot => ({
                    start: timeslot.start,
                    end: timeslot.end,
                  })),
                }),
            ) ?? null,
          temporarilyClosed: jsonObject.temporarilyClosed,
        })
      })

    return this.readFile(path, mapPoisJson)
  }

  async storeLocalNews(localNews: LocalNewsModel[], context: DatabaseContext): Promise<void> {
    const jsonModels = localNews.map(
      (it: LocalNewsModel): ContentLocalNewsJsonType => ({
        id: it.id,
        timestamp: it.timestamp.toISO(),
        title: it.title,
        content: it.content,
      }),
    )
    await this.writeFile(this.getContentPath('localNews', context), JSON.stringify(jsonModels))
  }

  async loadLocalNews(context: DatabaseContext): Promise<LocalNewsModel[]> {
    const path = this.getContentPath('localNews', context)
    const mapLocalNewsJson = (json: ContentLocalNewsJsonType[]) =>
      json.map(
        jsonObject =>
          new LocalNewsModel({
            id: jsonObject.id,
            timestamp: DateTime.fromISO(jsonObject.timestamp),
            title: jsonObject.title,
            content: jsonObject.content,
          }),
      )

    return this.readFile(path, mapLocalNewsJson)
  }

  async storeCities(cities: Array<CityModel>): Promise<void> {
    const jsonModels = cities.map(
      (city: CityModel): ContentCityJsonType => ({
        name: city.name,
        live: city.live,
        code: city.code,
        languages: city.languages.map(it => ({ code: it.code, name: it.name })),
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
      }),
    )
    await this.writeFile(this.getCitiesPath(), JSON.stringify(jsonModels))
  }

  async loadCities(): Promise<Array<CityModel>> {
    const path = this.getCitiesPath()
    const mapCityJson = (json: ContentCityJsonType[]) =>
      json.map(
        jsonObject =>
          new CityModel({
            name: jsonObject.name,
            code: jsonObject.code,
            live: jsonObject.live,
            languages: jsonObject.languages.map(it => new LanguageModel(it.code, it.name)),
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
            boundingBox: jsonObject.bounding_box,
          }),
      )

    return this.readFile(path, mapCityJson)
  }

  async storeEvents(events: Array<EventModel>, context: DatabaseContext): Promise<void> {
    const jsonModels = events.map(
      (event: EventModel): ContentEventJsonType => ({
        path: event.path,
        title: event.title,
        content: event.content,
        last_update: event.lastUpdate.toISO(),
        thumbnail: event.thumbnail,
        available_languages: mapToObject(event.availableLanguages),
        excerpt: event.excerpt,
        date: {
          start_date: event.date.startDate.toISO(),
          end_date: event.date.endDate.toISO(),
          all_day: event.date.allDay,
          recurrence_rule: event.date.recurrenceRule?.toString() ?? null,
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
      }),
    )
    await this.writeFile(this.getContentPath('events', context), JSON.stringify(jsonModels))
  }

  async loadEvents(context: DatabaseContext): Promise<Array<EventModel>> {
    const path = this.getContentPath('events', context)
    const mapEventsJson = (json: ContentEventJsonType[]) =>
      json.map(jsonObject => {
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
          lastUpdate: DateTime.fromISO(jsonObject.last_update),
          excerpt: jsonObject.excerpt,
          date: new DateModel({
            startDate: DateTime.fromISO(jsonDate.start_date),
            endDate: DateTime.fromISO(jsonDate.end_date),
            allDay: jsonDate.all_day,
            recurrenceRule: jsonDate.recurrence_rule ? rrulestr(jsonDate.recurrence_rule) : null,
          }),
          location: jsonObject.location
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

    return this.readFile(path, mapEventsJson)
  }

  async loadResourceCache(context: DatabaseContext): Promise<CityResourceCacheStateType> {
    const path = this.getResourceCachePath(context)
    const fileExists: boolean = await BlobUtil.fs.exists(path)

    if (!fileExists) {
      return {}
    }

    const mapResourceCacheJson = (json: CityResourceCacheJsonType) =>
      mapValues(json, languageResourceCache =>
        mapValues(languageResourceCache, (fileResourceCache: PageResourceCacheJsonType) =>
          mapValues(
            fileResourceCache,
            (entry: PageResourceCacheEntryJsonType): PageResourceCacheEntryStateType => ({
              filePath: entry.file_path,
              hash: entry.hash,
            }),
          ),
        ),
      )
    return this.readFile(path, mapResourceCacheJson)
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
              hash: entry.hash,
            }),
          ),
        ),
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
        if (a.lastUsage < b.lastUsage) {
          return -1
        }
        return a.lastUsage.equals(b.lastUsage) ? 0 : 1
      }) // We only have to remove MAX_STORED_CITIES - 1 since we already filtered for the current resource cache
      .slice(0, -(MAX_STORED_CITIES - 1))
    await this.deleteCities(cachesToDelete.map(it => it.city))
  }

  async deleteCities(cityCodes: string[]): Promise<void> {
    await Promise.all([
      ...cityCodes.map(city => {
        log(`Deleting content and resource cache of city '${city}'`)
        const cityResourceCachePath = `${RESOURCE_CACHE_DIR_PATH}/${city}`
        const cityContentPath = `${CONTENT_DIR_PATH}/${city}`
        return Promise.all([deleteIfExists(cityResourceCachePath), deleteIfExists(cityContentPath)])
      }),
      this._deleteMetaOfCities(cityCodes),
    ])
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

  isEventsPersisted(context: DatabaseContext): Promise<boolean> {
    return this._isPersisted(this.getContentPath('events', context))
  }

  isLocalNewsPersisted(context: DatabaseContext): Promise<boolean> {
    return this._isPersisted(this.getContentPath('localNews', context))
  }

  _isPersisted(path: string): Promise<boolean> {
    return BlobUtil.fs.exists(path)
  }

  async readFile<R, T>(path: string, mapJson: (json: R) => T, isRetry = false): Promise<T> {
    const fileExists = await BlobUtil.fs.exists(path)

    if (!fileExists) {
      throw Error(`File ${path} does not exist`)
    }

    const jsonString = await BlobUtil.fs.readFile(path, 'utf8')

    try {
      const json: R = JSON.parse(jsonString)
      return mapJson(json)
    } catch (e) {
      if (!isRetry) {
        log(
          `An error occurred while trying to parse or map json '${jsonString}' from path '${path}', retrying.`,
          'warning',
        )
        return this.readFile(path, mapJson, true)
      }
      log(
        `An error occurred while trying to parse or map json '${jsonString}' from path '${path}', deleting file.`,
        'warning',
      )
      await deleteIfExists(path)
      throw e
    }
  }

  async writeFile(path: string, data: string): Promise<void> {
    return BlobUtil.fs.writeFile(path, data, 'utf8')
  }
}

export default DatabaseConnector
