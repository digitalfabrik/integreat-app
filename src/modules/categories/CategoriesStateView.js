// @flow

import { CategoryModel } from '@integreat-app/integreat-api-client'

class CategoriesStateView {
  rawRoot: string
  rawModels: { [path: string]: CategoryModel }
  rawChildren: { [path: string]: Array<string> }

  constructor (root: string, models: { [path: string]: CategoryModel }, children: { [path: string]: Array<string> }) {
    this.rawModels = models
    this.rawChildren = children
    this.rawRoot = root
  }

  root (): CategoryModel {
    return this.rawModels[this.rawRoot]
  }

  // hasRoot (): boolean {
  //   return !!this.root()
  // }

  children (): Array<CategoryModel> {
    return this.rawChildren[this.rawRoot].map(childPath => this.rawModels[childPath])
  }

  stepInto (path: string): CategoriesStateView {
    return new CategoriesStateView(path, this.rawModels, this.rawChildren)
  }
}

export default CategoriesStateView
