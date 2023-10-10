import React, { memo, ReactElement } from 'react'
import styled, { css, useTheme } from 'styled-components'

import { ArrowBackspaceIcon } from '../assets'
import { helpers } from '../constants/theme'
import Spacer from './Spacer'
import Icon from './base/Icon'

const DetailsHeader = styled.div<{ viewportSmall: boolean }>`
  display: flex;
  padding-top: 12px;
  cursor: pointer;

  ${props =>
    props.viewportSmall &&
    css`
      animation: fadeIn 3s;

      @keyframes fadeIn {
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
  align-self: center;
  white-space: pre;
  padding-left: 8px;
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
      <DetailsHeader viewportSmall={viewportSmall} onClick={goBack} role='button' tabIndex={0} onKeyPress={goBack}>
        <StyledIcon src={ArrowBackspaceIcon} directionDependent />
        <DetailsHeaderTitle>{text}</DetailsHeaderTitle>
      </DetailsHeader>
      <Spacer borderColor={theme.colors.borderColor} />
    </>
  )
}

export default memo(GoBack)
