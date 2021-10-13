import { CategoryModel } from 'api-client'

class CategoriesRouteStateView {
  readonly rawPath: string
  readonly rawModels: Readonly<Record<string, CategoryModel>>
  readonly rawChildren: Readonly<Record<string, ReadonlyArray<string>>>

  constructor(
    path: string,
    models: Readonly<Record<string, CategoryModel>>,
    children: Readonly<Record<string, ReadonlyArray<string>>>
  ) {
    this.rawModels = models
    this.rawChildren = children
    this.rawPath = path
  }

  root(): CategoryModel {
    const root = this.rawModels[this.rawPath]
    if (!root) {
      throw new Error(`CategoriesRouteStateView doesn't have the root model for '${this.rawPath}'!`)
    }

    return root
  }

  children(): Array<CategoryModel> {
    const childrenPaths = this.rawChildren[this.rawPath]

    if (!childrenPaths) {
      throw new Error(`Could not find children for category '${this.rawPath}'!`)
    }

    return childrenPaths.map(childPath => this.rawModels[childPath]).filter((it): it is CategoryModel => !!it)
  }

  stepInto(path: string): CategoriesRouteStateView {
    return new CategoriesRouteStateView(path, this.rawModels, this.rawChildren)
  }
}

export default CategoriesRouteStateView
