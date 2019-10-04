// @flow

import { CategoriesMapModel, CategoryModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import type { FileCacheStateType, LanguageResourceCacheStateType } from '../../modules/app/StateType'
import seedrandom from 'seedrandom'
import hashUrl from '../../modules/endpoint/hashUrl'

const DEFAULT_ARITY = 3
const DEFAULT_DEPTH = 2
const MAX_PREDICTABLE_VALUE = 6

/**
 * This builder generates a perfect m-ary tree of categories with the specified depth.
 */
class CategoriesMapModelBuilder {
  _depth: number
  _arity: number

  _categories: Array<CategoryModel>
  _id = 0

  constructor (arity: number = DEFAULT_ARITY, depth: number = DEFAULT_DEPTH) {
    this._arity = arity
    this._depth = depth
  }

  _predictableNumber (index: number, max: number = MAX_PREDICTABLE_VALUE): number {
    return seedrandom(`${index}-seed`)() * max
  }

  createResource (url: string, index: number, lastUpdate: moment): FileCacheStateType {
    const hash = hashUrl(url)
    return {
      [url]: {
        filePath: `path/to/documentDir/resource-cache/v1/some-city/files/${hash}.png`,
        lastUpdate: moment(lastUpdate).add(this._predictableNumber(index), 'days'),
        hash
      }
    }
  }

  _addChildren (
    category: CategoryModel,
    resourceCache: LanguageResourceCacheStateType,
    depth: number) {
    this._categories.push(category)

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
        lastUpdate
      })

      resourceCache[path] = {
        ...this.createResource(resourceUrl1, id, lastUpdate),
        ...this.createResource(resourceUrl2, id, lastUpdate),
        ...this.createResource(thumbnail, id, lastUpdate)
      }

      this._addChildren(newChild, resourceCache, depth + 1)
    }
  }

  buildResources (): { [path: string]: FileCacheStateType } {
    return this.buildAll().resourceCache
  }

  build (): CategoriesMapModel {
    return this.buildAll().categories
  }

  buildAll (): { categories: CategoriesMapModel, resourceCache: { [path: string]: FileCacheStateType } } {
    const categories = []
    const resourceCache = {}

    this._categories = []
    this._addChildren(new CategoryModel({
      path: '/augsburg/de',
      title: 'augsburg',
      content: '',
      order: -1,
      availableLanguages: new Map(),
      thumbnail: 'no_thumbnail',
      parentPath: '',
      lastUpdate: moment('2017-11-18T19:30:00.000Z', moment.ISO_8601)
    }), resourceCache, 0)

    return { categories: new CategoriesMapModel(categories), resourceCache }
  }
}

export default CategoriesMapModelBuilder
