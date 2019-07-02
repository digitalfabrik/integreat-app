// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import { RefreshControl, ScrollView } from 'react-native'
import Categories from '../../../modules/categories/components/Categories'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { CityModel } from '@integreat-app/integreat-api-client'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { LanguageResourceCacheStateType } from '../../../modules/app/StateType'
import type { NavigateToCategoryParamsType } from '../../../modules/app/createNavigateToCategory'
import type { NavigateToIntegreatUrlParamsType } from '../../../modules/app/createNavigateToIntegreatUrl'
import { type TFunction } from 'react-i18next'

export type PropsType = {|
  navigation: NavigationScreenProp<*>,
  cities?: Array<CityModel>,
  cityCode?: string,
  language?: string,
  stateView?: CategoriesRouteStateView,
  resourceCache?: LanguageResourceCacheStateType,
  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToIntegreatUrl: NavigateToIntegreatUrlParamsType => void,
  theme: ThemeType,
  t: TFunction
|}

class CategoriesScrollView extends React.Component<PropsType> {
  onRefresh = () => {
    const {navigateToCategory, cityCode, language, stateView, navigation} = this.props
    if (cityCode && language && stateView) {
      navigateToCategory({
        cityCode, language, path: stateView.rawRoot, forceUpdate: true, key: navigation.getParam('key')
      })
    }
  }

  render () {
    const {
      cities, stateView, resourceCache, navigateToIntegreatUrl, language, cityCode, theme, navigateToCategory,
      navigation, t
    } = this.props

    if (!cities || !stateView || !resourceCache || !language || !cityCode) {
      return <ScrollView refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing />} />
    } else {
      return (
        <ScrollView refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing={false} />}>
          <Categories stateView={stateView}
                      cities={cities}
                      resourceCache={resourceCache}
                      language={language}
                      cityCode={cityCode}
                      navigation={navigation}
                      theme={theme}
                      navigateToCategory={navigateToCategory}
                      navigateToIntegreatUrl={navigateToIntegreatUrl}
                      t={t} />
        </ScrollView>
      )
    }
  }
}

export default CategoriesScrollView
