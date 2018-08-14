// @flow

import * as React from 'react'
import 'react-dropdown/style.css'

import CityModel from '../../../modules/endpoint/models/CityModel'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import FeedbackEndpoint, { DEFAULT_FEEDBACK_LANGUAGE, EXTRA_FEEDBACK_TYPE, INTEGREAT_INSTANCE }
  from '../../../modules/endpoint/FeedbackEndpoint'
import type { TFunction } from 'react-i18next'
import CleanLink from '../../../modules/common/components/CleanLink'
import type { FeedbackDataType } from '../../../modules/endpoint/FeedbackEndpoint'
import ModalHeader from './ModalHeader'
import FeedbackComment from './FeedbackComment'
import type { LocationState } from 'redux-first-router'
import { goToFeedback } from '../../../modules/app/routes/feedback'
import FeedbackDropdownItem from '../FeedbackDropdownItem'
import Dropdown from 'react-dropdown'
import { FEEDBACK_SENT } from './FeedbackModal'
import ExtraModel from '../../../modules/endpoint/models/ExtraModel'
import { TECHNICAL_TOPICS_OPTION } from './FeedbackBoxContainer'

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
  extras?: ?Array<ExtraModel>,
  feedbackOptions: Array<FeedbackDropdownItem>,
  selectedFeedbackOption: FeedbackDropdownItem,
  comment: string,
  onCommentChanged: SyntheticInputEvent<HTMLTextAreaElement> => void,
  onFeedbackOptionChanged: FeedbackDropdownItem => void,
  t: TFunction
}

/**
 * Renders all necessary inputs for a Feedback and posts the data to the FeedbackEndpoint
 */
export class FeedbackBox extends React.Component<PropsType> {
  static defaultProps = {
    hideHeader: false
  }

  componentDidUpdate (prevProps: PropsType) {
    const {isOpen} = this.props
    const prevIsOpen = prevProps.isOpen

    // If the FeedbackBox is opened, we want to post the feedback
    if (prevIsOpen !== isOpen && isOpen) {
      /* eslint-disable react/no-did-update-set-state */
      FeedbackEndpoint.postData(this.getFeedbackData())
    }
  }

  /**
   * Returns the data that should be posted to the FeedbackEndpoint
   * @return {{feedbackType: string, isPositiveRating: boolean, comment: string, id: number, city: *, language: *,
   * alias: string, query: string}}
   */
  getFeedbackData = (): FeedbackDataType => {
    const {location, query, isPositiveRatingSelected, id, alias, selectedFeedbackOption, comment} = this.props
    const {city, language} = location.payload

    const isTechnicalTopicsOptionSelected = selectedFeedbackOption.value === TECHNICAL_TOPICS_OPTION
    const isExtraOptionSelected = selectedFeedbackOption.feedbackType === EXTRA_FEEDBACK_TYPE
    const feedbackCity = !city || isTechnicalTopicsOptionSelected ? INTEGREAT_INSTANCE : city
    const feedbackLanguage = !language || isTechnicalTopicsOptionSelected ? DEFAULT_FEEDBACK_LANGUAGE : language
    const feedbackAlias = alias || (isExtraOptionSelected ? selectedFeedbackOption.value : '')

    return {
      feedbackType: selectedFeedbackOption.feedbackType,
      isPositiveRating: isPositiveRatingSelected,
      comment,
      id,
      city: feedbackCity,
      language: feedbackLanguage,
      alias: feedbackAlias,
      query
    }
  }

  onSubmit = () => {
    FeedbackEndpoint.postData(this.getFeedbackData())
  }

  render () {
    const {
      selectedFeedbackOption,
      feedbackOptions,
      t,
      isPositiveRatingSelected,
      location,
      onFeedbackOptionChanged,
      onCommentChanged,
      comment
    } = this.props

    return (
      <StyledFeedbackBox>
        <ModalHeader location={location} title={t('feedback')} />
        <Description>{t('feedbackType')}</Description>
        <Dropdown
          value={selectedFeedbackOption}
          options={feedbackOptions}
          onChange={onFeedbackOptionChanged} />
        <FeedbackComment
          comment={comment}
          commentMessage={isPositiveRatingSelected ? t('positiveComment') : t('negativeComment')}
          isPositiveRatingSelected={isPositiveRatingSelected}
          onCommentChanged={onCommentChanged} />
        <SubmitButton to={goToFeedback(location, FEEDBACK_SENT)} onClick={this.onSubmit}>
          {t('send')}
        </SubmitButton>
      </StyledFeedbackBox>
    )
  }
}

export default translate('feedback')(FeedbackBox)
