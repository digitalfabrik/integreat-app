// @flow

import React from 'react'
import ReactTooltip from 'react-tooltip'
import { Aside, Body, RichLayout, Main } from './Layout.styles'
import type { Node } from 'react'

type PropsType = {
  asideStickyTop: number,
  footer?: Node,
  header?: Node,
  toolbar?: Node,
  modal?: Node,
  children?: Node
}

/**
 * The standard Layout, used for any view in this app as a container.
 * If a footer is supplied and there's not enough content (in header and children) to fill the viewbox, the footer will
 * always stick to the bottom of the viewbox.
 */
class Layout extends React.PureComponent<PropsType> {
  static defaultProps = {
    asideStickyTop: 0
  }

  render () {
    const {asideStickyTop, footer, header, toolbar, modal, children} = this.props
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
          {modal}
        </div>
        {footer}
        <ReactTooltip effect='solid' delayShow={0} />
      </RichLayout>
    )
  }
}

export default Layout
