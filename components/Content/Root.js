import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { chunk } from 'lodash/array'
import { values } from 'lodash/object'

import style from './Root.pcss'
import { Link } from 'react-router-dom'
import { PageModel } from '../../src/endpoints'

class OverviewTile extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired
  }

  render () {
    return (<div className="col-xs-6">
        <Link to={'/location/augsburg/' + this.props.page.id}>
          <img className={cx('center-block', style.thumbnail)} src={this.props.page.thumbnail}/>
          <div className={style.caption}>{this.props.page.title}</div>
        </Link>
      </div>
    )
  }
}

class Root extends React.Component {
  static propTypes = {
    pages: PropTypes.objectOf(PropTypes.instanceOf(PageModel)).isRequired
  }

  render () {
    return (
      <div>
        {
          chunk(values(this.props.pages), 2).map(pages => {
            let a = pages[0]
            let b = pages[1]
            let key = a.id + ':' + (b ? b.id : '-')
            return <div key={key} className={cx(style.row, 'row')}>
              <OverviewTile page={a}/>
              {b ? <OverviewTile page={b}/> : null}
            </div>
          })
        }
      </div>
    )
  }
}

export default Root
