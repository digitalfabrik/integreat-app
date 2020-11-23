// @flow

import * as React from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import { type TFunction, withTranslation } from 'react-i18next'
import SprungbrettOffer from '../components/SprungbrettOffer'
import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import {
  CityModel,
  createSprungbrettJobsEndpoint,
  OfferModel,
  Payload,
  SprungbrettJobModel
} from 'api-client'
import { SPRUNGBRETT_OFFER } from '../../offers/constants'
import withTheme from '../../../modules/theme/hocs/withTheme'
import type { ThemeType } from '../../../modules/theme/constants'
import type { NavigationStackProp } from 'react-navigation-stack'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import { LOADING_TIMEOUT } from '../../../modules/common/constants'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import type { FeedbackInformationType } from '../../feedback/containers/FeedbackModalContainer'

type OwnPropsType = {| navigation: NavigationStackProp<*> |}

type StatePropsType = {| offer: ?OfferModel, language: string, cities: $ReadOnlyArray<CityModel> |}

type PropsType = { ...OwnPropsType, ...StatePropsType }

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const offers: Array<OfferModel> = ownProps.navigation.getParam('offers')
  // prevent re-rendering when city is not there.
  const cities = state.cities.models || []
  return {
    cities,
    language: state.contentLanguage,
    offer: offers.find(offer => offer.alias === SPRUNGBRETT_OFFER)
  }
}

type SprungbrettPropsType = {|
  navigation: NavigationStackProp<*>,
  offer: ?OfferModel,
  cities: Array<CityModel>,
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
    const { navigation, offer, cities, language } = this.props
    const cityCode: string = navigation.getParam('city')
    if (!cityCode || !language) {
      throw Error('language or cityCode not available')
    }

    const cityTitle = CityModel.findCityName(cities, cityCode)
    if (!language) {
      throw Error('language not available')
    }

    const feedbackInformation: FeedbackInformationType = {
      type: 'Offers',
      cityTitle,
      title: offer?.title,
      feedbackAlias: offer?.alias,
      path: offer?.path,
      language,
      isPositiveFeedback
    }

    navigation.navigate('FeedbackModal', { ...feedbackInformation })
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
      return <ScrollView refreshControl={<RefreshControl onRefresh={this.loadSprungbrett} refreshing={false} />}
                         contentContainerStyle={{ flexGrow: 1 }}>
        <FailureContainer errorMessage={error.message} tryAgain={this.loadSprungbrett} />
      </ScrollView>
    }

    if (!offer) {
      return <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <FailureContainer code={ErrorCodes.UnknownError} />
      </ScrollView>
    }

    if (!jobs) {
      return timeoutExpired
        ? <ScrollView refreshControl={<RefreshControl refreshing />} contentContainerStyle={{ flexGrow: 1 }} />
        : null
    }

    return <ScrollView refreshControl={<RefreshControl onRefresh={this.loadSprungbrett} refreshing={false} />}
                       contentContainerStyle={{ flexGrow: 1 }}>
      <SprungbrettOffer sprungbrettOffer={offer} sprungbrettJobs={jobs} t={t} theme={theme} language={language} />
      <SiteHelpfulBox navigateToFeedback={this.navigateToFeedback} theme={theme} t={t} />
    </ScrollView>
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withTranslation('sprungbrett')(
    withTheme(SprungbrettOfferContainer)
  ))
