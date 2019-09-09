// @flow

import { CategoriesMapModel, CategoryModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'

const DEFAULT_MAX_WIDTH = 3
const DEFAULT_DEPTH = 2

class CategoriesMapModelBuilder {
  _depth: number
  _maxWidth: number

  constructor (maxWidth: number = DEFAULT_MAX_WIDTH, depth: number = DEFAULT_DEPTH) {
    this._maxWidth = maxWidth
    this._depth = depth
  }

  addChildren (category: CategoryModel, categories: Array<CategoryModel>, depth: number) {
    if (depth === this._depth) {
      return
    }

    for (let i = 0; i < this._maxWidth; i++) {
      const newChild = new CategoryModel({
        id: 0,
        path: `${category.path}/category_${depth}-${i}`,
        title: `Category ${depth}-${i}`,
        content: 'Content',
        order: -1,
        availableLanguages: new Map(),
        thumbnail: `http://thumbnails/category_${depth}-${i}.png`,
        parentPath: category.path,
        lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
      })
      categories.push(newChild)
      this.addChildren(newChild, categories, depth + 1)
    }
  }

  build (): CategoriesMapModel {
    const categories = []

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
      }), categories, 0)
    }

    return new CategoriesMapModel(categories)
  }
}

export default CategoriesMapModelBuilder
