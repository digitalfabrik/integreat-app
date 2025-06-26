import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import React, { memo, ReactElement } from 'react'

import { helpers } from '../constants/theme'
import Spacer from './Spacer'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledButton = styled(Button)<{ viewportSmall: boolean }>`
  display: flex;
  padding-top: 12px;

  ${props =>
    props.viewportSmall &&
    css`
      animation: fade-in 3s;

      @keyframes fade-in {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }
    `};
`

const DetailsHeaderTitle = styled.span`
  color: ${props => props.theme.colors.textColor};
  align-self: center;
  white-space: pre;
  padding-inline-start: 8px;
  ${helpers.adaptiveFontSize};
  font-family: ${props => props.theme.fonts.web.contentFont};
`

const StyledIcon = styled(Icon)`
  height: 24px;
  width: 24px;
`

type GoBackProps = {
  text: string
  goBack: () => void
  viewportSmall?: boolean
}

const GoBack = ({ goBack, viewportSmall = false, text }: GoBackProps): ReactElement => {
  const theme = useTheme()
  return (
    <>
      <StyledButton onClick={goBack} label={text} tabIndex={0} viewportSmall={viewportSmall}>
        <StyledIcon src={ArrowBackIcon} directionDependent />
        <DetailsHeaderTitle>{text}</DetailsHeaderTitle>
      </StyledButton>
      <Spacer borderColor={theme.colors.borderColor} />
    </>
  )
}

export default memo(GoBack)
