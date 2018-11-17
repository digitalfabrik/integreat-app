// @flow

import * as React from 'react'
import type { CategoriesStateType, CitiesStateType, FileCacheStateType, LanguagesStateType } from '../../app/StateType'
import { ActivityIndicator } from 'react-native'
import FailureSwitcher from './FailureSwitcher'
import CityModel from '../../endpoint/models/CityModel'
import CategoryModel from '../../endpoint/models/CategoryModel'

type PropsType = {
  categories?: CategoriesStateType,
  fileCache?: FileCacheStateType,
  cities?: CitiesStateType,
  languages?: LanguagesStateType,
  cityModel: CityModel
}

function switchFailureLoadingComponent<Props: PropsType>
(Component: React.ComponentType<Props>): React.ComponentType<$Diff<Props, { categoryModel: CategoryModel | void }>> {
  class FailureLoadingComponent extends React.PureComponent<Props> {
    render () {
      const {cities, categories, fileCache} = this.props
      const city = this.props.cityModel.code

      if (!categories || !cities || !fileCache) {
        return <ActivityIndicator size='large' color='#0000ff' />
      }

      const message = cities.error || !categories.city || categories[city].error ||
        !fileCache[city] || fileCache[city].error

      if (message) {
        const error = new Error(message)
        return <FailureSwitcher error={error} />
      }

      return <Component {...this.props} />
    }
  }

  return FailureLoadingComponent
}

export default switchFailureLoadingComponent
