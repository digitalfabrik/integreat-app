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
    t: PropTypes.func.isRequired
  }

  render () {
    return (
      <div className={this.props.spaceSearch ? style.searchSpacing : undefined}>
        <div className={style.search}>
          <FontAwesome className={style.searchIcon} name='search' />
          <input type='text'
                 placeholder={this.props.t('search')}
                 className={style.searchInput}
                 defaultValue={this.props.filterText}
                 onChange={(event) => this.props.onFilterTextChange(event.target.value)} />
        </div>
      </div>
    )
  }
}

export default translate('common')(SearchInput)
