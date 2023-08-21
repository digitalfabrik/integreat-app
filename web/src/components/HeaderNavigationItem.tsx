import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import { helpers } from '../constants/theme'
import Icon from './base/Icon'

const Container = styled.div`
  flex: 1 1 135px;
`

const StyledLink = styled(Link)<{ $active: boolean }>`
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

  &:active {
    font-weight: 800;
  }

  @media ${dimensions.smallViewport} {
    font-size: ${props => props.theme.fonts.decorativeFontSizeSmall};
    font-weight: 400;
    min-width: 50px;
  }

  &:hover > div:first-child {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
    border-color: ${props => props.theme.colors.themeColor};
  }

  &:hover {
    color: ${props => props.theme.colors.textColor};
  }

  &:hover > div > img {
    opacity: 1;
  }

  ${props =>
    props.$active
      ? `
      color: ${props.theme.colors.textColor};

      & > div > img {
        opacity: 1;
      }

      & > div:first-child {
        box-shadow: 0 0px 0px 0px rgba(0, 0, 0, 0.3);
        border-color: ${props.theme.colors.themeColor};
      }
   `
      : ''}
`

const StyledText = styled.span<{ $active: boolean }>`
  font-weight: ${props => (props.$active ? 'bold' : 'normal')};
`

const ICON_SIZE_LARGE = 50
const ICON_SIZE_SMALL = 35
const PADDING_CIRCLE = 8

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media ${dimensions.mediumLargeViewport} {
    background-color: ${props => props.theme.colors.backgroundColor};
    box-sizing: border-box;
    border-radius: 100%;
    height: ${ICON_SIZE_LARGE}px;
    width: ${ICON_SIZE_LARGE}px;
    box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.7);
    transition:
      box-shadow 0.2s,
      border 0.2s;
    border: ${props => props.theme.colors.backgroundColor} 2px solid;
  }

  & img {
    position: relative;
    opacity: 0.7;
    transition: opacity 0.2s;
    height: ${ICON_SIZE_LARGE / Math.sqrt(2) - PADDING_CIRCLE}px;
    width: ${ICON_SIZE_LARGE / Math.sqrt(2) - PADDING_CIRCLE}px;
  }

  @media ${dimensions.smallViewport} {
    height: ${ICON_SIZE_SMALL}px;
    width: ${ICON_SIZE_SMALL}px;

    & img {
      height: ${ICON_SIZE_SMALL / Math.sqrt(2) - PADDING_CIRCLE / 2}px;
      width: ${ICON_SIZE_SMALL / Math.sqrt(2) - PADDING_CIRCLE / 2}px;
    }
  }
`

const StyledIcon = styled(Icon)`
  width: 28px;
  height: 28px;
`

export type HeaderNavigationItemProps = {
  text: string
  href: string
  active: boolean
  icon: string
}

const HeaderNavigationItem = ({ active, text, href, icon }: HeaderNavigationItemProps): ReactElement => (
  <Container className='header-navigation-item'>
    <StyledLink to={href} $active={active}>
      <Circle>
        <StyledIcon src={icon} />
      </Circle>
      <StyledText $active={active}>{text}</StyledText>
    </StyledLink>
  </Container>
)

export default HeaderNavigationItem
