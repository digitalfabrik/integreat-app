import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Link } from 'redux-little-router'

import style from './ContentList.css'
import PageModel from 'endpoints/models/PageModel'

class ContentListElement extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    return (
      <Link href={this.props.url}>
        <div className={style.row}>
          <div className={cx(style.elementImage, style.element)}>
            <img className={style.image} src={this.props.page.thumbnail}/>
          </div>
          <div className={style.elementText}>{this.props.page.title}</div>
        </div>
      </Link>
    )
  }
}

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
        { this.props.pages.map(({ page, url }) => <ContentListElement key={url} url={url} page={page} />) }
      </div>
    )
  }
}

export default ContentList
