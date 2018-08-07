// @flow

import * as React from 'react'
import styled from 'styled-components'
import type { LocationState } from 'redux-first-router'
import CleanLink from '../../../modules/common/components/CleanLink'
import { goToFeedback } from '../../../modules/app/routes/feedback'

const Header = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`

const CloseButton = styled(CleanLink)`
  font-size: 2rem;
  align-self: center;
`

const Title = styled.div`
  padding: 15px 0 10px;
  font-size: ${props => props.theme.fonts.subTitleFontSize};
`

type PropsType = {
  location: LocationState,
  title: string
}

export class ModalHeader extends React.Component<PropsType> {
  render () {
    const {title, location} = this.props

    return (
      <Header>
        <Title>{title}</Title>
        <CloseButton to={goToFeedback(location)}>x</CloseButton>
      </Header>
    )
  }
}

export default ModalHeader
