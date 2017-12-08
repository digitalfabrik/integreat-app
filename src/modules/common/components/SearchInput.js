import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import { translate } from 'react-i18next'

import style from './SearchInput.css'

class SearchInput extends React.Component {
  static propTypes = {
    filterText: PropTypes.string.isRequired,
    onFilterTextChange: PropTypes.func.isRequired
  }

  render () {
    const {t} = this.props
    return (
      <div className={this.props.className}>
        <div className={style.search}>
          <FontAwesome className={style.searchIcon} name='search'/>
          <input type='text' placeholder={t('Search:search')} className={style.searchInput} defaultValue={this.props.filterText}
                 onChange={(event) => this.props.onFilterTextChange(event.target.value)}/>
        </div>
      </div>
    )
  }
}

export default translate('Search')(SearchInput)
