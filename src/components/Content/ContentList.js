import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { values } from 'lodash/object'

import { PageModel } from '../../endpoints/page'
import { Link } from 'react-router-dom'

import style from './ContentList.css'
import helper from '../Helper/Helper.css'

class ContentListElement extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    return (
      <Link className={helper.removeA} to={this.props.url + '/' + this.props.page.id}>
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
    page: PropTypes.instanceOf(PageModel).isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    return (
      <div>
        <div className={style.heading}>
          <img className={style.headingImage} src={this.props.page.thumbnail}/>
          <div className={style.headingText}>{this.props.page.title}</div>
        </div>
        <div>
          <div className={style.horizontalLine}/>
          {values(this.props.page.children).map(page => {
            return <ContentListElement key={page.id} url={this.props.url} page={page}/>
          })}
        </div>
      </div>
    )
  }
}

export default ContentList
