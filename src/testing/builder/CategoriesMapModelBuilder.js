// @flow

import { CategoriesMapModel, CategoryModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import type { FileCacheStateType, LanguageResourceCacheStateType } from '../../modules/app/StateType'
import seedrandom from 'seedrandom'
import hashUrl from '../../modules/endpoint/hashUrl'
import type { FetchMapType } from '../../modules/endpoint/sagas/fetchResourceCache'
import { createFetchMap } from './util'

const DEFAULT_MAX_WIDTH = 3
const DEFAULT_DEPTH = 2
const MAX_PREDICTABLE_VALUE = 6

const FILE_PATH_BUILDER = (url: string, urlHash: string) =>
  `path/to/documentDir/resource-cache/v1/some-city/files/${urlHash}.png`

class CategoriesMapModelBuilder {
  _depth: number
  _maxWidth: number
  _buildFilePath: (url: string, urlHash: string) => string

  constructor (
    maxWidth: number = DEFAULT_MAX_WIDTH,
    depth: number = DEFAULT_DEPTH,
    buildFilePath: (url: string, urlHash: string) => string = FILE_PATH_BUILDER) {
    this._maxWidth = maxWidth
    this._depth = depth
    this._buildFilePath = buildFilePath
  }

  predictableNumber (index: number, max: number = MAX_PREDICTABLE_VALUE): number {
    return seedrandom(`${index}-seed`)() * max
  }

  createResource (url: string, index: number, lastUpdate: moment): FileCacheStateType {
    const hash = hashUrl(url)
    return {
      [url]: {
        filePath: this._buildFilePath(url, hash),
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

      const thumbnailUrl = `http://thumbnails/category_${depth}-${i}.png`
      const imgUrl1 = `https://integreat/title_${depth}-${i}-300x300.png`
      const imgUrl2 = `https://integreat/category_${depth}-${i}-300x300.png`

      const newChild = new CategoryModel({
        id: 0,
        path,
        title: `Category ${depth}-${i}`,
        content: `<h1>This is a sample page</h1>
                    <img src="${imgUrl1}"/>
                    <p>This is a sample page</p>
                    <img src="${imgUrl2}"/>`,
        order: -1,
        availableLanguages: new Map(),
        thumbnail: thumbnailUrl,
        parentPath: category.path,
        lastUpdate
      })

      const index = depth * this._maxWidth + i
      resourceCache[path] = {
        ...this.createResource(imgUrl1, index, lastUpdate),
        ...this.createResource(imgUrl2, index, lastUpdate),
        ...this.createResource(thumbnailUrl, index, lastUpdate)
      }
      categories.push(newChild)
      this.addChildren(newChild, categories, resourceCache, depth + 1)
    }
  }

  buildResources (): { [path: string]: FileCacheStateType } {
    return this.buildAll().resourceCache
  }

  buildFetchMap (): FetchMapType {
    return createFetchMap(this.buildResources())
  }

  build (): CategoriesMapModel {
    return this.buildAll().categories
  }

  buildAll (): { categories: CategoriesMapModel, resourceCache: { [path: string]: FileCacheStateType } } {
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
