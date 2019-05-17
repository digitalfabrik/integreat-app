// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import { RefreshControl, ScrollView } from 'react-native'
import Categories from '../../../modules/categories/components/Categories'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { CityModel } from '@integreat-app/integreat-api-client'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { LanguageResourceCacheStateType } from '../../../modules/app/StateType'

type PropsType = {
  navigation: NavigationScreenProp<*>,
  cityCode: string,

  language: string,
  cities?: Array<CityModel>,

  navigateToCategory: (cityCode: string, language: string, path: string, forceRefresh?: boolean, key?: string) => void,
  navigateToIntegreatUrl: (url: string, cityCode: string, language: string) => void,
  resourceCache: LanguageResourceCacheStateType,
  theme: ThemeType,
  stateView: ?CategoriesRouteStateView
}

class CategoriesScrollView extends React.Component<PropsType> {
  onRefresh = () => {
    const {navigateToCategory, cityCode, language, stateView, navigation} = this.props
    if (stateView) {
      navigateToCategory(cityCode, language, stateView.rawRoot, true, navigation.getParam('key'))
    }
  }

  render () {
    const {
      cities, stateView, resourceCache, navigateToIntegreatUrl, language, cityCode, theme, navigateToCategory
    } = this.props

    const loading = !stateView || !cities || !resourceCache

    return (
      <ScrollView refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing={loading} />}>
        {!loading && // $FlowFixMe Flow doesn't recognize stateView and cities to not be nullish here -.-
        <Categories stateView={stateView}
                    cities={cities}
                    resourceCache={resourceCache}
                    language={language}
                    cityCode={cityCode}
                    theme={theme}
                    navigateToCategory={navigateToCategory}
                    navigateToIntegreatUrl={navigateToIntegreatUrl} />}
      </ScrollView>
    )
  }
}

export default CategoriesScrollView
