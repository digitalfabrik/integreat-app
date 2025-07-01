import { css } from '@emotion/react'
import styled from '@emotion/styled'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import CloseIcon from '@mui/icons-material/Close'
import React, { CSSProperties, ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

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
  background-color: transparent;
`

const StyledIcon = styled(Icon)`
  width: 24px;
  height: 24px;
  align-self: center;
  display: flex;
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme.colors.textColor};
`

type ModalProps = {
  title: string
  icon?: ReactElement
  style?: CSSProperties
  children: ReactNode
  closeModal: () => void
  small: boolean
}

const ModalContent = ({ title, icon, style, closeModal, children, small }: ModalProps): ReactElement => {
  const { t } = useTranslation('common')

  return (
    <Container style={style}>
      <Header small={small}>
        <TitleContainer>
          {icon}
          <span>{title}</span>
        </TitleContainer>
        <CloseButton label={t('close')} onClick={closeModal}>
          <StyledIcon src={small ? ArrowBackIosNewIcon : CloseIcon} directionDependent />
        </CloseButton>
      </Header>
      {children}
    </Container>
  )
}

export default ModalContent
