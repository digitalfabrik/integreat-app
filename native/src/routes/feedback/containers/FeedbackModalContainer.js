// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { type Dispatch } from 'redux'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FeedbackModal, { type PropsType as FeedbackModalPropsType } from '../components/FeedbackModal'
import FeedbackVariant from '../FeedbackVariant'
import type { FeedbackParamsType } from 'api-client'
import {
  CATEGORIES_FEEDBACK_TYPE,
  CityModel,
  CONTENT_FEEDBACK_CATEGORY,
  createFeedbackEndpoint,
  DEFAULT_FEEDBACK_LANGUAGE,
  EVENTS_FEEDBACK_TYPE,
  OFFER_FEEDBACK_TYPE,
  OfferModel,
  OFFERS_FEEDBACK_TYPE,
  PAGE_FEEDBACK_TYPE,
  TECHNICAL_FEEDBACK_CATEGORY
} from 'api-client'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'
import type { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/endpoint/hocs/withPayloadProvider'
import type { StateType } from '../../../modules/app/StateType'
import createNavigateToFeedbackModal from '../../../modules/navigation/createNavigateToFeedbackModal'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import type { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import type { FeedbackModalRouteType } from 'api-client/src/routes'

type FeedbackType = 'Category' | 'Event' | 'Pois' | 'Offers' | 'Disclaimer'

export type FeedbackInformationType = {|
  type: FeedbackType,
  isPositiveFeedback: boolean,
  language: string,
  cityCode: string,
  path?: string,
  title?: string,
  alias?: string,
  offers?: Array<OfferModel>
|}

type OwnPropsType = {|
  route: RoutePropType<FeedbackModalRouteType>,
  navigation: NavigationPropType<FeedbackModalRouteType>
|}
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}

type InnerPropsType = {|
  ...OwnPropsType,
  ...DispatchPropsType,
  cities: $ReadOnlyArray<CityModel>
|}

type StatePropsType = StatusPropsType<InnerPropsType, OwnPropsType>
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const refreshProps = ownProps
  if (state.cities.status === 'error') {
    return { status: 'error', message: state.cities.message, code: state.cities.code, refreshProps }
  }

  if (state.cities.status === 'loading') {
    return { status: 'loading', progress: 0 }
  }
  return {
    status: 'success',
    innerProps: {
      ...ownProps,
      cities: state.cities.models
    },
    refreshProps
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({ dispatch })

const refresh = (refreshProps: OwnPropsType) => {
  const { navigation } = refreshProps
  const navigateToFeedback = createNavigateToFeedbackModal(navigation)
  navigateToFeedback(refreshProps.route.params)
}

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

type FeedbackModalStateType = {|
  feedbackOptions: Array<FeedbackVariant>,
  selectedFeedbackIndex: number,
  comment: string,
  contactMail: string,
  sendingStatus: SendingStatusType
|}

type ContainerPropsType = {|
  ...InnerPropsType,
  t: TFunction
|}

class FeedbackModalContainer extends React.Component<ContainerPropsType, FeedbackModalStateType> {
  constructor(props: ContainerPropsType) {
    super(props)
    const feedbackOptions = this.getFeedbackOptions()
    this.state = { feedbackOptions, selectedFeedbackIndex: 0, comment: '', contactMail: '', sendingStatus: 'idle' }
  }

  getCityName = (): string => {
    const { cities, route } = this.props
    const cityCode = route.params.cityCode

    return CityModel.findCityName(cities, cityCode)
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

    options.push(...this.getOffersFeedbackOptions(), this.getTechnicalFeedbackVariant())

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
    const { route, t } = this.props
    const cityName = this.getCityName()

    const label = t('contentOfCity', { city: cityName })
    const feedbackCategory = CONTENT_FEEDBACK_CATEGORY
    const feedbackType = route.params.type

    // TODO: add 'POIS' in IGAPP-438
    switch (feedbackType) {
      case 'Event':
        return new FeedbackVariant({ label, feedbackType: EVENTS_FEEDBACK_TYPE, feedbackCategory })
      case 'Offers':
        return new FeedbackVariant({ label, feedbackType: OFFERS_FEEDBACK_TYPE, feedbackCategory })
      default:
        return new FeedbackVariant({ label, feedbackType: CATEGORIES_FEEDBACK_TYPE, feedbackCategory })
    }
  }

  getOffersFeedbackOptions = (): Array<FeedbackVariant> => {
    const { route, t } = this.props
    const { offers } = route.params
    if (offers) {
      return offers.map(
        offer =>
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

  getCurrentPageFeedbackOption = (): ?FeedbackVariant => {
    const { route, t } = this.props
    const { type, path, title, alias } = route.params

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
    } else if (type === 'Offers' && alias && title) {
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
    const { route } = this.props
    const feedbackInformation = route.params
    const isOfferOptionSelected = selectedFeedbackOption.feedbackType === OFFER_FEEDBACK_TYPE
    const alias = feedbackInformation.alias || (isOfferOptionSelected && selectedFeedbackOption.alias) || ''
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

  onFeedbackOptionChanged = (value: string | number, index: number) => this.setState({ selectedFeedbackIndex: index })

  onFeedbackCommentChanged = (comment: string) => this.setState({ comment })

  onFeedbackContactMailChanged = (contactMail: string) => this.setState({ contactMail })

  handleSubmit = async () => {
    const { selectedFeedbackIndex, feedbackOptions, comment, contactMail } = this.state
    const feedbackItem = feedbackOptions[selectedFeedbackIndex]
    const feedbackData = this.getFeedbackData(
      feedbackItem,
      `${comment}    Kontaktadresse: ${contactMail || 'Keine Angabe'}`
    )
    this.setState({ sendingStatus: 'sending' })
    try {
      const apiUrl = await determineApiUrl()
      const feedbackEndpoint = createFeedbackEndpoint(apiUrl)
      await feedbackEndpoint.request(feedbackData)
      this.setState({ sendingStatus: 'successful' })
    } catch (e) {
      console.error(e)
      this.setState({ sendingStatus: 'failed' })
    }
  }

  render() {
    const { route, t } = this.props
    const { comment, contactMail, selectedFeedbackIndex, feedbackOptions, sendingStatus } = this.state
    const { isPositiveFeedback } = route.params

    return (
      <ThemedFeedbackModal
        comment={comment}
        contactMail={contactMail}
        selectedFeedbackIndex={selectedFeedbackIndex}
        sendingStatus={sendingStatus}
        feedbackOptions={feedbackOptions}
        onCommentChanged={this.onFeedbackCommentChanged}
        onFeedbackContactMailChanged={this.onFeedbackContactMailChanged}
        onFeedbackOptionChanged={this.onFeedbackOptionChanged}
        isPositiveFeedback={isPositiveFeedback}
        onSubmit={this.handleSubmit}
        t={t}
      />
    )
  }
}

const ThemedFeedbackModal = withTheme<FeedbackModalPropsType>(FeedbackModal)

const ThemedTranslatedFeedbackContainer = withTranslation<ContainerPropsType>('feedback')(FeedbackModalContainer)

export default connect<PropsType, OwnPropsType, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(withPayloadProvider<InnerPropsType, OwnPropsType, FeedbackModalRouteType>(refresh)(ThemedTranslatedFeedbackContainer))
