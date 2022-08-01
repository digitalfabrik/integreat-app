import { connect } from 'react-redux'

import { CityModel } from 'api-client'

import Header from '../components/Header'
import { RoutesType, RoutePropType, NavigationPropType } from '../constants/NavigationTypes'
import navigateToLanguageChange from '../navigation/navigateToLanguageChange'
import { StateType } from '../redux/StateType'
import isPeekingRoute from '../redux/selectors/isPeekingRoute'

type OwnProps = {
  route: RoutePropType<RoutesType>
  navigation: NavigationPropType<RoutesType>
}

type StatePropsType = {
  language: string
  goToLanguageChange?: () => void
  peeking: boolean
  categoriesAvailable: boolean
  routeCityModel?: CityModel
}

const mapStateToProps = (state: StateType, ownProps: OwnProps): StatePropsType => {
  const { key: routeKey } = ownProps.route
  const { cityContent, contentLanguage, cities } = state
  const route = cityContent?.routeMapping[routeKey]

  const languages = cityContent?.languages
  const categoriesAvailable = cityContent?.searchRoute !== null
  const routeCityModel =
    route && cities.status === 'ready' ? cities.models.find(city => city.code === route.city) : undefined

  if (!cityContent || route?.status !== 'ready' || cities.status !== 'ready' || languages?.status !== 'ready') {
    // Route does not exist yet. In this case it is not really defined whether we are peek or not because
    // we do not yet know the city of the route.
    return {
      language: contentLanguage,
      routeCityModel,
      peeking: false,
      categoriesAvailable: false,
    }
  }

  const goToLanguageChange = () => {
    navigateToLanguageChange({
      navigation: ownProps.navigation,
      languageCode: contentLanguage,
      languages: Array.from(languages.models),
      cityCode: cityContent.city,
      availableLanguages: Array.from(route.allAvailableLanguages.keys()),
      previousKey: routeKey,
    })
  }

  const peeking = isPeekingRoute(state, {
    routeCity: route.city,
  })
  const { language } = route
  return {
    peeking,
    routeCityModel,
    language,
    goToLanguageChange,
    categoriesAvailable,
  }
}

export default connect(mapStateToProps)(Header)
