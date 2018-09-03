// @flow

import * as React from 'react'
import 'react-dropdown/style.css'

import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import CleanLink from '../../../modules/common/components/CleanLink'
import ModalHeader from './ModalHeader'
import FeedbackComment from './FeedbackComment'
import type { LocationState } from 'redux-first-router'
import { goToFeedback } from '../../../modules/app/routes/feedback'
import FeedbackDropdownItem from '../FeedbackDropdownItem'
import Dropdown from 'react-dropdown'
import { FEEDBACK_SENT } from './FeedbackModal'

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

type PropsType = {|
  isPositiveRatingSelected: boolean,
  location: LocationState,
  feedbackOptions: Array<FeedbackDropdownItem>,
  selectedFeedbackOption: FeedbackDropdownItem,
  comment: string,
  onCommentChanged: SyntheticInputEvent<HTMLTextAreaElement> => void,
  onFeedbackOptionChanged: FeedbackDropdownItem => void,
  onSubmit: () => void,
  t: TFunction
|}

/**
 * Renders all necessary inputs for a Feedback and posts the data to the FeedbackEndpoint
 */
export class FeedbackBox extends React.Component<PropsType> {
  render () {
    const {
      selectedFeedbackOption,
      feedbackOptions,
      t,
      isPositiveRatingSelected,
      location,
      onFeedbackOptionChanged,
      onCommentChanged,
      onSubmit,
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
        <SubmitButton to={goToFeedback(location, FEEDBACK_SENT)} onClick={onSubmit}>
          {t('send')}
        </SubmitButton>
      </StyledFeedbackBox>
    )
  }
}

export default translate('feedback')(FeedbackBox)
