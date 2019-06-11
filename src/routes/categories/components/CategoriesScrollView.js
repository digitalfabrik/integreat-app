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
import { translate, type TFunction } from 'react-i18next'

type PropsType = {
  navigation: NavigationScreenProp<*>,
  cityCode: string,

  language: string,
  cities?: Array<CityModel>,

  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToIntegreatUrl: NavigateToIntegreatUrlParamsType => void,
  resourceCache: LanguageResourceCacheStateType,
  theme: ThemeType,
  stateView: ?CategoriesRouteStateView,
  t: TFunction
}

class CategoriesScrollView extends React.Component<PropsType> {
  onRefresh = () => {
    const {navigateToCategory, cityCode, language, stateView, navigation} = this.props
    if (stateView) {
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

    const loading = !stateView || !cities || !resourceCache

    if (!stateView || !cities || !resourceCache) { // I cannot do 'if (loading)' here because of flow -.-
      return <ScrollView refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing={loading} />} />
    }

    return <ScrollView refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing={loading} />}
                       contentContainerStyle={{flexGrow: 1}}>
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
  }
}

export default translate('categories')(CategoriesScrollView)
