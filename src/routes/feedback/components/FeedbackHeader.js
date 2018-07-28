// @flow

import * as React from 'react'
import styled from 'styled-components'
import CleanLink from '../../../modules/common/components/CleanLink'
import { translate } from 'react-i18next'
import type { TFunction } from 'react-i18next'
import Dropdown from 'react-dropdown'
import { Description } from './FeedbackBox'
import type { FeedbackDropdownType } from './FeedbackBox'

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
  pathname: string,
  feedbackOptions: Array<FeedbackDropdownType>,
  selectedFeedbackOption: FeedbackDropdownType,
  onFeedbackOptionChanged: (FeedbackDropdownType) => void,
  t: TFunction
}

export class FeedbackHeader extends React.Component<PropsType> {
  render () {
    const {t, pathname, selectedFeedbackOption, feedbackOptions, onFeedbackOptionChanged} = this.props

    return (
      <React.Fragment>
        <Header>
          <Title>{t('feedback')}</Title>
          <CloseButton to={pathname}>x</CloseButton>
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
