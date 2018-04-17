import React from 'react'
import PropTypes from 'prop-types'
import { SearchIcon, Spacer, TextInput, Wrapper } from './SearchInput.styles'

export class SearchInput extends React.Component {
  static propTypes = {
    placeholderText: PropTypes.string.isRequired,
    filterText: PropTypes.string.isRequired,
    onFilterTextChange: PropTypes.func.isRequired,
    spaceSearch: PropTypes.bool,
    onClickInput: PropTypes.func
  }

  onFilterTextChange = event => this.props.onFilterTextChange(event.target.value)

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
