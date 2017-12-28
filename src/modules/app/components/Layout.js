import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import style from './Layout.css'

class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    header: PropTypes.node,
    footer: PropTypes.node
  }

  render () {
    return (
      <div className={style.richLayout}>
        <div>
          {this.props.header}
          <main className={style.layout}>
            <div className={cx(style.content, this.props.className)}>{this.props.children}</div>
          </main>
        </div>
        {this.props.footer}
      </div>
    )
  }
}

export default Layout
