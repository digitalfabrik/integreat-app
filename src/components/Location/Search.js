import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import { translate } from 'react-i18next'

import style from './Search.css'

class Search extends React.Component {
  static propTypes = {
    filterText: PropTypes.string,
    onFilterTextChange: PropTypes.any
  }

  render () {
    const {t} = this.props
    return (
      <div>
        <div className={style.search}>
          <FontAwesome className={style.searchIcon} name='search'/>
          <input type='text' placeholder={t('Location:search')} className={style.searchInput} defaultValue={this.props.filterText}
                 onChange={(event) => this.props.onFilterTextChange(event.target.value)}/>
        </div>
      </div>
    )
  }
}

export default translate('Location')(Search)
