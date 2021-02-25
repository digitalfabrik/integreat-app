// @flow

import * as React from 'react'

import {
  CATEGORIES_FEEDBACK_TYPE,
  CityModel,
  createFeedbackEndpoint,
  DEFAULT_FEEDBACK_LANGUAGE,
  EVENTS_FEEDBACK_TYPE,
  OfferModel,
  OFFER_FEEDBACK_TYPE,
  INTEGREAT_INSTANCE,
  PAGE_FEEDBACK_TYPE,
  SEARCH_FEEDBACK_TYPE,
  CONTENT_FEEDBACK_CATEGORY,
  TECHNICAL_FEEDBACK_CATEGORY
} from 'api-client'
import { withTranslation, TFunction } from 'react-i18next'
import type { LocationState } from 'redux-first-router'
import FeedbackVariant from '../FeedbackVariant'
import FeedbackBox from './FeedbackBox'
import { EVENTS_ROUTE } from '../../app/route-configs/EventsRouteConfig'
import { OFFERS_ROUTE } from '../../app/route-configs/OffersRouteConfig'
import { CATEGORIES_ROUTE } from '../../app/route-configs/CategoriesRouteConfig'
import { WOHNEN_ROUTE } from '../../app/route-configs/WohnenRouteConfig'
import { SPRUNGBRETT_ROUTE } from '../../app/route-configs/SprungbrettRouteConfig'
import { POIS_ROUTE } from '../../app/route-configs/PoisRouteConfig'
import { SEARCH_ROUTE } from '../../app/route-configs/SearchRouteConfig'
import { DISCLAIMER_ROUTE } from '../../app/route-configs/DisclaimerRouteConfig'
import { cmsApiBaseUrl } from '../../app/constants/urls'
import type { ThemeType } from '../../theme/constants/theme'
import type { SendingStatusType } from './FeedbackModal'
import type { FeedbackParamsType } from 'api-client'

type PropsType = {|
  cities: ?Array<CityModel>,
  title?: string,
  alias?: string,
  path?: string,
  query?: string,
  isPositiveRatingSelected: boolean,
  location: LocationState,
  offers: ?Array<OfferModel>,
  postFeedbackDataOverride?: FeedbackParamsType => void,
  closeFeedbackModal: () => void,
  sendingStatus: SendingStatusType,
  onSubmit: (sendingStatus: SendingStatusType) => void,
  t: typeof TFunction,
  theme: ThemeType
|}

type StateType = {|
  feedbackOptions: Array<FeedbackVariant>,
  selectedFeedbackOption: FeedbackVariant,
  comment: string,
  contactMail: string
|}

/**
 * Renders a FeedbackBox with all possible feedback options the User can select
 */
