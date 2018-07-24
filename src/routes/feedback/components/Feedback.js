// @flow

import * as React from 'react'
import 'react-dropdown/style.css'

import CityModel from '../../../modules/endpoint/models/CityModel'
import { translate } from 'react-i18next'
import categoriesFeedback, {
  POSITIVE_RATING, NEGATIVE_RATING, INTEGREAT_INSTANCE, DEFAULT_FEEDBACK_LANGUAGE
} from '../../../modules/endpoint/endpoints/feedback'
import type { RatingType } from '../../../modules/endpoint/endpoints/feedback'
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
`

const CommentField = styled.textarea`
  resize: none;
`

const SubmitButton = styled.div`
  margin: 15px 0;
  padding: 5px;
  background-color: ${props => props.disabled ? props.theme.colors.textSecondaryColor : props.theme.colors.themeColor};
  color: ${props => props.theme.colors.backgroundAccentColor};
  text-align: center;
  border-radius: 0.25em;
  cursor: ${props => props.disabled ? '' : 'pointer'}
`

type PropsType = {
  cities: Array<CityModel>,
  city: string,
  language: string,
  id?: number,
  title: string,
  alias?: string,
  query?: string,
  route: string
}

type StateType = {
  selectedFeedbackOption: FeedbackDropdownType,
  comment: string,
  rating: RatingType
}

class Feedback extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {selectedFeedbackOption: null, comment: '', rating: null}
  }

  onPositiveRatingClicked = () => this.setState(prevState => ({
    rating: prevState.rating === POSITIVE_RATING ? null : POSITIVE_RATING
  }))

  onNegativeRatingClicked = () => this.setState(prevState => ({
    rating: prevState.rating === NEGATIVE_RATING ? null : NEGATIVE_RATING
  }))

  onCommentChanged = (event: Event) => this.setState({comment: event.target.value})

  onFeedbackOptionChanged = (selectedDropdown: FeedbackDropdownType) => {
    this.setState({selectedFeedbackOption: selectedDropdown})
  }

  onSubmit = () => {
    const {selectedFeedbackOption, rating, comment} = this.state
    const {id, city, language, alias, query} = this.props
    if (!this.isSubmitDisabled()) {
      const feedbackData = {
        type: selectedFeedbackOption.feedbackType,
        rating,
        comment,
        id,
        city: city || INTEGREAT_INSTANCE,
        language: language || DEFAULT_FEEDBACK_LANGUAGE,
        alias,
        query
      }
      console.log(feedbackData)
      categoriesFeedback.postData(feedbackData)
    }
  }

  isSubmitDisabled = (): boolean => {
    const {comment, rating} = this.state
    return !rating && !comment
  }

  render () {
    const {rating, comment} = this.state
    const {t, city, cities, route, id, alias, query, title} = this.props
    return (
      <FeedbackBox>
        <Title>{t('feedback')}</Title>
        <div>{t('feedbackType')}</div>
        <FeedbackDropdown
          city={city}
          title={title}
          route={route}
          id={id}
          alias={alias}
          query={query}
          cities={cities}
          onFeedbackOptionChanged={this.onFeedbackOptionChanged} />
        <RatingContainer>
          <RatingItem
            name='smile-o'
            selected={rating === POSITIVE_RATING}
            onClick={this.onPositiveRatingClicked} />
          <RatingItem
            name='frown-o'
            selected={rating === NEGATIVE_RATING}
            onClick={this.onNegativeRatingClicked} />
        </RatingContainer>
        <CommentField rows={3} value={comment} onChange={this.onCommentChanged} />
        <SubmitButton onClick={this.onSubmit} disabled={this.isSubmitDisabled()}>{t('send')}</SubmitButton>
      </FeedbackBox>
    )
  }
}

export default translate('feedback')(Feedback)
