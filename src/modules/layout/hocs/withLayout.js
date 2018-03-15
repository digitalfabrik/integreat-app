import React from 'react'
import cx from 'classnames'
import style from './Layout.css'

/**
 * The standard Layout, used for any view in this app as a container.
 * If a footer is supplied and there's not enough content (in header and children) to fill the viewbox, the footer will
 * always stick to the bottom of the viewbox.
 */
const withLayout = (Header, Toolbar, Footer) => WrappedComponent =>
  class Layout extends React.Component {
    constructor () {
      super()
      this.state = {stickyTop: 0}
    }

    onStickyTopChanged = stickyTop => {
      this.setState({stickyTop})
    }

    render () {
      return (
        <div className={style.richLayout}>
          <div>
            {Header && <Header onStickyTopChanged={this.onStickyTopChanged} {...this.props} />}
            <main className={style.layout}>
              <div className={cx(style.content)}>
                <WrappedComponent stickyTop={this.state.stickyTop} {...this.props} />
              </div>
            </main>
          </div>
          {Footer && <Footer {...this.props} />}
        </div>
      )
    }
  }

export default withLayout