export class FeedbackBoxContainer extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    const feedbackOptions = this.getFeedbackOptions()
    this.state = { feedbackOptions, selectedFeedbackOption: feedbackOptions[0], comment: '', contactMail: '' }
  }

  postFeedbackData = async (feedbackData: FeedbackParamsType) => {
    const { postFeedbackDataOverride } = this.props
    if (postFeedbackDataOverride) {
      postFeedbackDataOverride(feedbackData)
    } else {
      await createFeedbackEndpoint(cmsApiBaseUrl).request(feedbackData)
    }
  }

  /**
   * Returns all feedback options which are:
   * * Feedback for the current page if it isn't the categories/events/offers page
   * * Feedback for the content of the current city if the current route is a LocationRoute
   * * Feedback for all available offers if the current page is the offers page
   * * Feedback for technical topics
   */
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

  /**
   * Returns a feedback option for the content of the current city
   */
  getContentFeedbackOption = (): ?FeedbackVariant => {
    const { cities, location, t } = this.props
    const { city } = location.payload
    const currentRoute = location.type
    const cityTitle = city && cities && CityModel.findCityName(cities, city)

    if (cityTitle) {
      const label = t('contentOfCity', { city: cityTitle })
      const feedbackCategory = CONTENT_FEEDBACK_CATEGORY

      // We don't want to differ between the content of categories, offers and events for the user, but we want to know
      // from which route the feedback was sent
      // TODO: add POIS_ROUTE in IGAPP-438
      switch (currentRoute) {
        case EVENTS_ROUTE:
          return new FeedbackVariant({ label, feedbackType: EVENTS_FEEDBACK_TYPE, feedbackCategory })
        case OFFERS_ROUTE:
          return new FeedbackVariant({ label, feedbackType: OFFER_FEEDBACK_TYPE, feedbackCategory })
        default:
          return new FeedbackVariant({ label, feedbackType: CATEGORIES_FEEDBACK_TYPE, feedbackCategory })
      }
    }
  }

  /**
   * Returns a feedback option for every available offer
   */
  getOffersFeedbackOptions = (): Array<FeedbackVariant> => {
    const { offers, location, t } = this.props
    const currentRoute = location.type
    if (offers && currentRoute === OFFERS_ROUTE) {
      return offers.map(offer =>
        new FeedbackVariant({
          label: `${t('offer')} '${offer.title}'`,
          feedbackType: OFFER_FEEDBACK_TYPE,
          feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
          alias: offer.alias
        })
      )
    }
    return []
  }

  /**
   * Returns a feedback option for the current page or null if there shouldn't be one
   */
  getCurrentPageFeedbackOption = (): ?FeedbackVariant => {
    const { location, path, alias, title, query, t } = this.props
    const type = location.type

    const feedbackCategory = CONTENT_FEEDBACK_CATEGORY
    if (type === CATEGORIES_ROUTE && path && title && location.payload.categoryPath) {
      return new FeedbackVariant({
        label: t('contentOfPage', { page: title }),
        feedbackType: PAGE_FEEDBACK_TYPE,
        feedbackCategory
      })
    } else if (type === EVENTS_ROUTE && path && title) {
      return new FeedbackVariant({
        label: t('contentOfEvent', { event: title }),
        feedbackType: PAGE_FEEDBACK_TYPE,
        feedbackCategory
      })
    } else if (type === POIS_ROUTE && path && title) {
      return new FeedbackVariant({
        label: t('contentOfPoi', { poi: title }),
        feedbackType: PAGE_FEEDBACK_TYPE,
        feedbackCategory
      })
    } else if (([WOHNEN_ROUTE, SPRUNGBRETT_ROUTE].includes(type)) && alias && title) {
      return new FeedbackVariant({
        label: t('contentOfOffer', { offer: title }),
        feedbackType: OFFER_FEEDBACK_TYPE,
        feedbackCategory
      })
    } else if (type === SEARCH_ROUTE && query) {
      return new FeedbackVariant({
        label: `${t('searchFor')} '${query}'`,
        feedbackType: SEARCH_FEEDBACK_TYPE,
        feedbackCategory
      })
    } else if (type === DISCLAIMER_ROUTE) {
      return new FeedbackVariant({
        label: `${t('disclaimer')}`,
        feedbackType: PAGE_FEEDBACK_TYPE,
        feedbackCategory
      })
    } else {
      return null
    }
  }

  /**
   * Returns the data that should be posted to the feedback endpoint
   */
  getFeedbackData = (selectedFeedbackOption: FeedbackVariant, comment: string): FeedbackParamsType => {
    const { location, query, isPositiveRatingSelected, path, alias } = this.props
    const { city, language } = location.payload
    const isOfferOptionSelected = selectedFeedbackOption.feedbackType === OFFER_FEEDBACK_TYPE
    const feedbackAlias = alias || (isOfferOptionSelected && selectedFeedbackOption.alias) || ''

    return {
      feedbackType: selectedFeedbackOption.feedbackType,
      feedbackCategory: selectedFeedbackOption.feedbackCategory,
      isPositiveRating: isPositiveRatingSelected,
      comment,
      permalink: path,
      city: city || INTEGREAT_INSTANCE,
      language: language || DEFAULT_FEEDBACK_LANGUAGE,
      alias: feedbackAlias,
      query
    }
  }

  handleCommentChanged = (event: SyntheticInputEvent<HTMLTextAreaElement>) =>
    this.setState({ comment: event.target.value })

  handleContactMailChanged = (event: SyntheticInputEvent<HTMLInputElement>) =>
    this.setState({ contactMail: event.target.value })

  handleFeedbackOptionChanged = (selectedDropdown: FeedbackVariant) => {
    this.setState(prevState => ({
      selectedFeedbackOption: prevState.feedbackOptions.find(option => option.label === selectedDropdown.label)
    }))
  }

  handleSubmit = async () => {
    const { onSubmit } = this.props
    const { selectedFeedbackOption, comment, contactMail } = this.state
    try {
      await this.postFeedbackData(
        this.getFeedbackData(selectedFeedbackOption, `${comment}\m\nKontakt Adresse: ${contactMail}`))
      onSubmit('SUCCESS')
    } catch (e) {
      console.error(e)
      onSubmit('ERROR')
    }
  }

  render () {
    const { closeFeedbackModal, isPositiveRatingSelected, theme, sendingStatus } = this.props

    return <FeedbackBox onFeedbackOptionChanged={this.handleFeedbackOptionChanged}
                        onCommentChanged={this.handleCommentChanged}
                        onContactMailChanged={this.handleContactMailChanged}
                        onSubmit={this.handleSubmit}
                        sendingStatus={sendingStatus}
                        closeFeedbackModal={closeFeedbackModal}
                        isPositiveRatingSelected={isPositiveRatingSelected}
                        theme={theme}
                        {...this.state} />
  }
}

export default withTranslation('feedback')(FeedbackBoxContainer)
