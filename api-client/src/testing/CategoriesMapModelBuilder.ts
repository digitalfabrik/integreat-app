import moment, { Moment } from 'moment'
import seedrandom from 'seedrandom'
import md5 from 'js-md5'
import CategoryModel from '../models/CategoryModel'
import CategoriesMapModel from '../models/CategoriesMapModel'
import hashUrl from '../hashUrl'
type PageResourceCacheEntryStateType = {
  readonly filePath: string
  readonly lastUpdate: Moment
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
  _categories: Array<CategoryModel>
  _resourceCache: Record<string, PageResourceCacheStateType>
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

  createResource(url: string, index: number, lastUpdate: Moment): PageResourceCacheEntryStateType {
    const hash = hashUrl(url)
    return {
      filePath: `path/to/documentDir/resource-cache/v1/${this._city}/files/${hash}.png`,
      lastUpdate: moment(lastUpdate).add(this._predictableNumber(index), 'days'),
      hash
    }
  }

  _addChildren(category: CategoryModel, depth: number) {
    this._categories.push(category)

    if (depth === 0) {
      this._resourceCache[category.path] = {}
    }

    if (depth === this._depth) {
      return
    }

    for (let i = 0; i < this._arity; i++) {
      const id = this._id
      this._id++
      const path = `${category.path}/category_${i}`
      const lastUpdate = moment('2017-11-18T19:30:00.000Z', moment.ISO_8601)
      const resourceUrl1 = `https://cms.integreat-app.de/title_${id}-300x300.png`
      const resourceUrl2 = `https://cms.integreat-app.de/category_${id}-300x300.png`
      const thumbnail = `http://cms.integreat-app.de/thumbnails/category_${id}.png`
      const newChild = new CategoryModel({
        root: false,
        path,
        title: `Category with id ${id}`,
        content: `<h1>This is a sample page</h1>
                    <img src="${resourceUrl1}"/>
                    <p>This is a sample page</p>
                    <img src="${resourceUrl2}"/>`,
        order: i,
        availableLanguages: new Map(),
        thumbnail,
        parentPath: category.path,
        lastUpdate,
        hash: md5.create().update(category.path).hex()
      })
      this._resourceCache[path] = {
        [resourceUrl1]: this.createResource(resourceUrl1, id, lastUpdate),
        [resourceUrl2]: this.createResource(resourceUrl2, id, lastUpdate),
        [thumbnail]: this.createResource(thumbnail, id, lastUpdate)
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
        lastUpdate: moment('2017-11-18T19:30:00.000Z', moment.ISO_8601),
        hash: md5.create().update(path).hex()
      }),
      0
    )

    return {
      categories: new CategoriesMapModel(this._categories),
      resourceCache: this._resourceCache
    }
  }
}

export default CategoriesMapModelBuilder
