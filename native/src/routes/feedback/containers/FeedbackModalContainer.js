// @flow

import * as React from 'react'
import type { NavigationLeafRoute, NavigationScreenProp } from 'react-navigation'
import { withTranslation } from 'react-i18next'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FeedbackModal from '../components/FeedbackModal'
import FeedbackVariant from '../FeedbackVariant'
import {
  CATEGORIES_FEEDBACK_TYPE,
  CONTENT_FEEDBACK_CATEGORY,
  createFeedbackEndpoint, DEFAULT_FEEDBACK_LANGUAGE, EVENTS_FEEDBACK_TYPE, INTEGREAT_INSTANCE,
  OFFER_FEEDBACK_TYPE, OfferModel,
  PAGE_FEEDBACK_TYPE,
  SEARCH_FEEDBACK_TYPE, TECHNICAL_FEEDBACK_CATEGORY
} from 'api-client'
import type { FeedbackParamsType } from 'api-client'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'
import type { ThemeType } from 'build-configs/ThemeType'
import type { TFunction } from 'react-i18next'

type FeedbackType = 'Category' | 'Event' | 'Pois' | 'Offers' | 'Search' | 'Disclaimer'

export type FeedbackInformationType = {
  type: FeedbackType,
  isPositiveFeedback: boolean,
  language?: string,
  cityTitle?: string,
  path?: string,
  title?: string,
  feedbackAlias?: string,
  query?: string,
  offers?: Array<OfferModel>
}

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

type PropsType = {|
  navigation: NavigationScreenProp<{|...NavigationLeafRoute, params: FeedbackInformationType |}>,
  t: TFunction,
  theme: ThemeType
|}

type StateType = {|
  feedbackOptions: Array<FeedbackVariant>,
  selectedFeedbackIndex: number,
  comment: string,
  sendingStatus: SendingStatusType
|}

class FeedbackModalContainer extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    const feedbackOptions = this.getFeedbackOptions()
    this.state = { feedbackOptions, selectedFeedbackIndex: 0, comment: '', sendingStatus: 'idle' }
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
    const cityTitle = navigation.getParam('cityTitle')

    if (cityTitle) {
      const label = t('contentOfCity', { city: cityTitle })
      const feedbackCategory = CONTENT_FEEDBACK_CATEGORY

      return new FeedbackVariant({
        label,
        feedbackType: EVENTS_FEEDBACK_TYPE,
        feedbackCategory
      })
    }
  }

  getOffersFeedbackOptions = (): Array<FeedbackVariant> => {
    const { t } = this.props
    const { offers } = this.props.navigation.state.params
    if (offers) {
      return offers.map(offer =>
        new FeedbackVariant({
          label: t('contentOfOffer', { offer: offer.title}),
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
    const { type, path, title, feedbackAlias, query } = navigation.state.params

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
    } else if (type === 'Search' && query) {
      return new FeedbackVariant({
        label: `${t('searchFor')} '${query}'`,
        feedbackType: SEARCH_FEEDBACK_TYPE,
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

    return {
      feedbackType: selectedFeedbackOption.feedbackType,
      feedbackCategory: selectedFeedbackOption.feedbackCategory,
      isPositiveRating: navigation.getParam('isPositiveFeedback'),
      permalink: feedbackInformation.path,
      city: feedbackInformation.cityTitle || INTEGREAT_INSTANCE,
      language: feedbackInformation.language || DEFAULT_FEEDBACK_LANGUAGE,
      query: feedbackInformation.query,
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
      await feedbackEndpoint.request(feedbackData)
      this.setState({ sendingStatus: 'successful' })
    } catch (e) {
      console.error(e)
      this.setState({ sendingStatus: 'failed' })
    }
  }

  render () {
    const { navigation, theme, t } = this.props
    const { comment, selectedFeedbackIndex, feedbackOptions, sendingStatus } = this.state
    const { isPositiveFeedback } = navigation.state.params

    return <FeedbackModal closeModal={this.closeModal}
                          comment={comment}
                          selectedFeedbackIndex={selectedFeedbackIndex}
                          sendingStatus={sendingStatus}
                          feedbackOptions={feedbackOptions}
                          onCommentChanged={this.onFeedbackCommentChanged}
                          onFeedbackOptionChanged={this.onFeedbackOptionChanged}
                          isPositiveFeedback={isPositiveFeedback}
                          onSubmit={this.handleSubmit}
                          theme={theme} t={t} />
  }
}

export default withTranslation('feedback')(withTheme(FeedbackModalContainer))
