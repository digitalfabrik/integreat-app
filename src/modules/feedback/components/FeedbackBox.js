// @flow

import * as React from 'react'

import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import styled from 'styled-components'
import ModalHeader from './ModalHeader'
import FeedbackComment from './FeedbackComment'
import FeedbackVariant from '../FeedbackVariant'
import Select from 'react-select'
import TextButton from '../../common/components/TextButton'

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

const StyledSelect = styled(Select)`
  &,
  & * {
    cursor: pointer !important;
  }
`

type PropsType = {|
  isPositiveRatingSelected: boolean,
  feedbackOptions: Array<FeedbackVariant>,
  selectedFeedbackOption: FeedbackVariant,
  comment: string,
  onCommentChanged: SyntheticInputEvent<HTMLTextAreaElement> => void,
  onFeedbackOptionChanged: FeedbackVariant => void,
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
        <ModalHeader t={t} closeFeedbackModal={closeFeedbackModal} title={t('feedback')} />
        <Description>{t('feedbackType')}</Description>
        <StyledSelect
          value={selectedFeedbackOption}
          options={feedbackOptions}
          onChange={onFeedbackOptionChanged} />
        <FeedbackComment
          comment={comment}
          commentMessage={isPositiveRatingSelected ? t('positiveComment') : t('negativeComment')}
          onCommentChanged={onCommentChanged} />
        <TextButton disabled={!isPositiveRatingSelected && !comment} onClick={onSubmit} text={t('send')} />
      </StyledFeedbackBox>
    )
  }
}

export default withTranslation('feedback')(FeedbackBox)
