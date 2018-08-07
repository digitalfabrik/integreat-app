// @flow

import * as React from 'react'
import styled from 'styled-components'
import CleanLink from '../../../modules/common/components/CleanLink'
import { translate } from 'react-i18next'
import type { TFunction } from 'react-i18next'
import Dropdown from 'react-dropdown'
import { Description } from './FeedbackBox'
import type { LocationState } from 'redux-first-router'
import { goToFeedback } from '../../../modules/app/routes/feedback'
import FeedbackDropdownItem from '../FeedbackDropdownItem'

const Header = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`

const CloseButton = styled(CleanLink)`
  font-size: 2rem;
`

const Title = styled.div`
  padding: 15px 0 10px;
  font-size: ${props => props.theme.fonts.subTitleFontSize};
`

type PropsType = {
  location: LocationState,
  feedbackOptions: Array<FeedbackDropdownItem>,
  selectedFeedbackOption: FeedbackDropdownItem,
  onFeedbackOptionChanged: FeedbackDropdownItem => void,
  t: TFunction
}

export class FeedbackHeader extends React.Component<PropsType> {
  render () {
    const {t, location, selectedFeedbackOption, feedbackOptions, onFeedbackOptionChanged} = this.props

    return (
      <React.Fragment>
        <Header>
          <Title>{t('feedback')}</Title>
          <CloseButton to={goToFeedback(location)}>x</CloseButton>
        </Header>
        <Description>{t('feedbackType')}</Description>
        <Dropdown
          value={selectedFeedbackOption}
          options={feedbackOptions}
          onChange={onFeedbackOptionChanged} />
      </React.Fragment>
    )
  }
}

export default translate('feedback')(FeedbackHeader)
