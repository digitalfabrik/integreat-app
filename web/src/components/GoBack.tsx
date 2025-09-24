import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import React, { memo, ReactElement } from 'react'

import { helpers } from '../constants/theme'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledButton = styled(Button)`
  display: flex;
  padding-top: 12px;

  ${props => props.theme.breakpoints.down('md')} {
    animation: fade-in 3s;

    @keyframes fade-in {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }
  }
`

const DetailsHeaderTitle = styled('span')`
  color: ${props => props.theme.legacy.colors.textColor};
  align-self: center;
  white-space: pre;
  padding-inline-start: 8px;
  ${helpers.adaptiveFontSize};
  font-family: ${props => props.theme.legacy.fonts.web.contentFont};
`

const StyledIcon = styled(Icon)`
  height: 24px;
  width: 24px;
`

const StyledDivider = styled(Divider)`
  margin: 12px 0;
`

type GoBackProps = {
  text: string
  goBack: () => void
}

const GoBack = ({ goBack, text }: GoBackProps): ReactElement => (
  <>
    <StyledButton onClick={goBack} label={text} tabIndex={0}>
      <StyledIcon src={ArrowBackIcon} directionDependent />
      <DetailsHeaderTitle>{text}</DetailsHeaderTitle>
    </StyledButton>
    <StyledDivider />
  </>
)

export default memo(GoBack)
