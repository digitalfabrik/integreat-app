import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { ArrowBackIcon, CloseIcon } from '../assets'
import Button from './base/Button'
import Icon from './base/Icon'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.backgroundColor};
  font-family: ${props => props.theme.fonts.web.decorativeFont};
`

const Header = styled.div<{ small: boolean }>`
  display: flex;
  padding: 16px;
  flex-direction: ${props => (props.small ? 'row-reverse' : 'row')};
  justify-content: space-between;
  font-size: ${props => props.theme.fonts.subTitleFontSize};
  font-weight: bold;
  align-items: center;

  ${props =>
    props.small &&
    css`
      align-self: flex-start;
      gap: 16px;
    `}
`

const CloseButton = styled(Button)`
  background-color: ${props => props.theme.colors.backgroundColor};
`

const StyledIcon = styled(Icon)`
  width: 24px;
  height: 24px;
  align-self: center;
  display: flex;
`

type ModalProps = {
  title: string
  children: ReactNode
  closeModal: () => void
  small: boolean
}

const ModalContent = ({ title, closeModal, children, small }: ModalProps): ReactElement => {
  const { t } = useTranslation('common')

  return (
    <Container>
      <Header small={small}>
        <span>{title}</span>
        <CloseButton aria-label={t('close')} onClick={closeModal}>
          <StyledIcon src={small ? ArrowBackIcon : CloseIcon} directionDependent />
        </CloseButton>
      </Header>
      {children}
    </Container>
  )
}

export default ModalContent
