// @flow

import { CategoriesMapModel, CategoryModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import type { PageResourceCacheStateType } from '../../modules/app/StateType'
import seedrandom from 'seedrandom'
import hashUrl from '../../modules/endpoint/hashUrl'
import type { FetchMapType } from '../../modules/endpoint/sagas/fetchResourceCache'
import { createFetchMap } from './util'
import md5 from 'js-md5'

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
  _resourceCache: { [path: string]: PageResourceCacheStateType }
  _id = 0

  constructor (city: string, language: string, arity: number = DEFAULT_ARITY, depth: number = DEFAULT_DEPTH) {
    this._arity = arity
    this._depth = depth
    this._city = city
    this._language = language
  }

  _predictableNumber (index: number, max: number = MAX_PREDICTABLE_VALUE): number {
    return seedrandom(`${index}-seed`)() * max
  }

  createResource (url: string, index: number, lastUpdate: moment): PageResourceCacheStateType {
    const hash = hashUrl(url)
    return {
      [url]: {
        filePath: `path/to/documentDir/resource-cache/v1/${this._city}/files/${hash}.png`,
        lastUpdate: moment(lastUpdate).add(this._predictableNumber(index), 'days'),
        hash
      }
    }
  }

  _addChildren (category: CategoryModel, depth: number) {
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
      const resourceUrl1 = `https://integreat/title_${id}-300x300.png`
      const resourceUrl2 = `https://integreat/category_${id}-300x300.png`
      const thumbnail = `http://thumbnails/category_${id}.png`

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
        ...this.createResource(resourceUrl1, id, lastUpdate),
        ...this.createResource(resourceUrl2, id, lastUpdate),
        ...this.createResource(thumbnail, id, lastUpdate)
      }

      this._addChildren(newChild, depth + 1)
    }
  }

  buildResources (): { [path: string]: PageResourceCacheStateType } {
    return this.buildAll().resourceCache
  }

  buildFetchMap (): FetchMapType {
    return createFetchMap(this.buildResources())
  }

  build (): CategoriesMapModel {
    return this.buildAll().categories
  }

  buildAll (): { categories: CategoriesMapModel, resourceCache: { [path: string]: PageResourceCacheStateType } } {
    this._resourceCache = {}
    this._categories = []
    this._id = 0

    const path = `/${this._city}/${this._language}`
    this._addChildren(new CategoryModel({
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
    }), 0)

    return { categories: new CategoriesMapModel(this._categories), resourceCache: this._resourceCache }
  }
}

export default CategoriesMapModelBuilder
