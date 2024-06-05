import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CloseWhiteIcon, MinimizeIcon } from '../assets'
import Button from './base/Button'
import Icon from './base/Icon'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.backgroundColor};
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  border-radius: 5px;
`

const Header = styled.div<{ small: boolean }>`
  display: flex;
  padding: 8px;
  flex-direction: ${props => (props.small ? 'row-reverse' : 'row')};
  justify-content: space-between;
  font-size: ${props => props.theme.fonts.hintFontSize};
  font-weight: bold;
  align-items: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: ${props => props.theme.colors.themeColor};
  ${props =>
    props.small &&
    css`
      align-self: flex-start;
      gap: 16px;
    `}
`

const StyledButton = styled(Button)`
  background-color: ${props => props.theme.colors.themeColor};
`

const StyledIcon = styled(Icon)`
  width: 24px;
  height: 24px;
  align-self: center;
  display: flex;
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`

type ModalProps = {
  title: string
  children: ReactNode
  closeModal: () => void
  small: boolean
}

const ChatbotModalContent = ({ title, closeModal, children, small }: ModalProps): ReactElement => {
  const { t } = useTranslation('common')

  return (
    <Container>
      <Header small={small}>
        <span>{title}</span>
        <ButtonContainer>
          <StyledButton ariaLabel={t('close')} onClick={closeModal}>
            {' '}
            <StyledIcon src={MinimizeIcon} directionDependent />{' '}
          </StyledButton>
          <StyledButton ariaLabel={t('close')} onClick={closeModal}>
            <StyledIcon src={CloseWhiteIcon} directionDependent />
          </StyledButton>
        </ButtonContainer>
      </Header>
      {children}
    </Container>
  )
}

export default ChatbotModalContent
