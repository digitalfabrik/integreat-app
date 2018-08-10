// @flow

import React from 'react'
import { SearchIcon, Spacer, TextInput, Wrapper } from './SearchInput.styles'

type PropsType = {
  placeholderText: string,
  filterText: string,
  onFilterTextChange: (string) => void,
  spaceSearch: boolean,
  onClickInput?: () => void
}

export class SearchInput extends React.Component<PropsType> {
  static defaultProps = {spaceSearch: false}
  onFilterTextChange = (event: SyntheticInputEvent<EventTarget>) => this.props.onFilterTextChange(event.target.value)

  render () {
    const {onClickInput, filterText, placeholderText} = this.props
    return (
      <Spacer space={this.props.spaceSearch}>
        <Wrapper>
          <SearchIcon />
            <TextInput placeholder={placeholderText}
                       aria-label={placeholderText}
                       defaultValue={filterText}
                       onChange={this.onFilterTextChange}
                       onClick={onClickInput}
                       autoFocus />
        </Wrapper>
      </Spacer>
    )
  }
}

export default SearchInput
