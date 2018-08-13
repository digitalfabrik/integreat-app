// @flow

import * as React from 'react'
import 'react-dropdown/style.css'

import CityModel from '../../../modules/endpoint/models/CityModel'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import FeedbackEndpoint, {
  CATEGORIES_FEEDBACK_TYPE,
  DEFAULT_FEEDBACK_LANGUAGE, EVENTS_FEEDBACK_TYPE,
  EXTRA_FEEDBACK_TYPE, EXTRAS_FEEDBACK_TYPE,
  INTEGREAT_INSTANCE,
  PAGE_FEEDBACK_TYPE,
  SEARCH_FEEDBACK_TYPE
}
  from '../../../modules/endpoint/FeedbackEndpoint'
import type { TFunction } from 'react-i18next'
import CleanLink from '../../../modules/common/components/CleanLink'
import type { FeedbackDataType } from '../../../modules/endpoint/FeedbackEndpoint'
import { CATEGORIES_ROUTE } from '../../../modules/app/routes/categories'
import { EVENTS_ROUTE } from '../../../modules/app/routes/events'
import { SEARCH_ROUTE } from '../../../modules/app/routes/search'
import { DISCLAIMER_ROUTE } from '../../../modules/app/routes/disclaimer'
import ModalHeader from './ModalHeader'
import FeedbackComment from './FeedbackComment'
import type { LocationState } from 'redux-first-router'
import { goToFeedback } from '../../../modules/app/routes/feedback'
import FeedbackDropdownItem from '../FeedbackDropdownItem'
import Dropdown from 'react-dropdown'
import { FEEDBACK_SENT } from './FeedbackModal'
import { WOHNEN_ROUTE } from '../../../modules/app/routes/wohnen'
import { SPRUNGBRETT_ROUTE } from '../../../modules/app/routes/sprungbrett'
import { EXTRAS_ROUTE } from '../../../modules/app/routes/extras'
import ExtraModel from '../../../modules/endpoint/models/ExtraModel'

export const StyledFeedbackBox = styled.div`
  display: flex;
  width: 400px;
  height: auto;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  border-radius: 10px;
  border-color: #585858;
  font-size: ${props => props.theme.fonts.contentFontSize};
`

export const Description = styled.div`
  padding: 10px 0 5px;
`

export const SubmitButton = styled(CleanLink)`
  margin: 15px 0;
  padding: 5px;
  background-color: ${props => props.theme.colors.themeColor};
  text-align: center;
  border-radius: 0.25em;
`

type PropsType = {
  cities: ?Array<CityModel>,
  title?: string,
  alias?: string,
  id?: number,
  query?: string,
  isPositiveRatingSelected: boolean,
  location: LocationState,
  isOpen: boolean,
  extras?: Array<ExtraModel>,
  t: TFunction
}

type StateType = {
  feedbackOptions: Array<FeedbackDropdownItem>,
  selectedFeedbackOption: FeedbackDropdownItem,
  comment: string
}

export class FeedbackBox extends React.Component<PropsType, StateType> {
  static defaultProps = {
    hideHeader: false
  }
  constructor (props: PropsType) {
    super(props)
    const feedbackOptions = this.getFeedbackOptions()
    this.state = {feedbackOptions: feedbackOptions, selectedFeedbackOption: feedbackOptions[0], comment: ''}
  }

  onCommentChanged = (event: SyntheticInputEvent<HTMLTextAreaElement>) => this.setState({comment: event.target.value})

  onFeedbackOptionChanged = (selectedDropdown: FeedbackDropdownItem) => {
    this.setState(prevState =>
      ({selectedFeedbackOption: prevState.feedbackOptions.find(option => option.value === selectedDropdown.value)})
    )
  }

  componentDidUpdate (prevProps: PropsType) {
    const {isOpen} = this.props
    const prevIsOpen = prevProps.isOpen

    // If the FeedbackBox is opened, we have to reset and initialize the state
    if (prevIsOpen !== isOpen && isOpen) {
      /* eslint-disable react/no-did-update-set-state */
      const feedbackOptions = this.getFeedbackOptions()
      const selectedFeedbackOption = feedbackOptions[0]
      this.setState({feedbackOptions: feedbackOptions, selectedFeedbackOption: feedbackOptions[0], comment: ''})
      FeedbackEndpoint.postData(this.getFeedbackData(selectedFeedbackOption, ''))
    }
  }

