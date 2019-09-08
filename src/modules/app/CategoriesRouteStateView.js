// @flow

import { CategoryModel } from '@integreat-app/integreat-api-client'
import { has } from 'lodash'

class CategoriesRouteStateView {
  +rawPath: string
  +rawModels: { [path: string]: CategoryModel }
  +rawChildren: { [path: string]: Array<string> }

  constructor (path: string, models: { [path: string]: CategoryModel }, children: { [path: string]: Array<string> }) {
    this.rawModels = models
    this.rawChildren = children
    this.rawPath = path
  }

  root (): CategoryModel {
    if (!has(this.rawModels, this.rawPath)) {
      throw new Error(`CategoriesRouteStateView doesn't have the root model for '${this.rawPath}'!`)
    }
    return this.rawModels[this.rawPath]
  }

  children (): Array<CategoryModel> {
    const childrenPaths = this.rawChildren[this.rawPath]

    if (!childrenPaths) {
      throw new Error(`Could not find children for category '${this.rawPath}'!`)
    }

    return childrenPaths.map(childPath => this.rawModels[childPath])
  }

  stepInto (path: string): CategoriesRouteStateView {
    return new CategoriesRouteStateView(path, this.rawModels, this.rawChildren)
  }
}

export default CategoriesRouteStateView
