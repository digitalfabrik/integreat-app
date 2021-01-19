// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { RefreshControl } from 'react-native'
import Offers from '../components/Offers'
import { type TFunction, withTranslation } from 'react-i18next'
import { CityModel, createOffersEndpoint, OfferModel, Payload } from 'api-client'
import type { ThemeType } from 'build-configs/ThemeType'
import type { StateType } from '../../../modules/app/StateType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import { LOADING_TIMEOUT } from '../../../modules/common/constants'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'
import type {
  OffersRouteType,
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/constants/NavigationTypes'
import {
  EXTERNAL_OFFER_ROUTE, OFFERS_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  WOHNEN_OFFER_ROUTE
} from '../../../modules/app/constants/NavigationTypes'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import type { Dispatch } from 'redux'
import LayoutedScrollView from '../../../modules/common/containers/LayoutedScrollView'
import LayoutContainer from '../../../modules/layout/containers/LayoutContainer'
import { cityContentUrl } from '../../../modules/common/url'
import openExternalUrl from '../../../modules/common/openExternalUrl'

type OwnPropsType = {|
  route: RoutePropType<OffersRouteType>,
  navigation: NavigationPropType<OffersRouteType>
|}

type StatePropsType = {| city: ?string, language: string, cities: ?$ReadOnlyArray<CityModel> |}
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType): StatePropsType => {
  const cities: ?$ReadOnlyArray<CityModel> = state.cities.status !== 'ready' ? null : state.cities.models

  return {
    city: state.cityContent?.city,
    language: state.contentLanguage,
    cities
  }
}

type OffersPropsType = {|
  ...OwnPropsType,
  city: ?string,
  cities: ?Array<CityModel>,
  language: string,
  theme: ThemeType,
  t: TFunction
|}

type OffersStateType = {|
  offers: ?Array<OfferModel>,
  error: ?Error,
  timeoutExpired: boolean
|}

class OffersContainer extends React.Component<OffersPropsType, OffersStateType> {
  constructor (props: OffersPropsType) {
    super(props)
    this.state = { offers: null, error: null, timeoutExpired: false }
  }

  componentDidMount () {
    this.loadOffers().catch(e => this.setState({ error: e }))
  }

  navigateToOffer = (
    offers: Array<OfferModel>,
    path: string,
    isExternalUrl: boolean,
    postData: ?Map<string, string>
  ) => {
    const { navigation, city, language } = this.props
    if (!city) {
      return
    }

    // HTTP POST is neither supported by the InAppBrowser nor by Linking, therefore we have to open it in a webview
    if (isExternalUrl && postData) {
      navigation.push(EXTERNAL_OFFER_ROUTE, { url: path, shareUrl: path, postData })
    } else if (isExternalUrl) {
      openExternalUrl(path)
    } else if (path === SPRUNGBRETT_OFFER_ROUTE) {
      const shareUrl = cityContentUrl({ cityCode: city, languageCode: language, route: OFFERS_ROUTE, path })
      const params = { city, offers, shareUrl }
      navigation.push(SPRUNGBRETT_OFFER_ROUTE, params)
    } else if (path === WOHNEN_OFFER_ROUTE) {
      const params = { city, offers, offerHash: null }
      navigation.push(WOHNEN_OFFER_ROUTE, params)
    }
  }

  loadOffers = async () => {
    const { city, language } = this.props

    if (!city) {
      return
    }

    this.setState({ error: null, offers: null, timeoutExpired: false })
    setTimeout(() => this.setState({ timeoutExpired: true }), LOADING_TIMEOUT)

    try {
      const apiUrl = await determineApiUrl()
      const payload: Payload<Array<OfferModel>> = await (createOffersEndpoint(apiUrl).request({
        city,
        language
      }))

      if (payload.error) {
        this.setState({ error: payload.error, offers: null })
      } else {
        this.setState({ error: null, offers: payload.data })
      }
    } catch (e) {
      this.setState({ error: e, offers: null })
    }
  }

  render () {
    const { theme, t, cities, navigation, city, language, route } = this.props
    const { offers, error, timeoutExpired } = this.state

    if (error) {
      return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={this.loadOffers} refreshing={false} />}>
        <FailureContainer errorMessage={error.message} tryAgain={this.loadOffers} />
      </LayoutedScrollView>
    }

    if (!offers || !cities || !city) {
      return timeoutExpired
        ? <LayoutedScrollView refreshControl={<RefreshControl refreshing />} />
        : <LayoutContainer />
    }

    return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={this.loadOffers} refreshing={false} />}>
      <Offers offers={offers} navigateToOffer={this.navigateToOffer} theme={theme} t={t} cities={cities}
              navigation={navigation} route={route} cityCode={city} language={language} />
    </LayoutedScrollView>
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withTranslation('offers')(
    withTheme(OffersContainer)
  )
)
