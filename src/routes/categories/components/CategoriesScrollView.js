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

type OwnPropsType = {|
  navigation: NavigationScreenProp<*>,
  success: true,
  cities: Array<CityModel>,
  cityCode: string,
  language: string,
  stateView: CategoriesRouteStateView,
  resourceCache: LanguageResourceCacheStateType,
  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToIntegreatUrl: NavigateToIntegreatUrlParamsType => void,
  theme: ThemeType
|} | {| loading: true |}

class CategoriesScrollView extends React.Component<OwnPropsType> {
  onRefresh = () => {
    if (!this.props.loading) {
      const {navigateToCategory, cityCode, language, stateView, navigation} = this.props
      navigateToCategory({
        cityCode, language, path: stateView.rawRoot, forceUpdate: true, key: navigation.getParam('key')
      })
    }
  }

  render () {
    if (this.props.loading) {
      return <ScrollView refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing />} />
    }

    const {
      cities, stateView, resourceCache, navigateToIntegreatUrl, language, cityCode, theme, navigateToCategory,
      navigation
    } = this.props

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
                    navigateToIntegreatUrl={navigateToIntegreatUrl} />
      </ScrollView>
    )
  }
}

export default CategoriesScrollView
