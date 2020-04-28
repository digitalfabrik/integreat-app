// @flow

import React from 'react'
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '../../app/constants/icons'
import type { ThemeType } from '../../theme/constants/theme'
import styled from 'styled-components'

const StyledMenuButton = styled(Button)`
  display: flex;
  cursor: pointer;
  box-sizing: border-box;
  align-items: center;
  border-style: solid;
  border-color: ${props => props.theme.colors.textDecorationColor};
  border-radius: 4px;
  border-width: 1px;
`

const StyledMenuButtonText = styled.div`
  display: flex;
  padding: 8px;
  color: ${props => props.theme.colors.textSecondaryColor};
`

const MenuWrapper = styled.div`

`

const StyledMenuItem = styled.div`
  cursor: pointer;
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

    return <Wrapper onSelection={onOptionChanged}>
      <StyledMenuButton>
        <StyledMenuButtonText>
          {selectedItem.label}
        </StyledMenuButtonText>
        <FontAwesomeIcon icon={faAngleDown} color={theme.colors.textDecorationColor} />
      </StyledMenuButton>
      <Menu>
        <MenuWrapper>
          {
            items.map((option, index) =>
              <MenuItem key={index} value={option} text={option.label}>
                <StyledMenuItem>{option.label}</StyledMenuItem>
              </MenuItem>)
          }
        </MenuWrapper>
      </Menu>
    </Wrapper>
  }
}

export default Dropdown
