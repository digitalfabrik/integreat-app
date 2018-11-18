// @flow

import * as React from 'react'
import styled from 'styled-components'

const Header = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`

const CloseButton = styled.span`
  align-self: center;
  font-size: 2rem;
  cursor: pointer;
`

const Title = styled.div`
  font-size: ${props => props.theme.fonts.subTitleFontSize};
`

type PropsType = {|
  closeFeedbackModal: () => void,
  title: string
|}

export class ModalHeader extends React.Component<PropsType> {
  render () {
    const {title, closeFeedbackModal} = this.props

    return (
      <Header>
        <Title>{title}</Title>
        <CloseButton onClick={closeFeedbackModal}>x</CloseButton>
      </Header>
    )
  }
}

export default ModalHeader
