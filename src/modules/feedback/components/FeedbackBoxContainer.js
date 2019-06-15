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
  SEARCH_FEEDBACK_TYPE
} from '@integreat-app/integreat-api-client'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { LocationState } from 'redux-first-router'
import FeedbackDropdownItem from '../FeedbackDropdownItem'
import FeedbackBox from './FeedbackBox'
import { EVENTS_ROUTE } from '../../app/route-configs/EventsRouteConfig'
import { EXTRAS_ROUTE } from '../../app/route-configs/ExtrasRouteConfig'
import { CATEGORIES_ROUTE } from '../../app/route-configs/CategoriesRouteConfig'
import { WOHNEN_ROUTE } from '../../app/route-configs/WohnenRouteConfig'
import { SPRUNGBRETT_ROUTE } from '../../app/route-configs/SprungbrettRouteConfig'
import { SEARCH_ROUTE } from '../../app/route-configs/SearchRouteConfig'
import { DISCLAIMER_ROUTE } from '../../app/route-configs/DisclaimerRouteConfig'
import { cmsApiBaseUrl } from '../../app/constants/urls'

type PropsType = {|
  cities: ?Array<CityModel>,
  title?: string,
  alias?: string,
  id?: number,
  query?: string,
  isPositiveRatingSelected: boolean,
  location: LocationState,
  extras: ?Array<ExtraModel>,
  postFeedbackDataOverride?: FeedbackParamsType => void,
  closeFeedbackModal: () => void,
  onSubmit: () => void,
  t: TFunction
|}

type StateType = {|
  feedbackOptions: Array<FeedbackDropdownItem>,
  selectedFeedbackOption: FeedbackDropdownItem,
  comment: string
|}

/**
 * Renders a FeedbackBox with all possible feedback options the User can select
 */
export class FeedbackBoxContainer extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    const feedbackOptions = this.getFeedbackOptions()
    this.state = {feedbackOptions: feedbackOptions, selectedFeedbackOption: feedbackOptions[0], comment: ''}
  }

  postFeedbackData = (feedbackData: FeedbackParamsType) => {
    const {postFeedbackDataOverride} = this.props

    if (postFeedbackDataOverride) {
      postFeedbackDataOverride(feedbackData)
    } else {
      createFeedbackEndpoint(cmsApiBaseUrl).request(feedbackData)
    }
  }

  /**
   * Returns all feedback options which are:
   * * Feedback for the current page if it isn't the categories/events/extras page
   * * Feedback for the content of the current city if the current route is a LocationRoute
   * * Feedback for all available extras if the current page is the extras page
   * * Feedback for technical topics
   */
  getFeedbackOptions = (): Array<FeedbackDropdownItem> => {
    const {t} = this.props

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
    options.push(new FeedbackDropdownItem(t('technicalTopics'), CATEGORIES_FEEDBACK_TYPE))

    return options
  }

  /**
   * Returns a feedback option for the content of the current city
   */
  getContentFeedbackOption = (): ?FeedbackDropdownItem => {
    const {cities, location, t} = this.props
    const {city} = location.payload
    const currentRoute = location.type

    if (city && cities) {
      const cityTitle = CityModel.findCityName(cities, city)
      let feedbackType
      if (currentRoute === EVENTS_ROUTE) {
        feedbackType = EVENTS_FEEDBACK_TYPE
      } else if (currentRoute === EXTRAS_ROUTE) {
        feedbackType = EXTRAS_FEEDBACK_TYPE
      } else {
        feedbackType = CATEGORIES_FEEDBACK_TYPE
      }
      // We don't want to differ between the content of categories, extras and events for the user, but we want to know
      // from which route the feedback was sent
      return new FeedbackDropdownItem(`${t('contentOfCity')} ${cityTitle}`, feedbackType)
    }
  }

  /**
   * Returns a feedback option for every available extra
   */
  getExtrasFeedbackOptions = (): Array<FeedbackDropdownItem> => {
    const {extras, location, t} = this.props
    const currentRoute = location.type
    if (extras && currentRoute === EXTRAS_ROUTE) {
      return extras.map(
        extra => new FeedbackDropdownItem(`${t('extra')} '${extra.title}'`, EXTRA_FEEDBACK_TYPE, extra.alias)
      )
    }
    return []
  }

  /**
   * Returns a feedback option for the current page or null if there shouldn't be one
   */
  getCurrentPageFeedbackOption = (): ?FeedbackDropdownItem => {
    const {location, id, alias, title, query, t} = this.props
    const type = location.type

    if (type === CATEGORIES_ROUTE && id && title) {
      return new FeedbackDropdownItem(`${t('contentOfPage')} '${title}'`, PAGE_FEEDBACK_TYPE)
    } else if (type === EVENTS_ROUTE && id && title) {
      return new FeedbackDropdownItem(`${t('news')} '${title}'`, PAGE_FEEDBACK_TYPE)
    } else if (([WOHNEN_ROUTE, SPRUNGBRETT_ROUTE].includes(type)) && alias && title) {
      return new FeedbackDropdownItem(`${t('extra')} '${title}'`, EXTRA_FEEDBACK_TYPE)
    } else if (type === SEARCH_ROUTE && query) {
      return new FeedbackDropdownItem(`${t('searchFor')} '${query}'`, SEARCH_FEEDBACK_TYPE)
    } else if (type === DISCLAIMER_ROUTE) {
      return new FeedbackDropdownItem(`${t('disclaimer')}`, PAGE_FEEDBACK_TYPE)
    } else {
      return null
    }
  }

  /**
   * Returns the data that should be posted to the feedback endpoint
   */
  getFeedbackData = (selectedFeedbackOption: FeedbackDropdownItem, comment: string): FeedbackParamsType => {
    const {location, query, isPositiveRatingSelected, id, alias} = this.props
    const {city, language} = location.payload

    const isExtraOptionSelected = selectedFeedbackOption.feedbackType === EXTRA_FEEDBACK_TYPE
    const feedbackAlias = alias || (isExtraOptionSelected ? selectedFeedbackOption.value : '')

    return {
      feedbackType: selectedFeedbackOption.feedbackType,
      isPositiveRating: isPositiveRatingSelected,
      comment,
      id,
      city: city || INTEGREAT_INSTANCE,
      language: language || DEFAULT_FEEDBACK_LANGUAGE,
      alias: feedbackAlias,
      query
    }
  }

  onCommentChanged = (event: SyntheticInputEvent<HTMLTextAreaElement>) => this.setState({comment: event.target.value})

  onFeedbackOptionChanged = (selectedDropdown: FeedbackDropdownItem) => {
    this.setState(prevState =>
      ({selectedFeedbackOption: prevState.feedbackOptions.find(option => option.value === selectedDropdown.value)})
    )
  }

  onSubmit = () => {
    const {selectedFeedbackOption, comment} = this.state
    this.postFeedbackData(this.getFeedbackData(selectedFeedbackOption, comment))
    this.props.onSubmit()
  }

  render () {
    const {closeFeedbackModal, isPositiveRatingSelected} = this.props
    return <FeedbackBox onFeedbackOptionChanged={this.onFeedbackOptionChanged}
                        onCommentChanged={this.onCommentChanged}
                        onSubmit={this.onSubmit}
                        closeFeedbackModal={closeFeedbackModal}
                        isPositiveRatingSelected={isPositiveRatingSelected}
                        {...this.state} />
  }
}

export default withTranslation('feedback')(FeedbackBoxContainer)
