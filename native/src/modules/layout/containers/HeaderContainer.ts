import { connect } from 'react-redux'
import { StackHeaderProps } from '@react-navigation/stack'
import '@react-navigation/stack'
import { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import { PropsType as HeaderPropsType } from '../components/Header'
import Header from '../components/Header'
import withTheme from '../../theme/hocs/withTheme'
import { StateType } from '../../app/StateType'
import { Dispatch } from 'redux'
import 'redux'
import { StoreActionType } from '../../app/StoreActionType'
import { CityModel, OFFERS_ROUTE, DISCLAIMER_ROUTE, SPRUNGBRETT_OFFER_ROUTE, NEWS_ROUTE } from 'api-client'
import isPeekingRoute from '../../endpoint/selectors/isPeekingRoute'
import { urlFromRouteInformation } from '../../navigation/url'
import { NonNullableRouteInformationType } from 'api-client'
import navigateToLanguageChange from '../../navigation/navigateToLanguageChange'
type OwnPropsType = StackHeaderProps & {
  t: TFunction
}
type StatePropsType = {
  language: string
  goToLanguageChange?: () => void
  peeking: boolean
  categoriesAvailable: boolean
  routeCityModel?: CityModel
  shareUrl: string | null | undefined
}
type DispatchPropsType = {
  dispatch: Dispatch<StoreActionType>
}
type PropsType = OwnPropsType & StatePropsType & DispatchPropsType

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const routeKey = ownProps.scene.route.key
  const cityCode = ownProps.scene.route.params?.cityCode || state.cityContent?.city
  const languageCode = ownProps.scene.route.params?.languageCode || state.contentLanguage
  const route = state.cityContent?.routeMapping[routeKey]
  const simpleRoutes = [OFFERS_ROUTE, DISCLAIMER_ROUTE, SPRUNGBRETT_OFFER_ROUTE]
  const routeName = ownProps.scene.route.name
  const simpleRouteShareUrl =
    typeof cityCode === 'string' && typeof languageCode === 'string' && simpleRoutes.includes(routeName)
      ? urlFromRouteInformation({
          cityCode,
          languageCode,
          route: routeName as $Values<typeof simpleRoutes>
        })
      : null
  const languages = state.cityContent?.languages
  // prevent re-rendering when city is there.
  const cities = state.cities.models || []
  const categoriesAvailable = state.cityContent?.searchRoute !== null
  const routeCityModel = route ? cities.find(city => city.code === route.city) : undefined

  if (
    !route ||
    route.status !== 'ready' ||
    state.cities.status !== 'ready' ||
    !state.cityContent ||
    !languages ||
    languages.status !== 'ready' ||
    !cityCode
  ) {
    // Route does not exist yet. In this case it is not really defined whether we are peek or not because
    // we do not yet know the city of the route.
    return {
      language: state.contentLanguage,
      routeCityModel,
      peeking: false,
      categoriesAvailable: false,
      shareUrl: simpleRouteShareUrl
    }
  }

  const goToLanguageChange = () => {
    if (typeof cityCode === 'string' && typeof languageCode === 'string') {
      navigateToLanguageChange({
        // $FlowFixMe Wrong navigation type
        navigation: ownProps.navigation,
        languageCode,
        languages: Array.from(languages.models),
        cityCode,
        availableLanguages: Array.from(route.allAvailableLanguages.keys()),
        previousKey: routeKey
      })
    }
  }

  const peeking = isPeekingRoute(state, {
    routeCity: route.city
  })
  const { language, city } = route
  const newsId = route.newsId || undefined
  const routeInformation: NonNullableRouteInformationType =
    route.routeType === NEWS_ROUTE
      ? {
          route: NEWS_ROUTE,
          languageCode: language,
          cityCode: city,
          newsType: route.type,
          newsId
        } // $FlowFixMe route.path is always defined if relevant
      : {
          route: route.routeType,
          languageCode: language,
          cityCode: city,
          cityContentPath: route.path || undefined
        }
  const shareUrl = urlFromRouteInformation(routeInformation)
  return {
    peeking,
    routeCityModel,
    language,
    goToLanguageChange,
    categoriesAvailable,
    shareUrl
  }
}

export default withTranslation<OwnPropsType>('layout')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(withTheme<HeaderPropsType>(Header))
)
