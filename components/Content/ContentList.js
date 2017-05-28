import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { values } from 'lodash/object'

import { PageModel } from '../../src/endpoints/page'
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
      <div className={cx(style.row, 'row')}>
        <Link className={helper.removeA} to={this.props.url + '/' + this.props.page.id}>
          <div className={cx(style.element, 'col-xs-1')}>
            <img className={style.elementImage} src={this.props.page.thumbnail}/>
          </div>
          <div className={cx(style.elementText, 'col-xs-11')}>{this.props.page.title}</div>
        </Link>
      </div>
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
        <div className='container-fluid'>
          <div className={cx(style.horizontalLine, 'row')}/>
          {values(this.props.page.children).map(page => {
            return <ContentListElement key={page.id} url={this.props.url} page={page}/>
          })}
        </div>
      </div>
    )
  }
}

export default ContentList
