import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { SvgIconProps } from '@mui/material/SvgIcon'
import React, { ElementType, ReactElement } from 'react'

import { helpers } from '../constants/theme'
import Icon from './base/Icon'
import Link from './base/Link'

const Container = styled.div`
  flex: 1 1 135px;
`

const StyledLink = styled(Link)<{ active: boolean }>`
  ${helpers.removeLinkHighlighting};
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.web.contentFont};
  font-size: 0.9em;
  font-weight: 800;
  text-align: center;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  display: flex;
  transition: color 0.2s;
  height: 100%;

  ${props => props.theme.breakpoints.down('md')} {
    font-size: ${props => props.theme.fonts.decorativeFontSizeSmall};
    font-weight: 400;
    min-width: 50px;
  }

  & > div > svg {
    color: ${props => (props.active ? props.theme.colors.textColor : props.theme.colors.textSecondaryColor)};
  }

  &:hover {
    color: ${props => props.theme.colors.textColor};
  }

  &:hover > div > svg {
    color: ${props => props.theme.colors.textColor};
  }

  &:hover > div:first-of-type {
    box-shadow: 0 0 0 0 rgb(0 0 0 / 30%);
    border-color: ${props => props.theme.colors.themeColor};
  }

  ${props =>
    props.active &&
    css`
      color: ${props.theme.colors.textColor};

      & > div:first-of-type {
        box-shadow: 0 0 0 0 rgb(0 0 0 / 30%);
        border-color: ${props.theme.colors.themeColor};
      }
    `}
`

const StyledText = styled.span<{ active: boolean }>`
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
`

const ICON_SIZE_LARGE = 50
const ICON_SIZE_SMALL = 35

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${props => props.theme.breakpoints.up('md')} {
    background-color: ${props => props.theme.colors.backgroundColor};
    box-sizing: border-box;
    border-radius: 100%;
    height: ${ICON_SIZE_LARGE}px;
    width: ${ICON_SIZE_LARGE}px;
    box-shadow: 0 2px 5px -3px rgb(0 0 0 / 70%);
    transition:
      box-shadow 0.2s,
      border 0.2s;
    border: ${props => props.theme.colors.backgroundColor} 2px solid;
  }

  ${props => props.theme.breakpoints.down('md')} {
    height: ${ICON_SIZE_SMALL}px;
    width: ${ICON_SIZE_SMALL}px;
  }
`

const StyledIcon = styled(Icon)`
  width: 28px;
  height: 28px;
`

export type HeaderNavigationItemProps = {
  text: string
  to: string
  active: boolean
  icon: string | ElementType<SvgIconProps>
}

const HeaderNavigationItem = ({ active, text, to, icon }: HeaderNavigationItemProps): ReactElement => (
  <Container className='header-navigation-item'>
    <StyledLink to={to} active={active}>
      <Circle>
        <StyledIcon src={icon} />
      </Circle>
      <StyledText active={active}>{text}</StyledText>
    </StyledLink>
  </Container>
)

export default HeaderNavigationItem
