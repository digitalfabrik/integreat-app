import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { values } from 'lodash/object'
import { isEmpty } from 'lodash/lang'

import Spinner from 'react-spinkit'

import style from './Page.pcss'
import { chunk } from 'lodash/array'

class Page extends React.Component {
  static propTypes = {
    pages: PropTypes.array.isRequired
  }

  renderPages (pages) {
    return chunk(values(pages), 2).map((pages) =>

      (<div className={cx(style.row, 'row')}>

        {pages.map(page => {
          return (<div className="col-xs-6">
            <img className={cx('center-block', style.thumbnail)} src={page.thumbnail}/>
            <div className={style.caption}>{page.title}</div>
            {/* We can insert our html here directly since we trust our backend cms */}
            <div key={page.id} className={style.remoteContent} dangerouslySetInnerHTML={{__html: (page.content)}}/>
          </div>)
        })}
      </div>)
    )
  }

  render () {
    const spinner = <Spinner className={style.loading} name='line-scale-party'/>
    return (
      <div>
        <div className="row">
          {isEmpty(this.props.pages) ? spinner : this.renderPages(this.props.pages)}
        </div>
      </div>
    )
  }
}

export default Page
