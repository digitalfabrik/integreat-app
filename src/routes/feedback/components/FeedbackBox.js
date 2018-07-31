// @flow

import * as React from 'react'
import 'react-dropdown/style.css'

import CityModel from '../../../modules/endpoint/models/CityModel'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import FeedbackEndpoint, {
  CATEGORIES_FEEDBACK_TYPE,
  DEFAULT_FEEDBACK_LANGUAGE,
  EXTRA_FEEDBACK_TYPE,
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
import { EXTRAS_ROUTE } from '../../../modules/app/routes/extras'
import { SEARCH_ROUTE } from '../../../modules/app/routes/search'
import { DISCLAIMER_ROUTE } from '../../../modules/app/routes/disclaimer'
import FeedbackHeader from './FeedbackHeader'
import FeedbackComment from './FeedbackComment'
import type { LocationState } from 'redux-first-router'
import { goToFeedback } from '../../../modules/app/routes/feedback'
import FeedbackDropdownItem from '../FeedbackDropdownItem'

const StyledFeedbackBox = styled.div`
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

const SubmitButton = styled(CleanLink)`
  margin: 15px 0;
  padding: 5px;
  background-color: ${props => props.theme.colors.themeColor};
  color: ${props => props.theme.colors.backgroundAccentColor};
  text-align: center;
  border-radius: 0.25em;
`

type PropsType = {
  cities: Array<CityModel>,
  title?: string,
  alias?: string,
  id?: number,
  query?: string,
  isPositiveRatingSelected: boolean,
  location: LocationState,
  isOpen: boolean,
  commentMessageOverride: ?string,
  hideHeader: boolean,
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
    this.setState({selectedFeedbackOption: selectedDropdown})
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
      alias,
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

    const options = []
    const currentPageFeedbackLabel = this.getCurrentPageFeedbackLabel()
    if (currentPageFeedbackLabel) {
      options.push(this.getFeedbackOption(currentPageFeedbackLabel, this.getCurrentPageFeedbackType()))
    }
    if (city) {
      const cityTitle = CityModel.findCityName(cities, city)
      options.push(this.getFeedbackOption(`${t('contentOfCity')} ${cityTitle}`, CATEGORIES_FEEDBACK_TYPE))
    }

    options.push(this.getFeedbackOption(t('technicalTopic'), CATEGORIES_FEEDBACK_TYPE))

    return options
  }

  getFeedbackOption = (label: string, feedbackType: ?string): FeedbackDropdownItem =>
    new FeedbackDropdownItem(label, feedbackType)

  getCurrentPageFeedbackLabel = (): ?string => {
    const {location, id, alias, title, query, t} = this.props
    const type = location.type

    if (type === CATEGORIES_ROUTE && id && title) {
      return `${t('contentOfPage')} '${title}'`
    } else if (type === EVENTS_ROUTE && id && title) {
      return `${t('news')} '${title}'`
    } else if (type === EXTRAS_ROUTE && alias && title) {
      return `${t('extra')} '${title}'`
    } else if (type === SEARCH_ROUTE && query) {
      return `${t('searchFor')} '${query}'`
    } else if (type === DISCLAIMER_ROUTE) {
      return `${t('disclaimer')}`
    } else {
      return null
    }
  }

  getCurrentPageFeedbackType = (): string | null => {
    const {type} = this.props.location
    if (type === SEARCH_ROUTE) {
      return SEARCH_FEEDBACK_TYPE
    } else if (type === EXTRAS_ROUTE) {
      return EXTRA_FEEDBACK_TYPE
    } else {
      return PAGE_FEEDBACK_TYPE
    }
  }

  render () {
    const {selectedFeedbackOption, feedbackOptions, comment} = this.state
    const {t, isPositiveRatingSelected, location, commentMessageOverride, hideHeader} = this.props
    return (
      <StyledFeedbackBox>
        {!hideHeader && (
          <FeedbackHeader
            location={location}
            selectedFeedbackOption={selectedFeedbackOption}
            feedbackOptions={feedbackOptions}
            onFeedbackOptionChanged={this.onFeedbackOptionChanged} />
        )}
        <FeedbackComment
          comment={comment}
          commentMessageOverride={commentMessageOverride}
          isPositiveRatingSelected={isPositiveRatingSelected}
          onCommentChanged={this.onCommentChanged} />
        <SubmitButton to={goToFeedback(location)} onClick={this.onSubmit}>
          {t('send')}
        </SubmitButton>
      </StyledFeedbackBox>
    )
  }
}

export default translate('feedback')(FeedbackBox)
