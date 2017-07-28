import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { map } from 'lodash/collection'

import { Link } from 'react-router-dom'

import style from './ContentList.css'
import helper from 'components/Helper/Helper.css'
import PageModel from 'endpoints/models/PageModel'

class ContentListElement extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    return (
      <Link className={helper.removeA} to={this.props.url}>
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
    pages: PropTypes.object.isRequired
  }

  render () {
    return (
      <div>
        {
          map(this.props.pages, (page, url) => {
            return <ContentListElement key={url} url={url} page={page}/>
          })
        }
      </div>
    )
  }
}

export default ContentList
