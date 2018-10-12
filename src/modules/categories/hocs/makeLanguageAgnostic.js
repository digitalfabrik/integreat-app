// @flow

import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import * as React from 'react'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'

type PropsType = {|
  categories: CategoriesMapModel,
  language: string,
  path: string
|}

function makeLanguageAgnostic<Props: { path: string, categories: CategoriesMapModel, language: string }> (
  Component: React.ComponentType<Props>
): React.ComponentType<$Diff<Props, { categoryModel: CategoryModel | void }>> {
  type StateType = {|
    categoryModel: ?CategoryModel,
    path: ?string
  |}

  class LanguageAgnosticCategories extends React.PureComponent<Props, StateType> {
    constructor (props: Props) {
      super(props)
      this.state = {
        categoryModel: null,
        path: null
      }
    }

    static getDerivedStateFromProps (props: PropsType, state: StateType): StateType | null {
      const previous = state.categoryModel

      if (previous) {
        const path = previous.availableLanguages.get(props.language)

        if (path) {
          return {categoryModel: props.categories.findCategoryByPath(path), path}
        }
      }

      return {categoryModel: props.categories.findCategoryByPath(props.path), path: props.path}
    }

    render () {
      const categoryModel = this.state.categoryModel
      if (!categoryModel) {
        const error = new ContentNotFoundError({
          type: 'category',
          id: this.state.path || '??',
          city: '??',
          language: this.props.language
        })
        return <FailureSwitcher error={error} />
      }

      return <Component {...this.props} categoryModel={categoryModel} />
    }
  }

  return LanguageAgnosticCategories
}

export default makeLanguageAgnostic
