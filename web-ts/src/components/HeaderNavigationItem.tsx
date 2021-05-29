import React from 'react'
import styled from 'styled-components'
import helpers from '../constants/themeHelpers'
import dimensions from '../constants/dimensions'
import { Link } from 'react-router-dom'

const Container = styled.div`
  flex: 1 1 135px;
`

const StyledLink = styled(Link)<{ $active: boolean }>`
  ${helpers.removeLinkHighlighting};
  color: ${props => props.theme.colors.textSecondaryColor};
  font-size: 0.9em;
  font-weight: 800;
  text-align: center;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  display: flex;
  transition: color 0.2s;

  height: 100%;

  @media ${dimensions.smallViewport} {
    font-size: 0.8em;
    min-width: 135px;
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

const ICON_SIZE_LARGE = 50
const ICON_SIZE_SMALL = 35
const PADDING_CIRCLE = 8

const Circle = styled.div`
  background-color: white;
  box-sizing: border-box;
  border-radius: 100%;
  height: ${ICON_SIZE_LARGE}px;
  width: ${ICON_SIZE_LARGE}px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.7);
  transition: box-shadow 0.2s, border 0.2s;
  border: white 2px solid;

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

type PropsType = {
  text: string,
  href: string,
  active: boolean,
  icon: string
}

const HeaderNavigationItem = ({ active, text, href, icon }: PropsType) => (
  <Container>
    <StyledLink to={href} $active={active}>
      <Circle>
        <img src={icon} alt='' />
      </Circle>
      {text}
    </StyledLink>
  </Container>
)

export default HeaderNavigationItem
