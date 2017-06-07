import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'

import style from './Search.css'

class Search extends React.Component {
  static propTypes = {
    filterText: PropTypes.string,
    onFilterTextChange: PropTypes.any
  }

  render () {
    return (
      <div>
        <div className={style.search}>
          <FontAwesome className={style.searchIcon} name='search'/>
          <input type='text' placeholder='Search' className={style.searchInput} defaultValue={this.props.filterText}
                 onChange={(event) => this.props.onFilterTextChange(event.target.value)} autoFocus/>
        </div>
      </div>
    )
  }
}

export default Search
