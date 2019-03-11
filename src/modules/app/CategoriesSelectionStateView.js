// @flow

import { CategoryModel } from '@integreat-app/integreat-api-client'
import { has } from 'lodash'

class CategoriesSelectionStateView {
  rawRoot: ?string
  rawModels: { [path: string]: CategoryModel }
  rawChildren: { [path: string]: Array<string> }

  constructor (root: ?string, models: { [path: string]: CategoryModel }, children: { [path: string]: Array<string> }) {
    this.rawModels = models
    this.rawChildren = children
    this.rawRoot = root
  }

  hasRoot (): CategoryModel {
    return has(this.rawModels, this.rawRoot)
  }

  root (): CategoryModel {
    if (!this.rawRoot || !this.hasRoot()) {
      throw new Error(`CategoriesStateView doesn't have a root!`)
    }
    return this.rawModels[this.rawRoot]
  }

  children (): Array<CategoryModel> {
    if (!this.rawRoot) {
      throw new Error(`CategoriesStateView doesn't have a root!`)
    }

    const childrenPaths = this.rawChildren[this.rawRoot]

    if (!childrenPaths) {
      throw new Error(`Could not find children for category: ${this.rawRoot}`)
    }

    return childrenPaths.map(childPath => this.rawModels[childPath])
  }

  stepInto (path: string): CategoriesSelectionStateView {
    return new CategoriesSelectionStateView(path, this.rawModels, this.rawChildren)
  }
}

export default CategoriesSelectionStateView
