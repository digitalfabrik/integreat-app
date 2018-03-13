import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import { translate } from 'react-i18next'

import style from './SearchInput.css'

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
      <div className={this.props.spaceSearch ? style.searchSpacing : ''}>
        <div className={style.search}>
          <FontAwesome className={style.searchIcon} name='search' />
          <input type='text'
                 placeholder={this.props.t('search')}
                 className={style.searchInput}
                 defaultValue={this.props.filterText}
                 onChange={this.onFilterTextChange}
                 onClick={this.props.onClickInput}
                 autoFocus />
        </div>
      </div>
    )
  }
}

export default translate('common')(SearchInput)
