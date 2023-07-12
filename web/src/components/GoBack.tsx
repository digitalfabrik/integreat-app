import React, { memo, ReactElement } from 'react'
import styled, { css, useTheme } from 'styled-components'

import iconArrowBack from '../assets/IconArrowBackLong.svg'
import Spacer from './Spacer'

const ArrowBack = styled.img<{ direction: string }>`
  width: 16px;
  height: 14px;
  flex-shrink: 0;
  padding: 0 8px;
  object-fit: contain;
  align-self: center;

  ${props =>
    props.direction === 'rtl' &&
    css`
      transform: scaleX(-1);
    `};
`

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
  font-size: clamp(
    ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
  );
  font-family: ${props => props.theme.fonts.web.contentFont};
`

type GoBackProps = {
  text: string
  goBack: () => void
  direction: string
  viewportSmall?: boolean
}

const GoBack = ({ goBack, direction, viewportSmall = false, text }: GoBackProps): ReactElement => {
  const theme = useTheme()
  return (
    <>
      <DetailsHeader viewportSmall={viewportSmall} onClick={goBack} role='button' tabIndex={0} onKeyPress={goBack}>
        <ArrowBack src={iconArrowBack} alt='' direction={direction} />
        <DetailsHeaderTitle>{text}</DetailsHeaderTitle>
      </DetailsHeader>
      <Spacer borderColor={theme.colors.poiBorderColor} />
    </>
  )
}

export default memo(GoBack)
