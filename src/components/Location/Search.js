import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import content from './Search.css'

class Search extends React.Component {
  static propTypes = {
    filterText: PropTypes.string,
    onFilterTextChange: PropTypes.any
  }

  render () {
    return (
      <div>
        <div className={content.search}>
          <span className={cx(content.searchIcon, 'glyphicon glyphicon-search')}/>
          <input type='text' placeholder='Search' className={content.searchInput} defaultValue={this.props.filterText}
                 onChange={(event) => this.props.onFilterTextChange(event.target.value)} autoFocus/>
        </div>
      </div>
    )
  }
}

export default Search
