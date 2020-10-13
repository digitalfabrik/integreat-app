// @flow

import {connect} from 'react-redux'
import type {Dispatch} from 'redux'
import type {NewsType, StateType} from '../../../modules/app/StateType'
import type {FetchNewsActionType, StoreActionType} from '../../../modules/app/StoreActionType'
import ChangeLanguageModal from '../components/ChangeLanguageModal'
import withTheme from '../../../modules/theme/hocs/withTheme'
import {LanguageModel} from '@integreat-app/integreat-api-client'
import type {NavigationScreenProp} from 'react-navigation'
import type {TFunction} from 'react-i18next'
import {withTranslation} from 'react-i18next'

type OwnPropsType = {| navigation: NavigationScreenProp<*>, t: TFunction |}

type StatePropsType = {|
  currentLanguage: string,
  languages: Array<LanguageModel>,
  availableLanguages: Array<string>,
  newsType: ?NewsType
|}

type DispatchPropsType = {|
  changeLanguage: (newLanguage: string) => void
|}

type PropsType = { ...OwnPropsType, ...StatePropsType, ...DispatchPropsType }

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const currentLanguage: string = ownProps.navigation.getParam('currentLanguage')
  const languages: Array<LanguageModel> = ownProps.navigation.getParam('languages')
  const availableLanguages: Array<string> = ownProps.navigation.getParam('availableLanguages')
  const previousKey = ownProps.navigation.getParam('previousKey')

  const newsRouteMapping = state.cityContent?.newsRouteMapping
  const newsType = previousKey && newsRouteMapping && newsRouteMapping[previousKey] && newsRouteMapping[previousKey].type

  return {
    currentLanguage,
    languages,
    availableLanguages,
    newsType
  }
}

type DispatchType = Dispatch<StoreActionType>
const mapDispatchToProps = (dispatch: DispatchType, ownProps: OwnPropsType): DispatchPropsType => {
  const cityCode = ownProps.navigation.getParam('cityCode')
  const previousKey = ownProps.navigation.getParam('previousKey')

  return {
    changeLanguage: (newLanguage: string, newsType: ?NewsType) => {
      dispatch({
        type: 'SWITCH_CONTENT_LANGUAGE',
        params: { newLanguage, city: ownProps.navigation.getParam('cityCode'), t: ownProps.t }
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

export default withTranslation('error')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
    withTheme(ChangeLanguageModal)
  )
)
