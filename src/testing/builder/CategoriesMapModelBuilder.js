// @flow

import { CategoriesMapModel, CategoryModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import type { FileCacheStateType, LanguageResourceCacheStateType } from '../../modules/app/StateType'
import fnv from 'fnv-plus'
import seedrandom from 'seedrandom'

const DEFAULT_MAX_WIDTH = 3
const DEFAULT_DEPTH = 2
const MAX_PREDICTABLE_VALUE = 6

class CategoriesMapModelBuilder {
  _depth: number
  _maxWidth: number

  constructor (maxWidth: number = DEFAULT_MAX_WIDTH, depth: number = DEFAULT_DEPTH) {
    this._maxWidth = maxWidth
    this._depth = depth
  }

  predictableNumber (index: number, max: number = MAX_PREDICTABLE_VALUE): number {
    return seedrandom(index + 'seed')() * max
  }

  createResource (url: string, index: number, lastUpdate: moment): FileCacheStateType {
    const hash = fnv.hash(url).hex()
    return {
      [url]: {
        filePath: `path/to/documentDir/resource-cache/v1/some-city/files/${hash}.png`,
        lastUpdate: moment(lastUpdate).add(this.predictableNumber(index), 'days'),
        hash
      }
    }
  }

  addChildren (
    category: CategoryModel,
    categories: Array<CategoryModel>,
    resourceCache: LanguageResourceCacheStateType,
    depth: number) {
    if (depth === this._depth) {
      return
    }

    for (let i = 0; i < this._maxWidth; i++) {
      const path = `${category.path}/category_${depth}-${i}`
      const lastUpdate = moment.tz('2017-11-18 19:30:00', 'UTC')

      const newChild = new CategoryModel({
        id: 0,
        path,
        title: `Category ${depth}-${i}`,
        content: `<h1>This is a sample page</h1>
                    <img src="https://integreat/title_${depth}-${i}-300x300.png"/>
                    <p>This is a sample page</p>
                    <img src="https://integreat/category_${depth}-${i}-300x300.png"/>`,
        order: -1,
        availableLanguages: new Map(),
        thumbnail: `http://thumbnails/category_${depth}-${i}.png`,
        parentPath: category.path,
        lastUpdate
      })

      resourceCache[path] = {
        ...this.createResource(`https://integreat/title_${depth}-${i}-300x300.png`,
          depth * this._maxWidth + i,
          lastUpdate),
        ...this.createResource(`https://integreat/category_${depth}-${i}-300x300.png`,
          depth * this._maxWidth + i,
          lastUpdate)
      }
      categories.push(newChild)
      this.addChildren(newChild, categories, resourceCache, depth + 1)
    }
  }

  buildResources (): LanguageResourceCacheStateType {
    return this.buildAll().resourceCache
  }

  build (): CategoriesMapModel {
    return this.buildAll().categories
  }

  buildAll (): { categories: CategoriesMapModel, resourceCache: LanguageResourceCacheStateType } {
    const categories = []
    const resourceCache = {}

    for (let i = 0; i < this._maxWidth; i++) {
      this.addChildren(new CategoryModel({
        id: 0,
        path: '/augsburg/de',
        title: 'augsburg',
        content: '',
        order: -1,
        availableLanguages: new Map(),
        thumbnail: 'no_thumbnail',
        parentPath: '',
        lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
      }), categories, resourceCache, 0)
    }

    return { categories: new CategoriesMapModel(categories), resourceCache }
  }
}

export default CategoriesMapModelBuilder
