import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import style from './Layout.css'

/**
 * The standard Layout, used for any view in this app as a container.
 * If a footer is supplied and there's not enough content (in header and children) to fill the viewbox, the footer will
 * always stick to the bottom of the viewbox.
 */
class Layout extends React.Component {
  static propTypes = {
    header: PropTypes.node,
    footer: PropTypes.node,
    children: PropTypes.node
  }

  render () {
    return (
      <div className={style.richLayout}>
        <div>
          {this.props.header}
          <main className={style.layout}>
            <div className={cx(style.content)}>
              {this.props.children}
            </div>
          </main>
        </div>
        {this.props.footer}
      </div>
    )
  }
}

export default Layout
