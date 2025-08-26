import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import dimensions from '../constants/dimensions'

const LONG_TITLE_LENGTH = 25
export const HEADER_TITLE_HEIGHT = 50

const HeaderTitleContainer = styled('div')<{ long: boolean }>`
  display: flex;
  align-items: center;
  font-size: ${props => (props.long ? '1.3rem' : '1.8rem')};
  max-height: ${dimensions.headerHeightLarge};
  font-weight: 800;
  flex: 1;
  order: 2;
  padding: 0 10px;
  box-sizing: border-box;

  ${props => props.theme.breakpoints.up('lg')} {
    font-size: ${props => (props.long ? '1.5rem' : '1.8rem')};
  }

  ${props => props.theme.breakpoints.down('md')} {
    font-family: ${props => props.theme.legacy.fonts.web.decorativeFont};
    font-size: ${props => props.theme.legacy.fonts.decorativeFontSize};
    height: ${HEADER_TITLE_HEIGHT}px;
    justify-content: start;
    padding: 0 10px;
    text-align: start;
    align-self: center;
    font-weight: 400;
  }
`

type HeaderTitleProps = {
  title: string
}

const HeaderTitle = ({ title }: HeaderTitleProps): ReactElement => (
  <HeaderTitleContainer long={title.length >= LONG_TITLE_LENGTH}>{title}</HeaderTitleContainer>
)

export default HeaderTitle
