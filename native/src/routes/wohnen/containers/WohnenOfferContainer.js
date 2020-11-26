// @flow

import * as React from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import type { StateType } from '../../../modules/app/StateType'
import { connect } from 'react-redux'
import { type TFunction, withTranslation } from 'react-i18next'
import WohnenOffer from '../components/WohnenOffer'
import { createWohnenEndpoint, OfferModel, Payload, WohnenOfferModel } from 'api-client'
import { WOHNEN_OFFER, WOHNEN_ROUTE } from '../../offers/constants'
import withTheme from '../../../modules/theme/hocs/withTheme'
import type { ThemeType } from '../../../modules/theme/constants'
import type { NavigationStackProp } from 'react-navigation-stack'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import { LOADING_TIMEOUT } from '../../../modules/common/constants'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import type { FeedbackInformationType } from '../../feedback/containers/FeedbackModalContainer'

const WOHNEN_API_URL = 'https://api.wohnen.integreat-app.de/v0'

type OwnPropsType = {| navigation: NavigationStackProp<*> |}

type StatePropsType = {|
  city: string,
  offer: ?OfferModel,
  language: string,
  offerHash: string,
  navigateToOffer: (offerHash: string) => void,
  navigateToFeedback: (isPositiveFeedback: boolean) => void
|}

type PropsType = { ...OwnPropsType, ...StatePropsType }

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const cityName: string = ownProps.navigation.getParam('cityName')
  const offers: Array<OfferModel> = ownProps.navigation.getParam('offers')
  const offerHash: string = ownProps.navigation.getParam('offerHash')

  const offer: ?OfferModel = offers.find(offer => offer.alias === WOHNEN_OFFER)
  const language = state.contentLanguage

  const navigateToOffer = (offerHash: string) => {
    const params = { offerHash: offerHash, offers: offers }
    if (ownProps.navigation.push) {
      ownProps.navigation.push(WOHNEN_ROUTE, params)
    }
  }

  const navigateToFeedback = (isPositiveFeedback: boolean) => {
    const feedbackInformation: FeedbackInformationType = {
      type: 'Offers',
      cityName: cityName,
      title: offer?.title,
      feedbackAlias: offer?.alias,
      path: offer?.path,
      language,
      isPositiveFeedback
    }

    ownProps.navigation.navigate('FeedbackModal', { ...feedbackInformation })
  }

  return {
    language: state.contentLanguage,
    offerHash,
    offer,
    navigateToOffer,
    navigateToFeedback
  }
}

type WohnenPropsType = {|
  offer: ?OfferModel,
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
    const { offer } = this.props
    const apiName = offer && offer.postData && offer.postData.get('api-name')
    if (!offer || !apiName) {
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

  render () {
    const { language, offer, offerHash, navigateToOffer, navigateToFeedback, t, theme } = this.props
    const { offers, error, timeoutExpired } = this.state

    if (error) {
      return <ScrollView refreshControl={<RefreshControl onRefresh={this.loadWohnen} refreshing={false} />}
                         contentContainerStyle={{ flexGrow: 1 }}>
        <FailureContainer errorMessage={error.message} tryAgain={this.loadWohnen} />
      </ScrollView>
    }

    if (!offer) {
      return <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <FailureContainer code={ErrorCodes.UnknownError} />
      </ScrollView>
    }

    if (!offers) {
      return timeoutExpired
        ? <ScrollView refreshControl={<RefreshControl refreshing />} contentContainerStyle={{ flexGrow: 1 }} />
        : null
    }

    return <ScrollView refreshControl={<RefreshControl onRefresh={this.loadWohnen} refreshing={false} />}
                       contentContainerStyle={{ flexGrow: 1 }}>
      <WohnenOffer wohnenOffer={offer} offerHash={offerHash} navigateToOffer={navigateToOffer} offers={offers}
                          t={t} theme={theme} language={language} />
      <SiteHelpfulBox navigateToFeedback={navigateToFeedback} theme={theme} t={t} />
    </ScrollView>
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withTranslation('wohnen')(
    withTheme(WohnenOfferContainer)
  ))
