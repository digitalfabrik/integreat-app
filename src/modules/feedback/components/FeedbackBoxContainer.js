// @flow

import * as React from 'react'

import {
  CATEGORIES_FEEDBACK_TYPE,
  CityModel,
  createFeedbackEndpoint,
  DEFAULT_FEEDBACK_LANGUAGE,
  EVENTS_FEEDBACK_TYPE,
  EXTRA_FEEDBACK_TYPE,
  ExtraModel,
  EXTRAS_FEEDBACK_TYPE,
  type FeedbackParamsType,
  INTEGREAT_INSTANCE,
  PAGE_FEEDBACK_TYPE,
  SEARCH_FEEDBACK_TYPE,
  CONTENT_FEEDBACK_CATEGORY,
  TECHNICAL_FEEDBACK_CATEGORY
} from '@integreat-app/integreat-api-client'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { LocationState } from 'redux-first-router'
import FeedbackVariant from '../FeedbackVariant'
import FeedbackBox from './FeedbackBox'
import { EVENTS_ROUTE } from '../../app/route-configs/EventsRouteConfig'
import { EXTRAS_ROUTE } from '../../app/route-configs/ExtrasRouteConfig'
import { CATEGORIES_ROUTE } from '../../app/route-configs/CategoriesRouteConfig'
import { WOHNEN_ROUTE } from '../../app/route-configs/WohnenRouteConfig'
import { SPRUNGBRETT_ROUTE } from '../../app/route-configs/SprungbrettRouteConfig'
import { SEARCH_ROUTE } from '../../app/route-configs/SearchRouteConfig'
import { DISCLAIMER_ROUTE } from '../../app/route-configs/DisclaimerRouteConfig'
import { cmsApiBaseUrl } from '../../app/constants/urls'
import type { ThemeType } from '../../theme/constants/theme'

type PropsType = {|
  cities: ?Array<CityModel>,
  title?: string,
  alias?: string,
  path?: string,
  query?: string,
  isPositiveRatingSelected: boolean,
  location: LocationState,
  extras: ?Array<ExtraModel>,
  postFeedbackDataOverride?: FeedbackParamsType => void,
  closeFeedbackModal: () => void,
  onSubmit: () => void,
  t: TFunction,
  theme: ThemeType
|}

type StateType = {|
  feedbackOptions: Array<FeedbackVariant>,
  selectedFeedbackOption: FeedbackVariant,
  comment: string
|}

/**
 * Renders a FeedbackBox with all possible feedback options the User can select
 */
export class FeedbackBoxContainer extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    const feedbackOptions = this.getFeedbackOptions()
    this.state = { feedbackOptions, selectedFeedbackOption: feedbackOptions[0], comment: '' }
  }

  postFeedbackData = async (feedbackData: FeedbackParamsType) => {
    const { postFeedbackDataOverride } = this.props

    try {
      if (postFeedbackDataOverride) {
        postFeedbackDataOverride(feedbackData)
      } else {
        await createFeedbackEndpoint(cmsApiBaseUrl).request(feedbackData)
      }
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Returns all feedback options which are:
   * * Feedback for the current page if it isn't the categories/events/offers page
   * * Feedback for the content of the current city if the current route is a LocationRoute
   * * Feedback for all available extras if the current page is the extras page
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

    this.getExtrasFeedbackOptions().forEach(option => options.push(option))
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

      // We don't want to differ between the content of categories, extras and events for the user, but we want to know
      // from which route the feedback was sent
      switch (currentRoute) {
        case EVENTS_ROUTE:
          return new FeedbackVariant({ label, feedbackType: EVENTS_FEEDBACK_TYPE, feedbackCategory })
        case EXTRAS_ROUTE:
          return new FeedbackVariant({ label, feedbackType: EXTRAS_FEEDBACK_TYPE, feedbackCategory })
        default:
          return new FeedbackVariant({ label, feedbackType: CATEGORIES_FEEDBACK_TYPE, feedbackCategory })
      }
    }
  }

  /**
   * Returns a feedback option for every available extra
   */
  getExtrasFeedbackOptions = (): Array<FeedbackVariant> => {
    const { extras, location, t } = this.props
    const currentRoute = location.type
    if (extras && currentRoute === EXTRAS_ROUTE) {
      return extras.map(extra =>
        new FeedbackVariant({
          label: `${t('extra')} '${extra.title}'`,
          feedbackType: EXTRA_FEEDBACK_TYPE,
          feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
          alias: extra.alias
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
    } else if (([WOHNEN_ROUTE, SPRUNGBRETT_ROUTE].includes(type)) && alias && title) {
      return new FeedbackVariant({
        label: t('contentOfExtra', { extra: title }),
        feedbackType: EXTRA_FEEDBACK_TYPE,
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

    const isExtraOptionSelected = selectedFeedbackOption.feedbackType === EXTRA_FEEDBACK_TYPE
    const feedbackAlias = alias || (isExtraOptionSelected ? selectedFeedbackOption.alias : '')

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

  handleFeedbackOptionChanged = (selectedDropdown: FeedbackVariant) => {
    this.setState(prevState => ({
      selectedFeedbackOption: prevState.feedbackOptions.find(option => option.label === selectedDropdown.label)
    }))
  }

  handleSubmit = () => {
    const { selectedFeedbackOption, comment } = this.state
    this.postFeedbackData(this.getFeedbackData(selectedFeedbackOption, comment))
    this.props.onSubmit()
  }

  render () {
    const { closeFeedbackModal, isPositiveRatingSelected, theme } = this.props
    return <FeedbackBox onFeedbackOptionChanged={this.handleFeedbackOptionChanged}
                        onCommentChanged={this.handleCommentChanged}
                        onSubmit={this.handleSubmit}
                        closeFeedbackModal={closeFeedbackModal}
                        isPositiveRatingSelected={isPositiveRatingSelected}
                        theme={theme}
                        {...this.state} />
  }
}

export default withTranslation('feedback')(FeedbackBoxContainer)
