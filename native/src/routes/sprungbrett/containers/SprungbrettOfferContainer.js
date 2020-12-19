// @flow

import * as React from 'react'
import { RefreshControl } from 'react-native'
import { type TFunction, withTranslation } from 'react-i18next'
import SprungbrettOffer from '../components/SprungbrettOffer'
import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import {
  createSprungbrettJobsEndpoint,
  OfferModel,
  Payload,
  SprungbrettJobModel
} from 'api-client'
import { SPRUNGBRETT_OFFER } from '../../offers/constants'
import withTheme from '../../../modules/theme/hocs/withTheme'
import type { ThemeType } from '../../../modules/theme/constants'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import { LOADING_TIMEOUT } from '../../../modules/common/constants'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import createNavigateToFeedbackModal from '../../../modules/app/createNavigateToFeedbackModal'
import type {
  SprungbrettOfferRouteType,
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/components/NavigationTypes'
import LayoutedScrollView from '../../../modules/common/components/LayoutedScrollView'
import LayoutContainer from '../../../modules/layout/containers/LayoutContainer'

type OwnPropsType = {|
  route: RoutePropType<SprungbrettOfferRouteType>,
  navigation: NavigationPropType<SprungbrettOfferRouteType>
|}

type StatePropsType = {| offer: ?OfferModel, language: string |}

type PropsType = { ...OwnPropsType, ...StatePropsType }

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const offers: Array<OfferModel> = ownProps.route.params.offers
  return {
    language: state.contentLanguage,
    offer: offers.find(offer => offer.alias === SPRUNGBRETT_OFFER)
  }
}

type SprungbrettPropsType = {|
  ...OwnPropsType,
  offer: ?OfferModel,
  language: string,
  theme: ThemeType,
  t: TFunction
|}

type SprungbrettStateType = {|
  jobs: ?Array<SprungbrettJobModel>,
  error: ?Error,
  timeoutExpired: boolean
|}

// HINT: If you are copy-pasting this container think about generalizing this way of fetching
class SprungbrettOfferContainer extends React.Component<SprungbrettPropsType, SprungbrettStateType> {
  constructor (props: SprungbrettPropsType) {
    super(props)
    this.state = { jobs: null, error: null, timeoutExpired: false }
  }

  navigateToFeedback = (isPositiveFeedback: boolean) => {
    const { route, navigation, offer, language } = this.props
    createNavigateToFeedbackModal(navigation)({
      type: 'Offers',
      cityCode: route.params.city,
      title: offer?.title,
      alias: offer?.alias,
      path: offer?.path,
      language,
      isPositiveFeedback
    })
  }

  componentDidMount () {
    this.loadSprungbrett()
  }

  loadSprungbrett = async () => {
    const { offer } = this.props

    if (!offer) {
      this.setState({ error: new Error('The Sprungbrett offer is not supported.'), jobs: null })
      return
    }

    this.setState({ error: null, jobs: null, timeoutExpired: false })
    setTimeout(() => this.setState({ timeoutExpired: true }), LOADING_TIMEOUT)

    try {
      const payload: Payload<Array<SprungbrettJobModel>> = await createSprungbrettJobsEndpoint(offer.path).request()

      if (payload.error) {
        this.setState({ error: payload.error, jobs: null })
      } else {
        this.setState({ error: null, jobs: payload.data })
      }
    } catch (e) {
      this.setState({ error: e, jobs: null })
    }
  }

  render () {
    const { offer, t, theme, language } = this.props
    const { jobs, error, timeoutExpired } = this.state

    if (error) {
      return (
        <LayoutedScrollView refreshControl={<RefreshControl onRefresh={this.loadSprungbrett} refreshing={false} />}>
          <FailureContainer errorMessage={error.message} tryAgain={this.loadSprungbrett} />
        </LayoutedScrollView>
      )
    }

    if (!offer) {
      return <LayoutContainer>
        <FailureContainer code={ErrorCodes.UnknownError} />
      </LayoutContainer>
    }

    if (!jobs) {
      return timeoutExpired
        ? <LayoutedScrollView refreshControl={<RefreshControl refreshing />} />
        : <LayoutContainer />
    }

    return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={this.loadSprungbrett} refreshing={false} />}>
      <SprungbrettOffer sprungbrettOffer={offer} sprungbrettJobs={jobs} t={t} theme={theme} language={language} />
      <SiteHelpfulBox navigateToFeedback={this.navigateToFeedback} theme={theme} t={t} />
    </LayoutedScrollView>
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withTranslation('sprungbrett')(
    withTheme(SprungbrettOfferContainer)
  ))
