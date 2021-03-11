// @flow

import React from 'react'
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '../../app/constants/icons'
import type { ThemeType } from 'build-configs/ThemeType'
import styled, { type StyledComponent, withTheme } from 'styled-components'
import FeedbackVariant from '../../feedback/FeedbackVariant'

const StyledWrapper: StyledComponent<{||}, ThemeType, *> = styled(Wrapper)`
  position: relative;
  box-sizing: border-box;
`

const StyledMenuButton: StyledComponent<{||}, ThemeType, *> = styled(Button)`
  display: flex;
  cursor: pointer;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.theme.colors.textDecorationColor};
  border-radius: 4px;
`

const StyledMenuButtonText: StyledComponent<{||}, ThemeType, *> = styled.div`
  display: flex;
  padding: 8px;
  color: ${props => props.theme.colors.textColor};
`

const StyledMenuButtonIcon: StyledComponent<{||}, ThemeType, *> = styled.div`
  padding: 8px 16px;
`

const StyledMenu: StyledComponent<{||}, ThemeType, *> = styled(Menu)`
  position: absolute;
  top: 100%;
  z-index: 1;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
  margin: 8px 0;
  border-radius: 4px;
  background-color: ${props => props.theme.colors.backgroundColor};
  box-shadow: 0 0 0 1px ${props => props.theme.colors.textDecorationColor},
    0 4px 11px ${props => props.theme.colors.textDecorationColor};
`

const StyledMenuItem: StyledComponent<{||}, ThemeType, *> = styled(MenuItem)`
  display: flex;
  padding: 8px;
  color: ${props => props.theme.colors.textColor};
  cursor: pointer;

  :focus,
  :hover {
    background-color: ${props => props.theme.colors.textDecorationColor};
  }
`

type DropdownPropsType = {|
  items: Array<FeedbackVariant>,
  selectedItem: FeedbackVariant,
  onOptionChanged: (item: FeedbackVariant) => void,
  theme: ThemeType
|}

class Dropdown extends React.Component<DropdownPropsType> {
  render() {
    const { onOptionChanged, items, selectedItem, theme } = this.props

    const renderMenuButton = () => {
      return (
        <StyledMenuButton>
          <StyledMenuButtonText>{selectedItem.label}</StyledMenuButtonText>
          <StyledMenuButtonIcon>
            <FontAwesomeIcon icon={faAngleDown} size='lg' color={theme.colors.textDecorationColor} />
          </StyledMenuButtonIcon>
        </StyledMenuButton>
      )
    }

    const renderItems = () => {
      return items.map((option, index) => (
        <StyledMenuItem key={index} value={option} text={option.label}>
          {option.label}
        </StyledMenuItem>
      ))
    }

    return (
      <StyledWrapper onSelection={onOptionChanged}>
        {renderMenuButton()}
        <StyledMenu>{renderItems()}</StyledMenu>
      </StyledWrapper>
    )
  }
}

export default withTheme(Dropdown)
