import React from 'react'
import PropTypes from 'prop-types'
import Layout from 'components/Layout'
import Header from './Header'
import Footer from './Footer'

import style from './style.css'

class RichLayout extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }

  render () {
    return (
      <div className={style.richLayout}>
        <Header />

        <Layout className={this.props.className}>
          {this.props.children}
        </Layout>

        <Footer/>
      </div>
    )
  }
}

export default RichLayout
