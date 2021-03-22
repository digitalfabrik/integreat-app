// @flow

import React from 'react'
import styled, { type StyledComponent } from 'styled-components'
import Link from 'redux-first-router-link'
import helpers from '../../theme/constants/helpers'
import dimensions from '../../theme/constants/dimensions'
import Tooltip from '../../common/components/Tooltip'
import type { ThemeType } from 'build-configs/ThemeType'
import LocationToolbar from './LocationToolbar'
import type { UiDirectionType } from '../../i18n/types/UiDirectionType'

const StyledLink: StyledComponent<{||}, ThemeType, *> = styled(Link)`
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
    min-width: 105px;
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

type PropsType = {|
  text: string,
  href: string,
  active: boolean,
  tooltip?: string,
  icon: string,
  direction: UiDirectionType
|}

const HeaderNavigationItem = ({ active, text, tooltip, href, icon, direction }: PropsType) => (
  <Tooltip text={tooltip} flow={'up'} direction={direction}>
    <StyledLink to={href} $active={active}>
      <Circle>
        <img src={icon} alt='' />
      </Circle>
      <div>{text}</div>
    </StyledLink>
  </Tooltip>
)

export default HeaderNavigationItem
