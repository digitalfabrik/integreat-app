import React from 'react'
import PropTypes from 'prop-types'

import { values } from 'lodash/object'

import { PageModel } from '../../src/endpoints/page'
import { Link } from 'react-router-dom'

import style from './ContentList.pcss'

class ContentListElement extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    return (
      <Link to={this.props.url + '/' + this.props.page.id}>
        <div className={style.element}>
          <img className={style.elementImage} src={this.props.page.thumbnail}/>
          {this.props.page.title}
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
        <div>
          <img className={style.headingImage} src={this.props.page.thumbnail}/>
          <div className={style.headingText}>{this.props.page.title}</div>
        </div>
        <div>
          {values(this.props.page.children).map(page => {
            return <ContentListElement key={page.id} url={this.props.url} page={page}/>
          })}
        </div>
      </div>
    )
  }
}

export default ContentList
