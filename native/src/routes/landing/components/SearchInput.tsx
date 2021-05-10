import * as React from 'react'
import styled from 'styled-components/native'
import { StyledComponent } from 'styled-components'
import 'styled-components'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { ThemeType } from '../../../modules/theme/constants'
import testID from '../../../modules/e2e/testID'
export const Input: StyledComponent<{}, ThemeType, any> = styled.TextInput.attrs((props: { theme: ThemeType }) => ({
  multiline: false,
  textColor: props.theme.colors.textSecondaryColor,
  placeholderTextColor: props.theme.colors.textSecondaryColor
}))`
  margin: 0 5px;
  flex-grow: 1;

  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.textSecondaryColor};
`
export const Wrapper: StyledComponent<
  {
    space: boolean
  },
  ThemeType,
  any
> = styled.View`
  flex-direction: row;
  ${props => (props.space ? 'margin: 50px 0;' : '')}
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`
export const SearchIcon: StyledComponent<{}, ThemeType, any> = styled(Icon).attrs(props => ({
  name: 'search',
  size: 30,
  color: props.theme.colors.textSecondaryColor
}))``
type PropsType = {
  placeholderText: string
  filterText: string
  onFilterTextChange: (arg0: string) => void
  spaceSearch: boolean
  onClickInput?: () => void
  theme: ThemeType
}

class SearchInput extends React.Component<PropsType> {
  static defaultProps = {
    spaceSearch: false
  }
  onFilterTextChange = (text: string) => this.props.onFilterTextChange(text)

  render() {
    const { onClickInput, filterText, placeholderText, theme, spaceSearch } = this.props
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
          onClick={onClickInput}
        />
      </Wrapper>
    )
  }
}

export default SearchInput
