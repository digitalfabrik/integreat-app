// @flow

import * as React from 'react'
import type { NavigationLeafRoute, NavigationScreenProp } from 'react-navigation'
import { connect } from 'react-redux'
import { type Dispatch } from 'redux'
import { withTranslation } from 'react-i18next'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FeedbackModal from '../components/FeedbackModal'
import FeedbackVariant from '../FeedbackVariant'
import {
  CATEGORIES_FEEDBACK_TYPE, CityModel,
  CONTENT_FEEDBACK_CATEGORY,
  createFeedbackEndpoint, DEFAULT_FEEDBACK_LANGUAGE, EVENTS_FEEDBACK_TYPE, INTEGREAT_INSTANCE,
  OFFER_FEEDBACK_TYPE, OfferModel, OFFERS_FEEDBACK_TYPE,
  PAGE_FEEDBACK_TYPE,
  TECHNICAL_FEEDBACK_CATEGORY
} from 'api-client'
import type { FeedbackParamsType } from 'api-client'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'
import type { TFunction } from 'react-i18next'
import type { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/endpoint/hocs/withPayloadProvider'
import type { StateType } from '../../../modules/app/StateType'
import createNavigateToFeedbackModal from '../../../modules/app/createNavigateToFeedbackModal'
import type { StoreActionType } from '../../../modules/app/StoreActionType'

type FeedbackType = 'Category' | 'Event' | 'Pois' | 'Offers' | 'Disclaimer'

export type FeedbackInformationType = {
  type: FeedbackType,
  isPositiveFeedback: boolean,
  language: string,
  cityCode?: string,
  path?: string,
  title?: string,
  feedbackAlias?: string,
  offers?: Array<OfferModel>
}

type ContainerPropsType = {|
  navigation: NavigationScreenProp<{|...NavigationLeafRoute, params: FeedbackInformationType |}>,
  dispatch: Dispatch<StoreActionType>,
  cities: $ReadOnlyArray<CityModel>,
  t: TFunction
|}

type OwnPropsType = {|
  navigation: NavigationScreenProp<{|...NavigationLeafRoute, params: FeedbackInformationType |}>,
  t: TFunction
|}

type RefreshPropsType = {|
  navigation: NavigationScreenProp<*>
|}

type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const refreshProps = {
    navigation: ownProps.navigation
  }
  if (state.cities.status === 'error') {
    return { status: 'error', message: state.cities.message, code: state.cities.code, refreshProps }
  }

  if (state.cities.status === 'loading') {
    return { status: 'loading', progress: 0 }
  }
  return {
    status: 'success',
    innerProps: {
      cities: state.cities.models,
      navigation: ownProps.navigation,
      t: ownProps.t
    },
    refreshProps
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({ dispatch })

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { navigation } = refreshProps
  const feedbackInformation = navigation.state.params
  const navigateToFeedback = createNavigateToFeedbackModal(navigation)
  navigateToFeedback(feedbackInformation)
}

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

type FeedbackModalStateType = {|
  feedbackOptions: Array<FeedbackVariant>,
  selectedFeedbackIndex: number,
  comment: string,
  sendingStatus: SendingStatusType
|}

class FeedbackModalContainer extends React.Component<ContainerPropsType, FeedbackModalStateType> {
  constructor (props: ContainerPropsType) {
    super(props)
    const feedbackOptions = this.getFeedbackOptions()
    this.state = { feedbackOptions, selectedFeedbackIndex: 0, comment: '', sendingStatus: 'idle' }
  }

  getCityName = (): string => {
    const { cities, navigation } = this.props
    const cityCode = navigation.getParam('cityCode')
    return cityCode ? CityModel.findCityName(cities, cityCode) : INTEGREAT_INSTANCE
  }

  getFeedbackOptions = (): Array<FeedbackVariant> => {
    const options = []
    const currentPageFeedbackOption = this.getCurrentPageFeedbackOption()
    if (currentPageFeedbackOption) {
      options.push(currentPageFeedbackOption)
    }

    const contentFeedbackOption = this.getContentFeedbackOption()
    if (contentFeedbackOption) {
      options.push(contentFeedbackOption)
    }

    this.getOffersFeedbackOptions().forEach(option => options.push(option))
    options.push(this.getTechnicalFeedbackVariant())

    return options
  }

  getTechnicalFeedbackVariant = () => {
    return new FeedbackVariant({
      label: this.props.t('technicalTopics'),
      feedbackType: CATEGORIES_FEEDBACK_TYPE,
      feedbackCategory: TECHNICAL_FEEDBACK_CATEGORY
    })
  }

  getContentFeedbackOption = (): ?FeedbackVariant => {
    const { navigation, t } = this.props
    const cityName = this.getCityName()

    if (cityName) {
      const label = t('contentOfCity', { city: cityName })
      const feedbackCategory = CONTENT_FEEDBACK_CATEGORY
      const feedbackType = navigation.getParam('type')
      switch (feedbackType) {
        case 'Event':
          return new FeedbackVariant({ label, feedbackType: EVENTS_FEEDBACK_TYPE, feedbackCategory })
        case 'Offers':
          return new FeedbackVariant({ label, feedbackType: OFFERS_FEEDBACK_TYPE, feedbackCategory })
        default:
          return new FeedbackVariant({ label, feedbackType: CATEGORIES_FEEDBACK_TYPE, feedbackCategory })
      }
    }
  }

  getOffersFeedbackOptions = (): Array<FeedbackVariant> => {
    const { t } = this.props
    const { offers } = this.props.navigation.state.params
    if (offers) {
      return offers.map(offer =>
        new FeedbackVariant({
          label: t('contentOfOffer', { offer: offer.title }),
          feedbackType: OFFER_FEEDBACK_TYPE,
          feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
          alias: offer.alias
        })
      )
    }
    return []
  }

  closeModal = () => this.props.navigation.goBack()

  getCurrentPageFeedbackOption = (): ?FeedbackVariant => {
    const { navigation, t } = this.props
    const { type, path, title, feedbackAlias } = navigation.state.params

    const feedbackCategory = CONTENT_FEEDBACK_CATEGORY
    if (type === 'Category' && path && title) {
      return new FeedbackVariant({
        label: t('contentOfPage', { page: title }),
        feedbackType: PAGE_FEEDBACK_TYPE,
        feedbackCategory
      })
    } else if (type === 'Pois' && path && title) {
      return new FeedbackVariant({
        label: t('contentOfPoi', { poi: title }),
        feedbackType: PAGE_FEEDBACK_TYPE,
        feedbackCategory
      })
    } else if (type === 'Event' && path && title) {
      return new FeedbackVariant({
        label: t('contentOfEvent', { event: title }),
        feedbackType: PAGE_FEEDBACK_TYPE,
        feedbackCategory
      })
    } else if (type === 'Offers' && feedbackAlias && title) {
      return new FeedbackVariant({
        label: t('contentOfOffer', { offer: title }),
        feedbackType: OFFER_FEEDBACK_TYPE,
        feedbackCategory
      })
    } else if (type === 'Disclaimer') {
      return new FeedbackVariant({
        label: `${t('disclaimer')}`,
        feedbackType: PAGE_FEEDBACK_TYPE,
        feedbackCategory
      })
    } else {
      return null
    }
  }

  getFeedbackData = (selectedFeedbackOption: FeedbackVariant, comment: string): FeedbackParamsType => {
    const { navigation } = this.props
    const feedbackInformation = navigation.state.params
    const isOfferOptionSelected = selectedFeedbackOption.feedbackType === OFFER_FEEDBACK_TYPE
    const alias = feedbackInformation.feedbackAlias || (isOfferOptionSelected && selectedFeedbackOption.alias) || ''
    const city = this.getCityName().toLocaleLowerCase(feedbackInformation.language)

    return {
      feedbackType: selectedFeedbackOption.feedbackType,
      feedbackCategory: selectedFeedbackOption.feedbackCategory,
      isPositiveRating: feedbackInformation.isPositiveFeedback,
      permalink: feedbackInformation.path,
      city,
      language: feedbackInformation.language || DEFAULT_FEEDBACK_LANGUAGE,
      comment,
      alias
    }
  }

  onFeedbackOptionChanged = (value: string | number, index: number) => this.setState(
    { selectedFeedbackIndex: index }
  )

  onFeedbackCommentChanged = (comment: string) => this.setState({ comment })

  handleSubmit = async () => {
    const { selectedFeedbackIndex, feedbackOptions, comment } = this.state
    const feedbackItem = feedbackOptions[selectedFeedbackIndex]
    const feedbackData = this.getFeedbackData(feedbackItem, comment)
    this.setState({ sendingStatus: 'sending' })
    try {
      const apiUrl = await determineApiUrl()
      const feedbackEndpoint = createFeedbackEndpoint(apiUrl)
      console.log(feedbackEndpoint.request)
      await feedbackEndpoint.request(feedbackData)
      this.setState({ sendingStatus: 'successful' })
    } catch (e) {
      console.error(e)
      this.setState({ sendingStatus: 'failed' })
    }
  }

  render () {
    const { navigation } = this.props
    const { comment, selectedFeedbackIndex, feedbackOptions, sendingStatus } = this.state
    const { isPositiveFeedback } = navigation.state.params

    return <ThemedTranslatedFeedbackModal closeModal={this.closeModal}
                          comment={comment}
                          selectedFeedbackIndex={selectedFeedbackIndex}
                          sendingStatus={sendingStatus}
                          feedbackOptions={feedbackOptions}
                          onCommentChanged={this.onFeedbackCommentChanged}
                          onFeedbackOptionChanged={this.onFeedbackOptionChanged}
                          isPositiveFeedback={isPositiveFeedback}
                          onSubmit={this.handleSubmit} />
  }
}

const ThemedTranslatedFeedbackModal = withTheme(
  withTranslation('feedback')(FeedbackModal)
)

const ThemedTranslatedFeedbackContainer = withTranslation('feedback')(
  FeedbackModalContainer
)

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
  withPayloadProvider<ContainerPropsType, RefreshPropsType>(refresh)(
    ThemedTranslatedFeedbackContainer
  )
)
