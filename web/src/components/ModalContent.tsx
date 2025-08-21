import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import React, { CSSProperties, ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
  font-family: ${props => props.theme.legacy.fonts.web.decorativeFont};
`

const Header = styled.div<{ small: boolean }>`
  display: flex;
  padding: 16px;
  flex-direction: ${props => (props.small ? 'row-reverse' : 'row')};
  justify-content: space-between;
  font-size: ${props => props.theme.legacy.fonts.subTitleFontSize};
  font-weight: bold;
  align-items: center;

  ${props =>
    props.small &&
    css`
      align-self: flex-start;
      gap: 16px;
    `}
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme.legacy.colors.textColor};
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
  const theme = useTheme()

  return (
    <Container style={style}>
      <Header small={small}>
        <TitleContainer>
          {icon}
          <span>{title}</span>
        </TitleContainer>
        <IconButton aria-label={t('close')} onClick={closeModal}>
          {small ? (
            <ArrowBackIosNewIcon
              sx={{
                transform: theme.direction === 'rtl' ? 'scaleX(-1)' : 'none',
              }}
            />
          ) : (
            <CloseIcon />
          )}
        </IconButton>
      </Header>
      {children}
    </Container>
  )
}

export default ModalContent
