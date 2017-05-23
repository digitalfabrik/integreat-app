import React from 'react'
import cx from 'classnames'

import content from './Search.pcss'

class Search extends React.Component {
  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    return (
      <div className="row">
        <div className={content.search}>
          <span className={cx(content.searchIcon, 'glyphicon glyphicon-search')}/>
          <input placeholder="Search" className={content.searchInput}/>
        </div>
      </div>
    )
  }
}

export default Search
