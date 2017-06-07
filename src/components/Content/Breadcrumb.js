import React from 'react'
import PropTypes from 'prop-types'

import style from './Breadcrumb.css'
import { PageModel } from '../../endpoints/page'

export default class Breadcrumb extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    hierarchy: PropTypes.arrayOf(PropTypes.instanceOf(PageModel)).isRequired
  }

  render () {
    /* fixme make dynamic */
    return <div className={this.props.className}>{this.props.hierarchy.map(page => {
      return (
        <span key={page.id}>
          <span className={style.separator}/>
          <span className={style.level}>{ page.title }</span>
        </span>
      )
    })}</div>
  }
}
