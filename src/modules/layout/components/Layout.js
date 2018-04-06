// @flow

import React from 'react'
import ReactTooltip from 'react-tooltip'
import { Aside, Body, RichLayout, Main } from './Layout.styles'

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
      <RichLayout>
        <div>
          {header}
          <Body>
            <Aside style={{top: `${asideStickyTop}px`}}>
              {toolbar}
            </Aside>
            <Main>
              {children}
            </Main>
          </Body>
        </div>
        {footer}
        <ReactTooltip effect='solid' delayShow={0} />
      </RichLayout>
    )
  }
}

export default Layout
