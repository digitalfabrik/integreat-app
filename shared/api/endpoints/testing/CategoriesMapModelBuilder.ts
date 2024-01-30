import { DateTime } from 'luxon'
import md5 from 'md5'
import seedrandom from 'seedrandom'

import CategoriesMapModel from '../../models/CategoriesMapModel'
import CategoryModel from '../../models/CategoryModel'
import OfferModel from '../../models/OfferModel'
import OrganizationModel from '../../models/OrganizationModel'

const lehrstellenRadarPostData = new Map()
lehrstellenRadarPostData.set('partner', '0006')
lehrstellenRadarPostData.set('radius', '50')
lehrstellenRadarPostData.set('plz', '86150')

type PageResourceCacheEntryStateType = {
  readonly filePath: string
  readonly lastUpdate: DateTime
  readonly hash: string
}
type PageResourceCacheStateType = Record<string, PageResourceCacheEntryStateType>
const DEFAULT_ARITY = 3
const DEFAULT_DEPTH = 2
const MAX_PREDICTABLE_VALUE = 6

/**
 * This builder generates a perfect m-ary tree of categories with the specified depth.
 */

class CategoriesMapModelBuilder {
  _depth: number
  _arity: number
  _city: string
  _language: string
  _categories: Array<CategoryModel> = []
  _resourceCache: Record<string, PageResourceCacheStateType> = {}
  _id = 0

  constructor(city: string, language: string, arity: number = DEFAULT_ARITY, depth: number = DEFAULT_DEPTH) {
    this._arity = arity
    this._depth = depth
    this._city = city
    this._language = language
    this._categories = []
    this._resourceCache = {}
  }

  _predictableNumber(index: number, max: number = MAX_PREDICTABLE_VALUE): number {
    return seedrandom(`${index}-seed`)() * max
  }

  createResource(url: string, index: number, lastUpdate: DateTime): PageResourceCacheEntryStateType {
    const hash = md5(url)
    return {
      filePath: `path/to/documentDir/resource-cache/v1/${this._city}/files/${hash}.png`,
      lastUpdate: lastUpdate.plus({ days: this._predictableNumber(index) }),
      hash,
    }
  }

  _addChildren(category: CategoryModel, depth: number): void {
    this._categories.push(category)

    if (depth === 0) {
      this._resourceCache[category.path] = {}
    }

    if (depth === this._depth) {
      return
    }

    for (let i = 0; i < this._arity; i += 1) {
      const id = this._id
      this._id += 1
      const path = `${category.path}/category_${i}`
      const lastUpdate = DateTime.fromISO('2017-11-18T19:30:00.000Z')
      const resourceUrl1 = `https://cms.integreat-app.de/title_${id}-300x300.png`
      const resourceUrl2 = `https://cms.integreat-app.de/category_${id}-300x300.png`
      const thumbnail = `https://cms.integreat-app.de/thumbnails/category_${id}.png`
      const newChild = new CategoryModel({
        root: false,
        path,
        title: `Category with id ${id}`,
        content: `<h1>Page of Category ${id}</h1>
                    <img src="${resourceUrl1}" alt="" />
                    <p>This is a sample page</p>
                    <img src="${resourceUrl2}" alt=""/>`,
        order: i,
        availableLanguages: new Map(),
        thumbnail,
        parentPath: category.path,
        lastUpdate,
        organization: new OrganizationModel({
          name: 'Tür an Tür',
          logo: 'https://example.com/my-icon',
          url: 'https://example.com',
        }),
        embeddedOffers:
          id === 1
            ? [
                new OfferModel({
                  alias: 'sprungbrett',
                  thumbnail: 'some_other_thumbnail',
                  title: 'Sprungbrett',
                  path: 'https://web.integreat-app.de/proxy/sprungbrett/app-search-internships?location=augsburg',
                }),
                new OfferModel({
                  alias: 'lehrstellen-radar',
                  thumbnail: 'some_other_thumbnail',
                  title: 'Lehrstellenradar',
                  path: 'https://www.lehrstellen-radar.de/5100,0,lsrlist.html',
                  postData: lehrstellenRadarPostData,
                }),
              ]
            : [],
      })
      this._resourceCache[path] = {
        [resourceUrl1]: this.createResource(resourceUrl1, id, lastUpdate),
        [resourceUrl2]: this.createResource(resourceUrl2, id, lastUpdate),
        [thumbnail]: this.createResource(thumbnail, id, lastUpdate),
      }

      this._addChildren(newChild, depth + 1)
    }
  }

  buildResources(): Record<string, PageResourceCacheStateType> {
    return this.buildAll().resourceCache
  }

  build(): CategoriesMapModel {
    return this.buildAll().categories
  }

  buildAll(): {
    categories: CategoriesMapModel
    resourceCache: Record<string, PageResourceCacheStateType>
  } {
    this._resourceCache = {}
    this._categories = []
    this._id = 0
    const path = `/${this._city}/${this._language}`

    this._addChildren(
      new CategoryModel({
        root: true,
        path,
        title: `${this._city}`,
        content: '',
        order: -1,
        availableLanguages: new Map(),
        thumbnail: '',
        parentPath: '',
        lastUpdate: DateTime.fromISO('2017-11-18T19:30:00.000Z'),
        organization: null,
        embeddedOffers: [],
      }),
      0,
    )

    return {
      categories: new CategoriesMapModel(this._categories),
      resourceCache: this._resourceCache,
    }
  }
}

export default CategoriesMapModelBuilder
