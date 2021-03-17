// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import ChangeLanguageModal from '../components/ChangeLanguageModal'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { LanguageModel, NEWS_ROUTE } from 'api-client'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import type { ChangeLanguageModalRouteType, NewsType } from 'api-client/src/routes'
import type { ThemeType } from 'build-configs/ThemeType'

type OwnPropsType = {|
  route: RoutePropType<ChangeLanguageModalRouteType>,
  navigation: NavigationPropType<ChangeLanguageModalRouteType>,
  t: TFunction
|}

type StatePropsType = {|
  currentLanguage: string,
  languages: Array<LanguageModel>,
  availableLanguages: Array<string>,
  newsType: ?NewsType
|}

type DispatchPropsType = {|
  changeLanguage: (newLanguage: string) => void
|}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const currentLanguage: string = ownProps.route.params.currentLanguage
  const languages: Array<LanguageModel> = ownProps.route.params.languages
  const availableLanguages: Array<string> = ownProps.route.params.availableLanguages
  const previousKey = ownProps.route.params.previousKey

  const newsRouteMapping = state.cityContent?.routeMapping
  const newsType =
    (previousKey &&
      newsRouteMapping &&
      newsRouteMapping[previousKey] &&
      newsRouteMapping[previousKey].routeType === NEWS_ROUTE &&
      newsRouteMapping[previousKey].type) ||
    null

  return {
    currentLanguage,
    languages,
    availableLanguages,
    newsType
  }
}

type DispatchType = Dispatch<StoreActionType>
const mapDispatchToProps = (dispatch: DispatchType, ownProps: OwnPropsType): DispatchPropsType => {
  const cityCode = ownProps.route.params.cityCode
  const previousKey = ownProps.route.params.previousKey

  return {
    changeLanguage: (newLanguage: string, newsType: ?NewsType) => {
      dispatch({
        type: 'SWITCH_CONTENT_LANGUAGE',
        params: { newLanguage, city: cityCode, t: ownProps.t }
      })

      if (newsType) {
        dispatch({
          type: 'FETCH_NEWS',
          params: {
            city: cityCode,
            language: newLanguage,
            newsId: null,
            type: newsType,
            key: previousKey,
            criterion: {
              forceUpdate: false,
              shouldRefreshResources: false
            }
          }
        })
      }
    }
  }
}

export default withTranslation<OwnPropsType>('error')(
  connect<PropsType, OwnPropsType, _, _, _, _>(
    mapStateToProps,
    mapDispatchToProps
  )(withTheme<{| ...PropsType, theme: ThemeType |}>(ChangeLanguageModal))
)
