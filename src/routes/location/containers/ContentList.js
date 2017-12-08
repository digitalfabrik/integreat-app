import React from 'react'
import PropTypes from 'prop-types'

import style from './ContentList.css'
import PageModel from 'modules/endpoint/models/PageModel'
import CategoryListItem from '../components/CategoryListItem'

class ContentList extends React.Component {
  static propTypes = {
    pages: PropTypes.arrayOf(PropTypes.shape({
      page: PropTypes.instanceOf(PageModel).isRequired,
      url: PropTypes.string.isRequired
    })).isRequired
  }

  render () {
    return (
      <div className={style.list}>
        { this.props.pages.map(({ page, url }) => <CategoryListItem key={url} url={url} page={page} />) }
      </div>
    )
  }
}

export default ContentList
