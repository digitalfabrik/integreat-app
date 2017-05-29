import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { chunk } from 'lodash/array'
import { values } from 'lodash/object'

import style from './Categories.css'
import helper from '../Helper/Helper.css'

import { Link } from 'react-router-dom'
import { PageModel } from '../../src/endpoints/page'

class Category extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    return (
      <div className='col-xs-6'>
        <Link className={helper.removeA} to={this.props.url + '/' + this.props.page.id}>
          <img className={cx('center-block', style.thumbnail)} src={this.props.page.thumbnail}/>
          <div className={style.caption}>{this.props.page.title}</div>
        </Link>
      </div>
    )
  }
}

export default class Categories extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    return (
      <div className='container-fluid'>
        {
          chunk(values(this.props.page.children), 2).map(pages => {
            let a = pages[0]
            let b = pages[1]
            let key = a.id + ':' + (b ? b.id : '-')
            return <div key={key} className={cx(style.row, 'row')}>
              <Category url={this.props.url} page={a}/>
              {b ? <Category url={this.props.url} page={b}/> : null}
            </div>
          })
        }
      </div>
    )
  }
}
