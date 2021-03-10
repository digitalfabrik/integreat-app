// @flow

import * as React from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import type { StateType } from '../../../modules/app/StateType'
import { connect } from 'react-redux'
import { type TFunction, withTranslation } from 'react-i18next'
import WohnenOffer from '../components/WohnenOffer'
import { createWohnenEndpoint, Payload, WohnenOfferModel } from 'api-client'
import withTheme from '../../../modules/theme/hocs/withTheme'
import type { ThemeType } from '../../../modules/theme/constants'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import { LOADING_TIMEOUT } from '../../../modules/common/constants'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import createNavigateToFeedbackModal from '../../../modules/navigation/createNavigateToFeedbackModal'
import type {
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/constants/NavigationTypes'
import type { WohnenOfferRouteType } from 'api-client/src/routes'
import { WOHNEN_OFFER_ROUTE } from 'api-client/src/routes'
import { fromError } from '../../../modules/error/ErrorCodes'

const WOHNEN_API_URL = 'https://api.wohnen.integreat-app.de/v0'

type OwnPropsType = {|
  route: RoutePropType<WohnenOfferRouteType>,
  navigation: NavigationPropType<WohnenOfferRouteType>
|}

type StatePropsType = {|
  postData: ?Map<string, string>,
  title: string,
  language: string,
  offerHash: ?string,
  navigateToOffer: (offerHash: string) => void,
  navigateToFeedback: (isPositiveFeedback: boolean) => void
|}

type PropsType = { ...OwnPropsType, ...StatePropsType }

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const cityCode: string = ownProps.route.params.city
  const alias: string = ownProps.route.params.alias
  const title: string = ownProps.route.params.title
  const postData: ?Map<string, string> = ownProps.route.params.postData
  const offerHash: ?string = ownProps.route.params.offerHash

  const navigateToOffer = (offerHash: string) => {
    const params = { offerHash: offerHash, alias, title, postData, city: cityCode }
    if (ownProps.navigation.push) {
      ownProps.navigation.push(WOHNEN_OFFER_ROUTE, params)
    }
  }

  const navigateToFeedback = (isPositiveFeedback: boolean) => {
    createNavigateToFeedbackModal(ownProps.navigation)({
      type: 'Offers',
      cityCode,
      title,
      alias,
      language: state.contentLanguage,
      isPositiveFeedback
    })
  }

  return {
    language: state.contentLanguage,
    offerHash,
    title,
    postData,
    navigateToOffer,
    navigateToFeedback
  }
}

type WohnenPropsType = {|
  postData: ?Map<string, string>,
  title: string,
  offerHash?: WohnenOfferModel,
  navigateToOffer: (offerHash: string) => void,
  navigateToFeedback: (isPositiveFeedback: boolean) => void,
  theme: ThemeType,
  language: string,
  t: TFunction
|}

type WohnenStateType = {|
  offers: ?Array<WohnenOfferModel>,
  error: ?Error,
  timeoutExpired: boolean
|}

// HINT: If you are copy-pasting this container think about generalizing this way of fetching
class WohnenOfferContainer extends React.Component<WohnenPropsType, WohnenStateType> {
  constructor (props: WohnenPropsType) {
    super(props)
    this.state = { offers: null, error: null, timeoutExpired: false }
  }

  componentDidMount () {
    this.loadWohnen()
  }

  loadWohnen = async () => {
    const { postData } = this.props
    const apiName = postData && postData.get('api-name')
    if (!apiName) {
      this.setState({ error: new Error('The Wohnen offer is not supported.'), offers: null })
      return
    }

    this.setState({ offers: null, error: null, timeoutExpired: false })
    setTimeout(() => this.setState({ timeoutExpired: true }), LOADING_TIMEOUT)

    try {
      const payload: Payload<Array<WohnenOfferModel>> = await createWohnenEndpoint(WOHNEN_API_URL).request(
        { city: apiName }
      )

      if (payload.error) {
        this.setState({ error: payload.error, offers: null })
      } else {
        this.setState({ error: null, offers: payload.data })
      }
    } catch (e) {
      this.setState({ error: e, offers: null })
    }
  }

  tryAgain = () => {
    this.loadWohnen()
  }

  render () {
    const { language, offerHash, navigateToOffer, navigateToFeedback, t, theme, title } = this.props
    const { offers, error, timeoutExpired } = this.state

    if (error) {
      return <ScrollView refreshControl={<RefreshControl onRefresh={this.loadWohnen} refreshing={false} />}
                         contentContainerStyle={{ flexGrow: 1 }}>
        <FailureContainer code={fromError(error)} tryAgain={this.tryAgain} />
      </ScrollView>
    }

    if (!offers) {
      return timeoutExpired
        ? <ScrollView refreshControl={<RefreshControl refreshing />} contentContainerStyle={{ flexGrow: 1 }} />
        : null
    }

    return <ScrollView refreshControl={<RefreshControl onRefresh={this.loadWohnen} refreshing={false} />}
                       contentContainerStyle={{ flexGrow: 1 }}>
      <WohnenOffer title={title} offerHash={offerHash} navigateToOffer={navigateToOffer} offers={offers}
                          t={t} theme={theme} language={language} />
      <SiteHelpfulBox navigateToFeedback={navigateToFeedback} theme={theme} />
    </ScrollView>
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  // $FlowFixMe
  withTranslation('wohnen')(
    withTheme(WohnenOfferContainer)
  ))
