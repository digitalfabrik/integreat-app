import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Header from './Header'
import s from './Layout.css'

class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    return (
      <div>
        <Header/>
        <main className={s.topSpacing}>
          <div {...this.props} className={cx(s.content, this.props.className)}/>
        </main>
      </div>
    )
  }
}

export default Layout
