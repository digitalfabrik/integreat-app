import * as React from 'react'
import { ReactNode } from 'react'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { ThemeType } from 'build-configs'
import testID from '../testing/testID'

export const Input = styled.TextInput.attrs((props: { theme: ThemeType }) => ({
  multiline: false,
  textColor: props.theme.colors.textSecondaryColor,
  placeholderTextColor: props.theme.colors.textSecondaryColor
}))`
  margin: 0 5px;
  flex-grow: 1;

  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.textSecondaryColor};
`
export const Wrapper = styled.View<{ space: boolean }>`
  flex-direction: row;
  ${props => (props.space ? 'margin: 50px 0;' : '')}
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`
export const SearchIcon = styled(Icon).attrs(props => ({
  name: 'search',
  size: 30,
  color: props.theme.colors.textSecondaryColor
}))``

type PropsType = {
  placeholderText: string
  filterText: string
  onFilterTextChange: (arg0: string) => void
  spaceSearch: boolean
  theme: ThemeType
}

class SearchInput extends React.Component<PropsType> {
  static defaultProps = {
    spaceSearch: false
  }

  onFilterTextChange = (text: string): void => this.props.onFilterTextChange(text)

  render(): ReactNode {
    const { filterText, placeholderText, theme, spaceSearch } = this.props
    return (
      <Wrapper theme={theme} space={spaceSearch}>
        <SearchIcon theme={theme} />
        <Input
          {...testID('Search-Input')}
          theme={theme}
          placeholder={placeholderText}
          aria-label={placeholderText}
          defaultValue={filterText}
          onChangeText={this.onFilterTextChange}
        />
      </Wrapper>
    )
  }
}

export default SearchInput
