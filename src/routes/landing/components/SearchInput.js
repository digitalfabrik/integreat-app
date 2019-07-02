// @flow

import React from 'react'
import styled, { type StyledComponent } from 'styled-components/native'

import Icon from 'react-native-vector-icons/MaterialIcons'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import testID from '../../../modules/e2e/testID'

export const Spacer: StyledComponent<{ space: boolean}, {}, *> = styled.View`
  ${props => props.space && `margin: 50px 0;`}
`

export const Input = styled.TextInput.attrs((props: { theme: ThemeType }) => ({
  multiline: false,
  textColor: props.theme.colors.textSecondaryColor,
  placeholderTextColor: props.theme.colors.textSecondaryColor
}))`
  margin-left: 5px;
  flex-grow: 1;
  
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.textSecondaryColor};
`

export const Wrapper: StyledComponent<{}, ThemeType, *> = styled.View`
  display: flex;
  flex-direction: row;
  justifyContent:center;
  padding: 10px 10%;
  background-color: ${props => props.theme.colors.backgroundColor};
`

// $FlowFixMe https://github.com/flow-typed/flow-typed/pull/3228
export const SearchIcon = styled(Icon).attrs(props => ({
  name: 'search',
  size: 40
}))`
`

type PropsType = {
  placeholderText: string,
  filterText: string,
  onFilterTextChange: (string) => void,
  spaceSearch: boolean,
  onClickInput?: () => void,
  theme: ThemeType
}

class SearchInput extends React.Component<PropsType> {
  static defaultProps = {spaceSearch: false}
  onFilterTextChange = (text: string) => this.props.onFilterTextChange(text)

  render () {
    const {onClickInput, filterText, placeholderText} = this.props
    return (
      <Spacer space={this.props.spaceSearch} theme={this.props.theme}>
        <Wrapper theme={this.props.theme}>
          <SearchIcon />
          <Input
            {...testID('Search-Input')}
            theme={this.props.theme}
            placeholder={placeholderText}
            aria-label={placeholderText}
            defaultValue={filterText}
            onChangeText={this.onFilterTextChange}
            onClick={onClickInput} />
        </Wrapper>
      </Spacer>
    )
  }
}

export default SearchInput
