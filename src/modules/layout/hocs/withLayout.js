// @flow

import React from 'react'
import type { ComponentType } from 'react'
import ReactTooltip from 'react-tooltip'
import style from './Layout.css'

/**
 * The standard Layout, used for any view in this app as a container.
 * If a footer is supplied and there's not enough content (in header and children) to fill the viewbox, the footer will
 * always stick to the bottom of the viewbox.
 */
const withLayout = (Header: ComponentType<{ onStickyTopChanged: number => void }>,
                    Toolbar: ?ComponentType<{}>,
                    Footer: ComponentType<{}>) => (WrappedComponent: ComponentType<{}>) =>
  class Layout extends React.Component<{}, { stickyTop: number }> {
    state = {stickyTop: 0}

    onStickyTopChanged = (stickyTop: number) => this.setState({stickyTop})

    render () {
      return (
        <div className={style.richLayout}>
          <div>
            {Header && <Header onStickyTopChanged={this.onStickyTopChanged} {...this.props} />}
            <div className={style.body}>
              <aside style={{top: `${this.state.stickyTop}px`}} className={style.aside}>
                {Toolbar && <Toolbar {...this.props} />}
              </aside>
              <main className={style.main}>
                <WrappedComponent {...this.props} />
              </main>
            </div>
          </div>
          {Footer && <Footer {...this.props} />}
          <ReactTooltip effect='solid' delayShow={0} />
        </div>
      )
    }
  }

export default withLayout
