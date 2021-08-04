import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { NewsRouteStateType, StateType } from '../redux/StateType'
import { StoreActionType } from '../redux/StoreActionType'
import ChangeLanguageModal from './ChangeLanguageModal'
import withTheme from '../hocs/withTheme'
import { LanguageModel, NEWS_ROUTE, ChangeLanguageModalRouteType, NewsType } from 'api-client'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import { ThemeType } from 'build-configs'

type OwnPropsType = {
  route: RoutePropType<ChangeLanguageModalRouteType>
  navigation: NavigationPropType<ChangeLanguageModalRouteType>
}
type StatePropsType = {
  currentLanguage: string
  languages: Array<LanguageModel>
  availableLanguages: Array<string>
  newsType: NewsType | undefined
}
type DispatchPropsType = {
  changeLanguage: (newLanguage: string, newsType: NewsType | undefined) => void
}
type PropsType = OwnPropsType & StatePropsType & DispatchPropsType

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
      (newsRouteMapping[previousKey] as NewsRouteStateType).type) ||
    undefined
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
    changeLanguage: (newLanguage: string, newsType: NewsType | undefined) => {
      dispatch({
        type: 'SWITCH_CONTENT_LANGUAGE',
        params: {
          newLanguage,
          city: cityCode
        }
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTheme<
    PropsType & {
      theme: ThemeType
    }
  >(ChangeLanguageModal)
)
