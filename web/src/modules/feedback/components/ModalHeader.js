// @flow

import * as React from 'react'
import styled from 'styled-components'
import { faTimes } from '../../app/constants/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TFunction } from 'i18next'

const Header = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: ${props => props.theme.fonts.subTitleFontSize};
`

const CloseButton = styled.button`
  background-color: ${props => props.theme.colors.backgroundColor};
  border: none;

  & * {
    font-size: 0.8em;
    vertical-align: baseline;
  }
`

type PropsType = {|
  closeFeedbackModal: () => void,
  title: string,
  t: typeof TFunction
|}

export class ModalHeader extends React.PureComponent<PropsType> {
  render () {
    const { title, closeFeedbackModal, t } = this.props

    return (
      <Header>
        <div>{title}</div>
        <CloseButton aria-label={t('close')} onClick={closeFeedbackModal}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
      </Header>
    )
  }
}

export default ModalHeader
