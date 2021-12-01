import { StackHeaderProps } from '@react-navigation/stack'
import { TFunction, withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import {
  CityModel,
  OFFERS_ROUTE,
  DISCLAIMER_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  NonNullableRouteInformationType,
  NEWS_ROUTE
} from 'api-client'

import Header, { PropsType as HeaderPropsType } from '../components/Header'
import withTheme from '../hocs/withTheme'
import navigateToLanguageChange from '../navigation/navigateToLanguageChange'
import { urlFromRouteInformation } from '../navigation/url'
import { StateType } from '../redux/StateType'
import isPeekingRoute from '../redux/selectors/isPeekingRoute'

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

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const routeKey = ownProps.scene.route.key
  // @ts-ignore
  const cityCode = ownProps.scene.route.params?.cityCode || state.cityContent?.city
  // @ts-ignore
  const languageCode = ownProps.scene.route.params?.languageCode || state.contentLanguage
  const route = state.cityContent?.routeMapping[routeKey]
  const simpleRoutes = [OFFERS_ROUTE, DISCLAIMER_ROUTE, SPRUNGBRETT_OFFER_ROUTE]
  const routeName = ownProps.scene.route.name
  const simpleRouteShareUrl =
    typeof cityCode === 'string' && typeof languageCode === 'string' && (simpleRoutes as string[]).includes(routeName)
      ? urlFromRouteInformation({
          cityCode,
          languageCode,
          route: routeName as typeof simpleRoutes extends (infer U)[] ? U : never
        })
      : null
  const newsRouteShareUrl =
    ownProps.scene.route.name === NEWS_ROUTE
      ? urlFromRouteInformation({
          cityCode,
          languageCode,
          route: NEWS_ROUTE,
          // @ts-ignore
          newsType: ownProps.scene.route.params.newsType,
          // @ts-ignore
          newsId: ownProps.scene.route.params.newsId
        })
      : null
  const languages = state.cityContent?.languages
  // prevent re-rendering when city is there.
  const cities = state.cities.status === 'ready' ? state.cities.models : []
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
      shareUrl: simpleRouteShareUrl ?? newsRouteShareUrl
    }
  }

  const goToLanguageChange = () => {
    if (typeof cityCode === 'string' && typeof languageCode === 'string') {
      navigateToLanguageChange({
        // @ts-ignore Wrong navigation type
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
  // @ts-ignore route.path is always defined if relevant
  const routeInformation: NonNullableRouteInformationType = {
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

export default withTranslation('layout')(connect(mapStateToProps)(withTheme<HeaderPropsType>(Header)))
