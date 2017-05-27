import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import style from './TopLevelPage.pcss'
import { chunk } from 'lodash/array'
import { values } from 'lodash/object'

class TopLevelTile extends React.Component {
  static propTypes = {
    page: PropTypes.object.isRequired
  }

  render () {
    return (<div className="col-xs-6">
        <img className={cx('center-block', style.thumbnail)} src={this.page.thumbnail}/>
        <div className={style.caption}>{this.page.title}</div>
        {/* We can insert our html here directly since we trust our backend cms */}
        <div key={this.page.id} className={style.remoteContent}
             dangerouslySetInnerHTML={{__html: (this.page.content)}}/>
      </div>
    )
  }
}

class TopLevelPage extends React.Component {
  static propTypes = {
    pages: PropTypes.array.isRequired
  }

  render () {
    return chunk(values(this.props.pages), 2).map(pages =>
      <div className={cx(style.row, 'row')}>
        {pages.map(page => <TopLevelTile page={page}/>)}
      </div>)
  }
}

export default TopLevelPage