  getFeedbackData = (selectedFeedbackOption: FeedbackDropdownItem, comment: string): FeedbackDataType => {
    const {location, query, isPositiveRatingSelected, id, alias} = this.props
    const {city, language} = location.payload
    return {
      feedbackType: selectedFeedbackOption.feedbackType,
      isPositiveRating: isPositiveRatingSelected,
      comment,
      id,
      city: city || INTEGREAT_INSTANCE,
      language: language || DEFAULT_FEEDBACK_LANGUAGE,
      alias: alias || (selectedFeedbackOption.feedbackType === EXTRA_FEEDBACK_TYPE && selectedFeedbackOption.value),
      query
    }
  }

  onSubmit = () => {
    const {selectedFeedbackOption, comment} = this.state
    FeedbackEndpoint.postData(this.getFeedbackData(selectedFeedbackOption, comment))
  }

  getFeedbackOptions = (): Array<FeedbackDropdownItem> => {
    const {cities, location, t} = this.props
    const {city} = location.payload
    const currentRoute = location.type

    const options = []
    const currentPageFeedbackOption = this.getCurrentPageFeedbackOption()
    if (currentPageFeedbackOption) {
      options.push(currentPageFeedbackOption)
    }
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
      options.push(this.getFeedbackOption(`${t('contentOfCity')} ${cityTitle}`, feedbackType))
      this.getExtrasFeedbackOptions().forEach(option => options.push(option))
    }

    options.push(this.getFeedbackOption(t('technicalTopics'), CATEGORIES_FEEDBACK_TYPE))

    return options
  }

  getFeedbackOption = (label: string, feedbackType: ?string, value?: string): FeedbackDropdownItem =>
    new FeedbackDropdownItem(label, feedbackType, value)

  getExtrasFeedbackOptions = (): Array<FeedbackDropdownItem> => {
    const {extras, location, t} = this.props
    const currentRoute = location.type
    if (extras && currentRoute === EXTRAS_ROUTE) {
      return extras.map(
        extra => this.getFeedbackOption(`${t('extra')} '${extra.title}'`, EXTRA_FEEDBACK_TYPE, extra.alias)
      )
    }
    return []
  }

  getCurrentPageFeedbackOption = (): ?FeedbackDropdownItem => {
    const {location, id, alias, title, query, t} = this.props
    const type = location.type

    if (type === CATEGORIES_ROUTE && id && title) {
      return this.getFeedbackOption(`${t('contentOfPage')} '${title}'`, PAGE_FEEDBACK_TYPE)
    } else if (type === EVENTS_ROUTE && id && title) {
      return this.getFeedbackOption(`${t('news')} '${title}'`, PAGE_FEEDBACK_TYPE)
    } else if ((type === WOHNEN_ROUTE || type === SPRUNGBRETT_ROUTE) && alias && title) {
      return this.getFeedbackOption(`${t('extra')} '${title}'`, EXTRA_FEEDBACK_TYPE)
    } else if (type === SEARCH_ROUTE && query) {
      return this.getFeedbackOption(`${t('searchFor')} '${query}'`, SEARCH_FEEDBACK_TYPE)
    } else if (type === DISCLAIMER_ROUTE) {
      return this.getFeedbackOption(`${t('disclaimer')}`, PAGE_FEEDBACK_TYPE)
    } else {
      return null
    }
  }

  render () {
    const {selectedFeedbackOption, feedbackOptions, comment} = this.state
    const {t, isPositiveRatingSelected, location} = this.props
    return (
      <StyledFeedbackBox>
        <ModalHeader location={location} title={t('feedback')} />
        <Description>{t('feedbackType')}</Description>
        <Dropdown
          value={selectedFeedbackOption}
          options={feedbackOptions}
          onChange={this.onFeedbackOptionChanged} />
        <FeedbackComment
          comment={comment}
          commentMessage={isPositiveRatingSelected ? t('positiveComment') : t('negativeComment')}
          isPositiveRatingSelected={isPositiveRatingSelected}
          onCommentChanged={this.onCommentChanged} />
        <SubmitButton to={goToFeedback(location, FEEDBACK_SENT)} onClick={this.onSubmit}>
          {t('send')}
        </SubmitButton>
      </StyledFeedbackBox>
    )
  }
}

export default translate('feedback')(FeedbackBox)
