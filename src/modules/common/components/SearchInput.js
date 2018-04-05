import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { SearchIcon, Spacer, TextInput, Wrapper } from './SearchInput.styles'

export class SearchInput extends React.Component {
  static propTypes = {
    filterText: PropTypes.string.isRequired,
    onFilterTextChange: PropTypes.func.isRequired,
    spaceSearch: PropTypes.bool,
    onClickInput: PropTypes.func,
    t: PropTypes.func.isRequired
  }

  onFilterTextChange = event => this.props.onFilterTextChange(event.target.value)

  render () {
    return (
      <Spacer space={this.props.spaceSearch}>
        <Wrapper>
          <SearchIcon />
          <TextInput placeholder={this.props.t('search')}
                     defaultValue={this.props.filterText}
                     onChange={this.onFilterTextChange}
                     onClick={this.props.onClickInput}
                     autoFocus />
        </Wrapper>
      </Spacer>
    )
  }
}

export default translate('common')(SearchInput)
