// @flow

import * as React from 'react'

import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import styled from 'styled-components'
import ModalHeader from './ModalHeader'
import FeedbackComment from './FeedbackComment'
import FeedbackDropdownItem from '../FeedbackDropdownItem'
import Select from 'react-select'

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

export const SubmitButton = styled.span`
  margin: 15px 0;
  padding: 5px;
  background-color: ${props => props.theme.colors.themeColor};
  text-align: center;
  border-radius: 0.25em;
  cursor: pointer;
`

const StyledSelect = styled(Select)`
  &,
  & * {
    cursor: pointer !important;
  }
`

type PropsType = {|
  isPositiveRatingSelected: boolean,
  feedbackOptions: Array<FeedbackDropdownItem>,
  selectedFeedbackOption: FeedbackDropdownItem,
  comment: string,
  onCommentChanged: SyntheticInputEvent<HTMLTextAreaElement> => void,
  onFeedbackOptionChanged: FeedbackDropdownItem => void,
  onSubmit: () => void,
  t: TFunction,
  closeFeedbackModal: () => void
|}

/**
 * Renders all necessary inputs for a Feedback and posts the data to the feedback endpoint
 */
export class FeedbackBox extends React.PureComponent<PropsType> {
  render () {
    const {
      selectedFeedbackOption,
      feedbackOptions,
      t,
      isPositiveRatingSelected,
      onFeedbackOptionChanged,
      onCommentChanged,
      onSubmit,
      comment,
      closeFeedbackModal
    } = this.props

    return (
      <StyledFeedbackBox>
        <ModalHeader closeFeedbackModal={closeFeedbackModal} title={t('feedback')} />
        <Description>{t('feedbackType')}</Description>
        <StyledSelect
          value={selectedFeedbackOption}
          options={feedbackOptions}
          onChange={onFeedbackOptionChanged} />
        <FeedbackComment
          comment={comment}
          commentMessage={isPositiveRatingSelected ? t('positiveComment') : t('negativeComment')}
          onCommentChanged={onCommentChanged} />
        <SubmitButton onClick={onSubmit}>
          {t('send')}
        </SubmitButton>
      </StyledFeedbackBox>
    )
  }
}

export default withTranslation('feedback')(FeedbackBox)
