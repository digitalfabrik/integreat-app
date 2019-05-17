// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import { RefreshControl, ScrollView } from 'react-native'
import Categories from '../../../modules/categories/components/Categories'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { CityModel } from '@integreat-app/integreat-api-client'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { ResourceCacheStateType } from '../../../modules/app/StateType'

type PropsType = {
  navigation: NavigationScreenProp<*>,
  cityCode: string,

  language: string,
  cities?: Array<CityModel>,

  navigateToCategory: (cityCode: string, language: string, path: string) => void,
  navigateToIntegreatUrl: (url: string, cityCode: string, language: string) => void,
  refresh: (cityCode: string, language: string, path: string, forceRefresh: boolean, key: string) => void,
  resourceCache: ResourceCacheStateType,
  theme: ThemeType,
  stateView: ?CategoriesRouteStateView
}

class CategoriesScrollView extends React.Component<PropsType> {
  onRefresh = () => {
    const {refresh, cityCode, language, stateView, navigation} = this.props
    if (stateView) {
      refresh(cityCode, language, stateView.rawRoot, true, navigation.getParam('key'))
    }
  }

  render () {
    const {cities, stateView, resourceCache, navigateToIntegreatUrl} = this.props

    const loading = !stateView || !cities || !resourceCache

    return (
      <ScrollView refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing={loading} />}>
        {!loading && // $FlowFixMe Flow doesn't recognize stateView and cities to not be nullish here -.-
        <Categories stateView={stateView}
                    cities={cities}
                    resourceCache={resourceCache}
                    language={this.props.language}
                    cityCode={this.props.cityCode}
                    theme={this.props.theme}
                    navigateToCategory={this.props.navigateToCategory}
                    navigateToIntegreatUrl={navigateToIntegreatUrl} />}
      </ScrollView>
    )
  }
}

export default CategoriesScrollView
