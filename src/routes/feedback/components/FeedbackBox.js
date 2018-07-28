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

export type FeedbackDropdownType = {
  value: string,
  feedbackType: ?string,
  label: string
}

type PropsType = {
  cities: Array<CityModel>,
  city: string,
  language: string,
  id?: number,
  title?: string,
  alias?: string,
  query?: string,
  route: string,
  isPositiveRatingSelected: boolean,
  pathname: string,
  isOpen: boolean,
  commentMessageOverride: ?string,
  hideHeader: boolean,
  t: TFunction
}

type StateType = {
  feedbackOptions: Array<FeedbackDropdownType>,
  selectedFeedbackOption: FeedbackDropdownType,
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

  onCommentChanged = (event: {target: {value: string}}) => this.setState({comment: event.target.value})

  onFeedbackOptionChanged = (selectedDropdown: FeedbackDropdownType) => {
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

  getFeedbackData = (selectedFeedbackOption: FeedbackDropdownType, comment: string): FeedbackDataType => {
    const {id, city, language, alias, query, isPositiveRatingSelected} = this.props

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

  getFeedbackOptions = (): Array<FeedbackDropdownType> => {
    const {cities, city, t} = this.props
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

  getFeedbackOption = (label: string, feedbackType: ?string): FeedbackDropdownType =>
    ({value: label, feedbackType, label})

  getCurrentPageFeedbackLabel = (): ?string => {
    const {route, id, alias, title, query, t} = this.props

    if (route === CATEGORIES_ROUTE && id && title) {
      return `${t('contentOfPage')} '${title}'`
    } else if (route === EVENTS_ROUTE && id && title) {
      return `${t('news')} '${title}'`
    } else if (route === EXTRAS_ROUTE && alias && title) {
      return `${t('extra')} '${title}'`
    } else if (route === SEARCH_ROUTE && query) {
      return `${t('searchFor')} '${query}'`
    } else if (route === DISCLAIMER_ROUTE) {
      return `${t('disclaimer')}`
    } else {
      return null
    }
  }

  getCurrentPageFeedbackType = (): string | null => {
    const {route} = this.props
    if (route === SEARCH_ROUTE) {
      return SEARCH_FEEDBACK_TYPE
    } else if (route === EXTRAS_ROUTE) {
      return EXTRA_FEEDBACK_TYPE
    } else {
      return PAGE_FEEDBACK_TYPE
    }
  }

  render () {
    const {selectedFeedbackOption, feedbackOptions, comment} = this.state
    const {t, isPositiveRatingSelected, pathname, commentMessageOverride, hideHeader} = this.props
    return (
      <StyledFeedbackBox>
        {!hideHeader && (
          <FeedbackHeader
            pathname={pathname}
            selectedFeedbackOption={selectedFeedbackOption}
            feedbackOptions={feedbackOptions}
            onFeedbackOptionChanged={this.onFeedbackOptionChanged} />
        )}
        <FeedbackComment
          comment={comment}
          commentMessageOverride={commentMessageOverride}
          isPositiveRatingSelected={isPositiveRatingSelected}
          onCommentChanged={this.onCommentChanged} />
        <SubmitButton to={pathname} onClick={this.onSubmit}>{t('send')}</SubmitButton>
      </StyledFeedbackBox>
    )
  }
}

export default translate('feedback')(FeedbackBox)
