// @flow

import React from 'react'
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '../../app/constants/icons'
import type { ThemeType } from '../../theme/constants/theme'
import styled from 'styled-components'

const StyledWrapper = styled(Wrapper)`
  position: relative;
  box-sizing: border-box;
`

const StyledMenuButton = styled(Button)`
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

const StyledMenuButtonText = styled.div`
  display: flex;
  padding: 8px;
  color: ${props => props.theme.colors.textColor};
`

const StyledMenuButtonIcon = styled.div`
  padding: 8px 16px;
`

const StyledMenu = styled(Menu)`
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

const StyledMenuItem = styled(MenuItem)`
  display: flex;
  padding: 8px;
  color: ${props => props.theme.colors.textColor};
  cursor: pointer;

  :focus,
  :hover {
    background-color: ${props => props.theme.colors.textDecorationColor};
  }
`

type DropdownItemType = { label: string }

type DropdownPropsType<T: DropdownItemType> = {
  items: Array<T>,
  selectedItem: T,
  onOptionChanged: (item: T) => void,
  theme: ThemeType
}

class Dropdown<T: DropdownItemType> extends React.Component<DropdownPropsType<T>> {
  render () {
    const { onOptionChanged, items, selectedItem, theme } = this.props

    const renderMenuButton = () => {
      return <StyledMenuButton>
        <StyledMenuButtonText>{selectedItem.label}</StyledMenuButtonText>
        <StyledMenuButtonIcon>
          <FontAwesomeIcon icon={faAngleDown} size='lg' color={theme.colors.textDecorationColor} />
        </StyledMenuButtonIcon>
      </StyledMenuButton>
    }

    const renderItems = () => {
      return items.map((option, index) =>
        <StyledMenuItem key={index} value={option} text={option.label} theme={theme}>
          {option.label}
        </StyledMenuItem>)
    }

    return <StyledWrapper onSelection={onOptionChanged}>
      {renderMenuButton()}
      <StyledMenu>
        {renderItems()}
      </StyledMenu>
    </StyledWrapper>
  }
}

export default Dropdown
