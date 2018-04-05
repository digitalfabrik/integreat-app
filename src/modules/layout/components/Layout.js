// @flow

import React from 'react'
import ReactTooltip from 'react-tooltip'
import style from './Layout.css'

type Props = {
  asideStickyTop: ?number,
  footer: ?React.Node,
  header: ?React.Node,
  toolbar: ?React.Node,
  children: ?React.Node
}

/**
 * The standard Layout, used for any view in this app as a container.
 * If a footer is supplied and there's not enough content (in header and children) to fill the viewbox, the footer will
 * always stick to the bottom of the viewbox.
 */
class Layout extends React.PureComponent<Props> {
  render () {
    const {asideStickyTop, footer, header, toolbar, children} = this.props
    return (
      <div className={style.richLayout}>
        <div>
          {header}
          <div className={style.body}>
            <aside style={{top: `${asideStickyTop}px`}} className={style.aside}>
              {toolbar}
            </aside>
            <main className={style.main}>
              {children}
            </main>
          </div>
        </div>
        {footer}
        <ReactTooltip effect='solid' delayShow={0} />
      </div>
    )
  }
}

export default Layout
