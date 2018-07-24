// @flow

import * as React from 'react'
import 'react-dropdown/style.css'

import CityModel from '../../../modules/endpoint/models/CityModel'
import { translate } from 'react-i18next'
import categoriesFeedback, {
  INTEGREAT_INSTANCE, DEFAULT_FEEDBACK_LANGUAGE
} from '../../../modules/endpoint/endpoints/feedback'
import styled from 'styled-components'
import FontAwesome from 'react-fontawesome'
import FeedbackDropdown from './FeedbackDropdown'
import type { FeedbackDropdownType } from './FeedbackDropdown'

const FeedbackBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 350px;
  width: 80%;
  height: auto;
  box-sizing: border-box;
  border-radius: 10px;
  border-color: #585858;
  
  padding: 20px;
  
  @media ${props => props.theme.dimensions.smallViewport} {
      width: 100%;
      height: 100%;
    }
`

const Title = styled.div`
  font-size: 1.5rem;
  padding: 0 0 20px;
`

const Description = styled.div`
  padding: 10px 0 5px;
`

const RatingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  text-align: center;
  padding: 10px;
  
  & > * {
    font-size: 2rem;
  }
`

const RatingItem = styled(FontAwesome)`
  cursor: pointer;
  color: ${props => props.selected ? props.theme.colors.themeColor : props.theme.colors.textSecondaryColor};
  opacity: ${props => props.selected ? '1.0' : '0.5'}
`

const CommentField = styled.textarea`
  resize: none;
`

const SubmitButton = styled.div`
  margin: 15px 0;
  padding: 5px;
  background-color: ${props => props.theme.colors.themeColor};
  color: ${props => props.theme.colors.backgroundAccentColor};
  text-align: center;
  border-radius: 0.25em;
`

type PropsType = {
  cities: Array<CityModel>,
  city: string,
  language: string,
  id?: number,
  title: string,
  alias?: string,
  query?: string,
  route: string,
  isPositiveRating: boolean
}

type StateType = {
  selectedFeedbackOption: FeedbackDropdownType,
  comment: string,
  isPositiveRating: boolean
}

class Feedback extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {selectedFeedbackOption: null, comment: '', isPositiveRating: props.isPositiveRating}
  }

  onPositiveRatingClicked = () => this.setState({isPositiveRating: true})

  onNegativeRatingClicked = () => this.setState({isPositiveRating: false})

  onCommentChanged = (event: Event) => this.setState({comment: event.target.value})

  onFeedbackOptionChanged = (selectedDropdown: FeedbackDropdownType) => {
    this.setState({selectedFeedbackOption: selectedDropdown})
  }

  onSubmit = () => {
    const {selectedFeedbackOption, isPositiveRating, comment} = this.state
    const {id, city, language, alias, query} = this.props
    const feedbackData = {
      feedbackType: selectedFeedbackOption.feedbackType,
      isPositiveRating,
      comment,
      id,
      city: city || INTEGREAT_INSTANCE,
      language: language || DEFAULT_FEEDBACK_LANGUAGE,
      alias,
      query
    }
    categoriesFeedback.postData(feedbackData)
  }

  render () {
    const {isPositiveRating, comment} = this.state
    const {t, city, cities, route, id, alias, query, title} = this.props
    return (
      <FeedbackBox>
        <Title>{t('feedback')}</Title>
        <RatingContainer>
          <RatingItem
            name='smile-o'
            selected={isPositiveRating}
            onClick={this.onPositiveRatingClicked} />
          <RatingItem
            name='frown-o'
            selected={!isPositiveRating}
            onClick={this.onNegativeRatingClicked} />
        </RatingContainer>
        <Description>{t('feedbackType')}</Description>
        <FeedbackDropdown
          city={city}
          title={title}
          route={route}
          id={id}
          alias={alias}
          query={query}
          cities={cities}
          onFeedbackOptionChanged={this.onFeedbackOptionChanged} />
        <Description>{isPositiveRating ? t('positiveComment') : t('negativeComment')}</Description>
        <CommentField rows={3} value={comment} onChange={this.onCommentChanged} />
        <SubmitButton onClick={this.onSubmit}>{t('send')}</SubmitButton>
      </FeedbackBox>
    )
  }
}

export default translate('feedback')(Feedback)
