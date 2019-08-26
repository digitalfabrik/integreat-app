// @flow

import * as React from 'react'
import styled from 'styled-components'
import { faTimes } from '../../app/constants/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Header = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: ${props => props.theme.fonts.subTitleFontSize};
`

const CloseButton = styled.span`
  cursor: pointer;
  
  & * {
    font-size: 0.8em;
    vertical-align: baseline;
  }
`

type PropsType = {|
  closeFeedbackModal: () => void,
  title: string
|}

export class ModalHeader extends React.PureComponent<PropsType> {
  render () {
    const { title, closeFeedbackModal } = this.props

    return (
      <Header>
        <div>{title}</div>
        <CloseButton onClick={closeFeedbackModal}><FontAwesomeIcon icon={faTimes} /></CloseButton>
      </Header>
    )
  }
}

export default ModalHeader
